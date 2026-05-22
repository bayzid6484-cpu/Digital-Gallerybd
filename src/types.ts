export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  walletBalance: number;
  referralCode: string;
  referredBy?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  nameBn: string;
  nameEn: string;
  slug: string;
  iconName: string;
  descriptionBn: string;
  descriptionEn: string;
}

export interface Service {
  id: string;
  categoryId: string;
  nameBn: string;
  nameEn: string;
  descriptionBn: string;
  descriptionEn: string;
  pricePerUnit: number; // Price in BDT
  minQuantity: number;
  maxQuantity: number;
  featured: boolean;
  deliveryTimeBn: string;
  deliveryTimeEn: string;
  inputTypeLabelBn: string; // e.g. "প্রোফাইল লিংক" vs "গ্রুপ লিংক"
  inputTypeLabelEn: string; // e.g. "Profile Link" vs "Group Link"
  inputTypePlaceholderBn: string;
  inputTypePlaceholderEn: string;
}

export interface Order {
  id: string;
  userId: string | null; // For guest checkout, null is okay
  guestEmail?: string;
  serviceId: string;
  categoryId: string;
  targetLink: string;
  quantity: number;
  totalPrice: number;
  orderNote?: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
  createdAt: string;
  customFields?: Record<string, string>;
}

export interface PaymentMethod {
  id: string;
  name: string;
  logo: string;
  accountNumber?: string;
  instructionsBn: string;
  instructionsEn: string;
  enabled: boolean;
  chargePercent: number; // e.g. 1.5% for bKash
}

export interface PaymentTransaction {
  id: string;
  userId: string;
  amount: number;
  method: string;
  senderNumber?: string;
  transactionId?: string;
  screenshotUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  type: 'deposit' | 'checkout';
  createdAt: string;
  note?: string;
}

export interface TicketMessage {
  senderId: string;
  senderName: string;
  message: string;
  createdAt: string;
  fileUrl?: string;
  role: 'admin' | 'user';
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  subject: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'answered' | 'closed';
  messages: TicketMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  minOrderAmount: number;
  maxDiscount?: number;
  expiryDate: string;
  active: boolean;
}

export interface Blog {
  id: string;
  titleBn: string;
  titleEn: string;
  contentBn: string;
  contentEn: string;
  categoryBn: string;
  categoryEn: string;
  imageUrl: string;
  createdAt: string;
  views: number;
}

export interface HomepagePromoBanner {
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
  ctaTextBn: string;
  ctaTextEn: string;
  active: boolean;
  link: string;
}

export interface AppSettings {
  siteNameBn: string;
  siteNameEn: string;
  announcementBn: string;
  announcementEn: string;
  contactEmail: string;
  contactPhone: string;
  contactAddressBn: string;
  contactAddressEn: string;
  facebookUrl?: string;
  telegramUrl?: string;
  youtubeUrl?: string;
  whatsappNumber?: string;
  promoBanner: HomepagePromoBanner;
  currencySymbol: string; // e.g., "৳" or "$"
  referrerCommissionPercent: number; // e.g. 5%
}
