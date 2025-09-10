// src/lib/marketplaceAdapter.ts

export type SellerStatus = "active" | "suspended" | "banned";

export type Seller = {
  id: string;
  name: string;
  whatsapp: string;      // "233XXXXXXXXX"
  location: string;      // e.g., "Rawlings Park"
  verified: boolean;
  status: SellerStatus;
  credits?: number;      // boost credits
  created_at?: string;
};

export type Product = {
  id: string;
  seller_id: string;
  title: string;
  description?: string;
  price: number;
  currency: "GHS";
  category: string;
  images: string[];
  location: string;
  boosted_until?: string | null;
  rating?: number;
  featured?: boolean;
  created_at?: string;
};

export type InquiryLog = {
  id: string;
  product_id: string;
  seller_id: string;
  buyer_phone?: string | null;
  clicked_at: string;
};

export type Payment = {
  id: string;
  seller_id: string | null;
  type: "boost" | "verification";
  credits?: number | null; // for 'boost'
  amount: number;
  currency: "GHS";
  reference?: string | null;
  created_at: string;
};

export type AuditLog = {
  id: string;
  at: string;
  admin_email: string;
  action: string;     // e.g., 'verify_seller', 'suspend_seller', 'add_credits', 'set_settings', etc.
  subject?: string;   // seller_id / product_id / email or other
  meta?: Record<string, unknown>;
};

export type AdminSettings = {
  public_whatsapp: string;     // shown publicly
  support_email: string;       // shown publicly
  livestream_url: string;      // Makola Live
  homepage_banner: string;     // System Message
};

export interface MarketplaceDataSource {
  // Sellers
  createSeller(input: Omit<Seller, "id"|"verified"|"status"> & { verified?: boolean; status?: SellerStatus }): Promise<Seller>;
  listSellers(): Promise<Seller[]>;
  verifySeller(sellerId: string, verified: boolean): Promise<void>;
  updateSeller(sellerId: string, patch: Partial<Seller>): Promise<Seller>;

  // Products
  createProduct(input: Omit<Product, "id"|"created_at">): Promise<Product>;
  listProducts(opts?: { category?: string; search?: string }): Promise<Product[]>;
  listSellerProducts(sellerId: string): Promise<Product[]>;
  updateProduct(productId: string, patch: Partial<Product>): Promise<Product>;
  deleteProduct(productId: string): Promise<void>;
  boostProduct(productId: string, days: number): Promise<void>;

  // Analytics
  logInquiry(input: Omit<InquiryLog, "id"|"clicked_at">): Promise<void>;

  // ---- ADMIN ACTIONS ----
  adminSetSellerStatus(sellerId: string, status: SellerStatus): Promise<void>;
  adminDeleteProduct(productId: string): Promise<void>;
  adminSetProductFeatured(productId: string, featured: boolean): Promise<void>;
  adminAddBoostCredits(sellerId: string, credits: number): Promise<void>;
  adminUseBoostCredits(sellerId: string, credits: number): Promise<boolean>; // returns success
  adminStats(): Promise<{ sellers: number; products: number; inquiries: number; todayClicks: number }>;

  // Settings
  adminGetSettings(): Promise<AdminSettings>;
  adminSetSettings(input: Partial<AdminSettings>): Promise<AdminSettings>;

  // Payments
  adminListPayments(): Promise<Payment[]>;
  adminAddPayment(p: Omit<Payment, "id"|"created_at">): Promise<Payment>;

  // Audit
  adminListAudit(): Promise<AuditLog[]>;
  adminLogAction(entry: Omit<AuditLog, "id"|"at">): Promise<void>;
}