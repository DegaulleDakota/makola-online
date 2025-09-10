// Multi-language support for Makola Marketplace
export interface LanguageStrings {
  // Navigation
  home: string;
  products: string;
  sellers: string;
  about: string;
  contact: string;
  
  // Search & Filters
  searchPlaceholder: string;
  voiceSearch: string;
  imageSearch: string;
  allCategories: string;
  food: string;
  electronics: string;
  fashion: string;
  
  // Product Actions
  chatOnWhatsApp: string;
  viewDetails: string;
  requestReceipt: string;
  boost: string;
  boosted: string;
  verified: string;
  
  // Seller Onboarding
  registerAsSeller: string;
  businessName: string;
  phoneNumber: string;
  location: string;
  uploadPhotos: string;
  productName: string;
  category: string;
  price: string;
  description: string;
  deliveryAvailable: string;
  submit: string;
  
  // Common
  loading: string;
  error: string;
  success: string;
  cancel: string;
  save: string;
  edit: string;
  delete: string;
}

export const languages: Record<string, LanguageStrings> = {
  en: {
    home: "Home",
    products: "Products",
    sellers: "Sellers",
    about: "About",
    contact: "Contact",
    searchPlaceholder: "Search products, sellers...",
    voiceSearch: "Voice Search",
    imageSearch: "Image Search",
    allCategories: "All Categories",
    food: "Food",
    electronics: "Electronics",
    fashion: "Fashion",
    chatOnWhatsApp: "Chat on WhatsApp",
    viewDetails: "View Details",
    requestReceipt: "Request Receipt",
    boost: "Boost",
    boosted: "Boosted",
    verified: "Verified",
    registerAsSeller: "Register as Seller",
    businessName: "Business Name",
    phoneNumber: "Phone Number",
    location: "Location",
    uploadPhotos: "Upload Photos",
    productName: "Product Name",
    category: "Category",
    price: "Price",
    description: "Description",
    deliveryAvailable: "Delivery Available",
    submit: "Submit",
    loading: "Loading...",
    error: "Error",
    success: "Success",
    cancel: "Cancel",
    save: "Save",
    edit: "Edit",
    delete: "Delete"
  },
  tw: {
    home: "Fie",
    products: "Nneɛma",
    sellers: "Adwumayɛfoɔ",
    about: "Yɛn ho",
    contact: "Frɛ yɛn",
    searchPlaceholder: "Hwehwɛ nneɛma, adwumayɛfoɔ...",
    voiceSearch: "Nne Hwehwɛ",
    imageSearch: "Mfonini Hwehwɛ",
    allCategories: "Akuw nyinaa",
    food: "Aduane",
    electronics: "Anyinam nneɛma",
    fashion: "Ntadeɛ",
    chatOnWhatsApp: "Kasa wɔ WhatsApp so",
    viewDetails: "Hwɛ nsɛm",
    requestReceipt: "Bisa gyinaeɛ krataa",
    boost: "Ma ɛnkɔ soro",
    boosted: "Akɔ soro",
    verified: "Wɔahwɛ mu",
    registerAsSeller: "Kyerɛw wo din sɛ dwumayɛni",
    businessName: "Adwuma din",
    phoneNumber: "Telefon nɔma",
    location: "Baabi",
    uploadPhotos: "Fa mfonini kɔ soro",
    productName: "Adeɛ din",
    category: "Akuw",
    price: "Boɔ",
    description: "Nsɛm",
    deliveryAvailable: "Wɔbɛtumi de aba",
    submit: "Fa kɔ",
    loading: "Ɛrekɔ so...",
    error: "Mfomsoɔ",
    success: "Ɛyɛɛ yie",
    cancel: "Gyae",
    save: "Sie",
    edit: "Sesa",
    delete: "Yi fi"
  },
  pidgin: {
    home: "Home",
    products: "Things",
    sellers: "People wey dey sell",
    about: "About us",
    contact: "Contact us",
    searchPlaceholder: "Find things, sellers...",
    voiceSearch: "Talk Search",
    imageSearch: "Picture Search",
    allCategories: "All Things",
    food: "Chop",
    electronics: "Phone & Computer",
    fashion: "Cloth",
    chatOnWhatsApp: "Chat for WhatsApp",
    viewDetails: "See more",
    requestReceipt: "Ask for receipt",
    boost: "Push am up",
    boosted: "E don go up",
    verified: "We don check am",
    registerAsSeller: "Register as seller",
    businessName: "Business name",
    phoneNumber: "Phone number",
    location: "Where you dey",
    uploadPhotos: "Upload pictures",
    productName: "Wetin you dey sell",
    category: "Which group",
    price: "How much",
    description: "Talk about am",
    deliveryAvailable: "You fit deliver",
    submit: "Send am",
    loading: "E dey load...",
    error: "Problem",
    success: "E work",
    cancel: "Cancel",
    save: "Save",
    edit: "Change",
    delete: "Remove"
  }
};