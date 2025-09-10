// src/lib/localAdapter.ts
import {
  MarketplaceDataSource, Seller, Product, InquiryLog, SellerStatus,
  AdminSettings, Payment, AuditLog
} from "./marketplaceAdapter";

const LS_KEYS = {
  sellers: "mk_sellers",
  products: "mk_products",
  inquiries: "mk_inquiries",
  settings: "mk_settings",
  payments: "mk_payments",
  audit: "mk_audit",
};

function uid() { return crypto.randomUUID(); }
function nowISO() { return new Date().toISOString(); }

function get<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key);
  return raw ? (JSON.parse(raw) as T) : fallback;
}
function set<T>(key: string, v: T) {
  localStorage.setItem(key, JSON.stringify(v));
}
function todayYMD(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

const DEFAULT_SETTINGS: AdminSettings = {
  public_whatsapp: "[Your WhatsApp Number]",
  support_email: "[Your Support Email]",
  livestream_url: "https://youtube.com/live",
  homepage_banner: "Welcome to Makola Online - Ghana's Premier Marketplace"
};

class LocalMarketplaceAdapter implements MarketplaceDataSource {
  async createSeller(input: Omit<Seller, "id"|"verified"|"status"> & { verified?: boolean; status?: SellerStatus }): Promise<Seller> {
    const sellers = get<Seller[]>(LS_KEYS.sellers, []);
    const seller: Seller = {
      ...input,
      id: uid(),
      verified: input.verified ?? false,
      status: input.status ?? "active",
      credits: input.credits ?? 0,
      created_at: nowISO(),
    };
    sellers.push(seller);
    set(LS_KEYS.sellers, sellers);
    return seller;
  }

  async listSellers(): Promise<Seller[]> {
    return get<Seller[]>(LS_KEYS.sellers, []);
  }

  async verifySeller(sellerId: string, verified: boolean): Promise<void> {
    const sellers = get<Seller[]>(LS_KEYS.sellers, []);
    const seller = sellers.find(s => s.id === sellerId);
    if (seller) {
      seller.verified = verified;
      set(LS_KEYS.sellers, sellers);
    }
  }

  async updateSeller(sellerId: string, patch: Partial<Seller>): Promise<Seller> {
    const sellers = get<Seller[]>(LS_KEYS.sellers, []);
    const seller = sellers.find(s => s.id === sellerId);
    if (!seller) throw new Error("Seller not found");
    
    Object.assign(seller, patch);
    set(LS_KEYS.sellers, sellers);
    return seller;
  }

  async createProduct(input: Omit<Product, "id"|"created_at">): Promise<Product> {
    const products = get<Product[]>(LS_KEYS.products, []);
    const product: Product = {
      ...input,
      id: uid(),
      created_at: nowISO(),
    };
    products.push(product);
    set(LS_KEYS.products, products);
    return product;
  }

  async listProducts(opts?: { category?: string; search?: string }): Promise<Product[]> {
    let products = get<Product[]>(LS_KEYS.products, []);
    
    if (opts?.category) {
      products = products.filter(p => p.category === opts.category);
    }
    if (opts?.search) {
      const search = opts.search.toLowerCase();
      products = products.filter(p => 
        p.title.toLowerCase().includes(search) ||
        p.description?.toLowerCase().includes(search)
      );
    }
    
    return products.sort((a, b) => {
      // Boosted products first
      if (a.boosted_until && !b.boosted_until) return -1;
      if (!a.boosted_until && b.boosted_until) return 1;
      // Featured products next
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      // Then by creation date
      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    });
  }


  async listSellerProducts(sellerId: string): Promise<Product[]> {
    const products = get<Product[]>(LS_KEYS.products, []);
    return products.filter(p => p.seller_id === sellerId).sort((a, b) => 
      new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
    );
  }

  async updateProduct(productId: string, patch: Partial<Product>): Promise<Product> {
    const products = get<Product[]>(LS_KEYS.products, []);
    const product = products.find(p => p.id === productId);
    if (!product) throw new Error("Product not found");
    
    Object.assign(product, patch);
    set(LS_KEYS.products, products);
    return product;
  }

  async deleteProduct(productId: string): Promise<void> {
    const products = get<Product[]>(LS_KEYS.products, []);
    const filtered = products.filter(p => p.id !== productId);
    set(LS_KEYS.products, filtered);
  }
  async boostProduct(productId: string, days: number): Promise<void> {
    const products = get<Product[]>(LS_KEYS.products, []);
    const product = products.find(p => p.id === productId);
    if (product) {
      const boostUntil = new Date();
      boostUntil.setDate(boostUntil.getDate() + days);
      product.boosted_until = boostUntil.toISOString();
      set(LS_KEYS.products, products);
    }
  }

  async logInquiry(input: Omit<InquiryLog, "id"|"clicked_at">): Promise<void> {
    const inquiries = get<InquiryLog[]>(LS_KEYS.inquiries, []);
    const inquiry: InquiryLog = {
      ...input,
      id: uid(),
      clicked_at: nowISO(),
    };
    inquiries.push(inquiry);
    set(LS_KEYS.inquiries, inquiries);
  }

  async adminSetSellerStatus(sellerId: string, status: SellerStatus): Promise<void> {
    const sellers = get<Seller[]>(LS_KEYS.sellers, []);
    const seller = sellers.find(s => s.id === sellerId);
    if (seller) {
      seller.status = status;
      set(LS_KEYS.sellers, sellers);
    }
  }

  async adminDeleteProduct(productId: string): Promise<void> {
    const products = get<Product[]>(LS_KEYS.products, []);
    const filtered = products.filter(p => p.id !== productId);
    set(LS_KEYS.products, filtered);
  }

  async adminSetProductFeatured(productId: string, featured: boolean): Promise<void> {
    const products = get<Product[]>(LS_KEYS.products, []);
    const product = products.find(p => p.id === productId);
    if (product) {
      product.featured = featured;
      set(LS_KEYS.products, products);
    }
  }

  async adminAddBoostCredits(sellerId: string, credits: number): Promise<void> {
    const sellers = get<Seller[]>(LS_KEYS.sellers, []);
    const seller = sellers.find(s => s.id === sellerId);
    if (seller) {
      seller.credits = (seller.credits || 0) + credits;
      set(LS_KEYS.sellers, sellers);
    }
  }

  async adminUseBoostCredits(sellerId: string, credits: number): Promise<boolean> {
    const sellers = get<Seller[]>(LS_KEYS.sellers, []);
    const seller = sellers.find(s => s.id === sellerId);
    if (seller && (seller.credits || 0) >= credits) {
      seller.credits = (seller.credits || 0) - credits;
      set(LS_KEYS.sellers, sellers);
      return true;
    }
    return false;
  }

  async adminStats(): Promise<{ sellers: number; products: number; inquiries: number; todayClicks: number }> {
    const sellers = get<Seller[]>(LS_KEYS.sellers, []);
    const products = get<Product[]>(LS_KEYS.products, []);
    const inquiries = get<InquiryLog[]>(LS_KEYS.inquiries, []);
    const today = todayYMD();
    const todayClicks = inquiries.filter(i => i.clicked_at.startsWith(today)).length;
    
    return {
      sellers: sellers.length,
      products: products.length,
      inquiries: inquiries.length,
      todayClicks
    };
  }

  async adminGetSettings(): Promise<AdminSettings> {
    return get<AdminSettings>(LS_KEYS.settings, DEFAULT_SETTINGS);
  }

  async adminSetSettings(input: Partial<AdminSettings>): Promise<AdminSettings> {
    const current = get<AdminSettings>(LS_KEYS.settings, DEFAULT_SETTINGS);
    const updated = { ...current, ...input };
    set(LS_KEYS.settings, updated);
    return updated;
  }

  async adminListPayments(): Promise<Payment[]> {
    return get<Payment[]>(LS_KEYS.payments, []);
  }

  async adminAddPayment(p: Omit<Payment, "id"|"created_at">): Promise<Payment> {
    const payments = get<Payment[]>(LS_KEYS.payments, []);
    const payment: Payment = {
      ...p,
      id: uid(),
      created_at: nowISO(),
    };
    payments.push(payment);
    set(LS_KEYS.payments, payments);
    return payment;
  }

  async adminListAudit(): Promise<AuditLog[]> {
    return get<AuditLog[]>(LS_KEYS.audit, []).sort((a, b) => 
      new Date(b.at).getTime() - new Date(a.at).getTime()
    );
  }

  async adminLogAction(entry: Omit<AuditLog, "id"|"at">): Promise<void> {
    const audit = get<AuditLog[]>(LS_KEYS.audit, []);
    const log: AuditLog = {
      ...entry,
      id: uid(),
      at: nowISO(),
    };
    audit.push(log);
    set(LS_KEYS.audit, audit);
  }
}

export const localAdapter = new LocalMarketplaceAdapter();
export default localAdapter;