import { Category, Service, Blog, AppSettings, Coupon, SupportTicket, UserProfile, Order, PaymentTransaction } from '../types';

export const defaultCategories: Category[] = [
  {
    id: 'cat-subs',
    nameBn: 'প্রিমিয়াম অ্যাকাউন্ট ও সাবস্ক্রিপশন',
    nameEn: 'Premium Subscriptions',
    slug: 'premium-subscriptions',
    iconName: 'Tv',
    descriptionBn: 'নেটফ্লিক্স, ক্যানভা প্রিমিয়াম, স্পটিফাই, চ্যাটজিপিটি প্লাস এবং ইত্যাদি সাবস্ক্রিপশন',
    descriptionEn: 'Premium access for Netflix UHD, Canva Pro, Spotify, and ChatGPT Plus'
  },
  {
    id: 'cat-keys',
    nameBn: 'সফটওয়্যার ও জেনুইন লাইসেন্স কি',
    nameEn: 'Software License Keys',
    slug: 'software-keys',
    iconName: 'Key',
    descriptionBn: 'উইন্ডোজ ১১/১০ প্রো, মাইক্রোসফট অফিস, আইডিএম এবং এন্টিভাইরাস রিটেইল কি',
    descriptionEn: 'Legitimate retail activation keys for Windows, MS Office, IDM & premium tools'
  },
  {
    id: 'cat-topup',
    nameBn: 'গেম টপ-আপ ও গিফট কার্ড',
    nameEn: 'Game Top-Up & Gift Cards',
    slug: 'game-topup',
    iconName: 'Gamepad2',
    descriptionBn: 'ফ্রি ফায়ার ডায়মন্ড, পাবজি ইউসি এবং গুগল প্লে, স্টিম গিফট কার্ড',
    descriptionEn: 'Instant Free Fire Diamonds UID topups, PUBG UC and popular gaming cards'
  },
  {
    id: 'cat-templates',
    nameBn: 'প্রিমিয়াম থিম, প্লাগইন ও টেমপ্লেট',
    nameEn: 'Themes, Plugins & Templates',
    slug: 'premium-assets',
    iconName: 'Code',
    descriptionBn: 'এলিমেন্টর প্রো লাইসেন্স, ওয়ার্ডপ্রেস প্রিমিয়াম ফাইল, থিম ও পিএইচপি স্ক্রিপ্টস',
    descriptionEn: 'Official Elementor Pro activations, WordPress premium plugins and clean codes'
  },
  {
    id: 'cat-smm',
    nameBn: 'সোশ্যাল বুস্টিং ও ট্রাফিক প্যাক',
    nameEn: 'Social Media Growth Packs',
    slug: 'social-boosting',
    iconName: 'Share2',
    descriptionBn: 'ফেসবুক ফলোয়ার, লাইক, ওয়াচটাইম, এবং ইউটিউব বা টিকটক ইউনিক ট্রাফিক বুস্ট সার্ভিস',
    descriptionEn: 'High quality page followers, organic views, target hits and web traffic'
  }
];

export const defaultServices: Service[] = [
  // Category 1: Subscriptions
  {
    id: 'srv-subs-netflix',
    categoryId: 'cat-subs',
    nameBn: 'Netflix 4K Ultra HD Premium ১-প্রোফাইল (১ মাস মেয়াদী)',
    nameEn: 'Netflix 4K Ultra HD Premium 1-Profile Shared account (30 Days)',
    descriptionBn: 'সম্পূর্ণ ৩০ দিনের গ্যারান্টি সহ ওরিজিনাল প্রোফাইল। পিন কোড সিকিউর করা থাকবে। মোবাইল, টিভি বা ল্যাপটপে ব্যবহার করতে পারবেন। কাস্টম প্রোফাইল নাম যুক্ত করার সুযোগ আছে।',
    descriptionEn: 'Full 30-day premium profile with secure private PIN lock. Works on phone, smart TV, or laptop. Single device stream.',
    pricePerUnit: 150, // 150 BDT flat price
    minQuantity: 1,
    maxQuantity: 5,
    featured: true,
    deliveryTimeBn: '১০-৩০ মিনিট',
    deliveryTimeEn: '10-30 Mins',
    inputTypeLabelBn: 'আপনার ডেলিভারি ইমেইল অথবা হোয়াটসঅ্যাপ নাম্বার',
    inputTypeLabelEn: 'Your Delivery Email or WhatsApp Number',
    inputTypePlaceholderBn: 'যেমন: bayzid@gmail.com / 01712xxxxxx',
    inputTypePlaceholderEn: 'e.g., bayzid@gmail.com / 01712xxxxxx'
  },
  {
    id: 'srv-subs-canva',
    categoryId: 'cat-subs',
    nameBn: 'Canva Pro Premium আজীবন লাইফটাইম (ইনভাইট লিংক)',
    nameEn: 'Canva Pro Premium Lifetime Membership (Team Invite Link)',
    descriptionBn: 'আপনার সম্পূর্ণ নিজস্ব ক্যানভা ইমেইলে আজীবনের জন্য ক্যানভা প্রো মেম্বারশিপ অ্যাক্টিভ করে দেওয়া হবে। কোনো পাসওয়ার্ড শেয়ারের প্রয়োজন নেই।',
    descriptionEn: 'Upgrade your personal Canva account to Pro. We dispatch a secret team premium invite link. No password required.',
    pricePerUnit: 49,
    minQuantity: 1,
    maxQuantity: 10,
    featured: true,
    deliveryTimeBn: 'ইনস্ট্যান্ট (৫ মিনিট)',
    deliveryTimeEn: 'Instant (5 Mins)',
    inputTypeLabelBn: 'ক্যানভা ইমেইল (যে ইমেইলে ইনভাইট চান)',
    inputTypeLabelEn: 'Canva Email (Where you want to receive the invite)',
    inputTypePlaceholderBn: 'যেমন: bayzid@gmail.com',
    inputTypePlaceholderEn: 'e.g., bayzid@gmail.com'
  },
  {
    id: 'srv-subs-spotify',
    categoryId: 'cat-subs',
    nameBn: 'Spotify Premium ১-মাস প্রাইভেট সাবস্ক্রিপশন (Family Invite)',
    nameEn: 'Spotify Premium 1-Month Private Premium (Family Invite)',
    descriptionBn: 'আপনার ব্যক্তিগত স্পটিফাই ওল্ড বা নিউ অ্যাকাউন্টে ১ মাসের প্রিমিয়াম অ্যাড করে দেওয়া হবে। অফলাইন ডাউনলোড এবং অ্যাড-মুক্ত মিউজিক শুনুন।',
    descriptionEn: 'Get 30 days of seamless, ad-free music with offline downloads on your personal Spotify account via family invitation.',
    pricePerUnit: 99,
    minQuantity: 1,
    maxQuantity: 3,
    featured: false,
    deliveryTimeBn: '১০-৩০ মিনিট',
    deliveryTimeEn: '10-30 Mins',
    inputTypeLabelBn: 'আপনার স্পটিফাই অ্যাকাউন্ট ইমেল',
    inputTypeLabelEn: 'Your Spotify Account Email',
    inputTypePlaceholderBn: 'যেমন: spot_id@gmail.com',
    inputTypePlaceholderEn: 'e.g., spot_id@gmail.com'
  },

  // Category 2: Software & Keys
  {
    id: 'srv-keys-win11',
    categoryId: 'cat-keys',
    nameBn: 'Windows 11 Pro Genuine OEM/Retail Lifetime Activation Key',
    nameEn: 'Windows 11 Pro Genuine OEM/Retail Lifetime Activation Key',
    descriptionBn: 'মাইক্রোসফটের ওরিজিনাল রিটেইল অ্যাক্টিভেশন কি। এটি সারাজীবনের জন্য স্থায়ী থাকবে এবং অনলাইন আপডেট করা যাবে। ১টি উইন্ডোজ ১১ পিসির জন্য কার্যকর।',
    descriptionEn: '100% genuine retail activation digital key. Lifetime validation, official updates safe. One key binds to single PC motherboard.',
    pricePerUnit: 290,
    minQuantity: 1,
    maxQuantity: 10,
    featured: true,
    deliveryTimeBn: '১০ মিনিট - ১ ঘণ্টা',
    deliveryTimeEn: '10 Mins - 1 Hour',
    inputTypeLabelBn: 'কি ডেলিভারির জন্য আপনার ইমেইল অথবা হোয়াটসঅ্যাপ নাম্বার',
    inputTypeLabelEn: 'Contact Email or WhatsApp to deliver the License Key',
    inputTypePlaceholderBn: 'যেমন: keydelivery@gmail.com',
    inputTypePlaceholderEn: 'e.g., keydelivery@gmail.com'
  },
  {
    id: 'srv-keys-office',
    categoryId: 'cat-keys',
    nameBn: 'Microsoft Office 2021 Professional Plus Lifetime License Key',
    nameEn: 'Microsoft Office 2021 Professional Plus Lifetime License Key',
    descriptionBn: 'মাইক্রোসফট অফিস ২০২১ প্রো প্লাস জেনুইন অ্যাক্টিভেশন ডিজিটাল কোড। ওয়ার্ড, এক্সেল, পাওয়ারপয়েন্ট আজীবনের জন্য আনলক হয়ে যাবে।',
    descriptionEn: 'Authentic digital product key for MS Office 2021 Professional Plus. Permanently unlocks Word, Excel, and PowerPoint.',
    pricePerUnit: 350,
    minQuantity: 1,
    maxQuantity: 5,
    featured: false,
    deliveryTimeBn: '৩০ মিনিট - ২ ঘণ্টা',
    deliveryTimeEn: '30 Mins - 2 Hours',
    inputTypeLabelBn: 'ইমেইল এড্রেস (ডেলিভারির জন্য)',
    inputTypeLabelEn: 'Email Address for key delivery',
    inputTypePlaceholderBn: 'যেমন: deliver@gmail.com',
    inputTypePlaceholderEn: 'e.g., deliver@gmail.com'
  },
  {
    id: 'srv-keys-idm',
    categoryId: 'cat-keys',
    nameBn: 'Internet Download Manager (IDM) Lifetime License Key (1-PC)',
    nameEn: 'Internet Download Manager (IDM) Lifetime License Key (1-PC)',
    descriptionBn: 'আজীবন মেয়াদী অরজিনাল আইডিএম লাইসেন্স কোড। অফিসিয়াল সাইট থেকে ডাউনলোড করে ভেরিফাই করতে পারবেন। রি-রেজিস্ট্রেশন বা ক্র্যাকের ক্যাসাল নেই।',
    descriptionEn: 'Genuine IDM 1-PC lifetime activation key. Direct verification with official software download. Instant high-speed downloader.',
    pricePerUnit: 450,
    minQuantity: 1,
    maxQuantity: 5,
    featured: true,
    deliveryTimeBn: '১৫ মিনিট - ১ ঘণ্টা',
    deliveryTimeEn: '15 Mins - 1 Hour',
    inputTypeLabelBn: 'ডেলিভারি ইমেইল / হোয়াটসঅ্যাপ',
    inputTypeLabelEn: 'Delivery Email / WhatsApp No',
    inputTypePlaceholderBn: 'যেমন: delivery@gmail.com',
    inputTypePlaceholderEn: 'e.g., delivery@gmail.com'
  },

  // Category 3: Game Top-Up & Gift Cards
  {
    id: 'srv-topup-ff115',
    categoryId: 'cat-topup',
    nameBn: 'Free Fire 115 Diamonds Direct UID Top-Up',
    nameEn: 'Free Fire 115 Diamonds Direct UID Top-Up',
    descriptionBn: 'ইনস্ট্যান্ট ফ্রি ফায়ার ডায়মন্ড প্লেয়ার ইউআইডি টপ-আপ। পাসওয়ার্ডের কোনো প্রয়োজন নেই, সঠিক প্লেয়ার আইডি কোডটি সাবমিট করুন।',
    descriptionEn: 'Superfast Free Fire Direct in-game diamond top-up. No account credentials required, just input your Player UID.',
    pricePerUnit: 82,
    minQuantity: 1,
    maxQuantity: 100,
    featured: true,
    deliveryTimeBn: '৫-১৫ মিনিট',
    deliveryTimeEn: '5-15 Mins',
    inputTypeLabelBn: 'ফ্রি ফায়ার Player UID (গেম আইডি)',
    inputTypeLabelEn: 'Free Fire Player UID (Game ID Code)',
    inputTypePlaceholderBn: 'যেমন: 289417845',
    inputTypePlaceholderEn: 'e.g., 289417845'
  },
  {
    id: 'srv-topup-pubg60',
    categoryId: 'cat-topup',
    nameBn: 'PUBG Mobile 60 UC Redeem Code (Instant Delivery)',
    nameEn: 'PUBG Mobile 60 UC Redeem Code (Instant Delivery)',
    descriptionBn: 'পাবজি মোবাইল ৬০ ইউসি রিডিম কোড (Razer Gold API বা Midasbuy)। কোডটি মাইডাসবাই ওয়েবসাইটে বসিয়ে ভেরিফাই করতে পারবেন।',
    descriptionEn: 'PUBG Mobile 60 Unknown Cash (UC) official activation card pin code. Redeemable on midasbuy portal.',
    pricePerUnit: 95,
    minQuantity: 1,
    maxQuantity: 50,
    featured: false,
    deliveryTimeBn: 'ইনস্ট্যান্ট (১-১০ মিনিট)',
    deliveryTimeEn: 'Instant (1-10 Mins)',
    inputTypeLabelBn: 'ডেলিভারি ইমেইল / হোয়াটসঅ্যাপ',
    inputTypeLabelEn: 'Delivery Email or WhatsApp',
    inputTypePlaceholderBn: 'যেমন: pubg_purchaser@gmail.com',
    inputTypePlaceholderEn: 'e.g., pubg_purchaser@gmail.com'
  },

  // Category 4: Web Themes & plugins
  {
    id: 'srv-asset-elementor',
    categoryId: 'cat-templates',
    nameBn: 'Elementor Pro Premium Activation (1 Domain - 1 Year license)',
    nameEn: 'Elementor Pro Premium Activation (1 Domain - 1 Year license)',
    descriptionBn: 'আমরা আপনার ডোমেইনে অফিশিয়াল জেনুইন কি দিয়ে এলিমেন্টর প্রো প্লাগইনটি কাস্টম অ্যাক্টিভ করে দেবো। সব অফিশিয়াল টেমপ্লেট লাইব্রেরি আনলক হবে।',
    descriptionEn: 'Genuine Elementor Pro system activation on your single domain. Full cloud templates kit section access active. Setup done by admin token.',
    pricePerUnit: 190,
    minQuantity: 1,
    maxQuantity: 10,
    featured: true,
    deliveryTimeBn: '১-৪ ঘণ্টা',
    deliveryTimeEn: '1-4 Hours',
    inputTypeLabelBn: 'ওয়ার্ডপ্রেস সাইট লিংক ও সাময়িক অ্যাডমিন লগইন তথ্য',
    inputTypeLabelEn: 'WordPress Domain URL & Temporary Admin Details',
    inputTypePlaceholderBn: 'যেমন: https://website.com (User: admin / Pass: xxxx)',
    inputTypePlaceholderEn: 'e.g., https://website.com (User: admin / Pass: xxxx)'
  },

  // Category 5: Social Boosting (SMM)
  {
    id: 'srv-smm-fbfollow',
    categoryId: 'cat-smm',
    nameBn: 'ফেসবুক পেইজ ফলোয়ার + লাইক (স্থায়ী / ১০০% নন-ড্রপ)',
    nameEn: 'Facebook Page Followers + Likes (Non-Drop VIP & Stable)',
    descriptionBn: 'বাস্তব বাংলাদেশি ইউজার প্রোফাইল, যা স্থায়ী থাকবে এবং পেইজের রিচ বাড়াতে সাহায্য করবে। প্রতি ১০০০ ফলোয়ার মাত্র ১২০ টাকা।',
    descriptionEn: 'High-quality organic looking profiles from Bangladesh network. Lifetime refill guarantee. Price is BDT 120 per 1000 followers.',
    pricePerUnit: 0.12, // 120 BDT per 1000
    minQuantity: 1000,
    maxQuantity: 50000,
    featured: true,
    deliveryTimeBn: '১২-২৪ ঘণ্টা',
    deliveryTimeEn: '12-24 Hours',
    inputTypeLabelBn: 'ফেসবুক পেইজ লিংক',
    inputTypeLabelEn: 'Facebook Page URL',
    inputTypePlaceholderBn: 'https://www.facebook.com/yourpage',
    inputTypePlaceholderEn: 'https://www.facebook.com/yourpage'
  },
  {
    id: 'srv-smm-ytsub',
    categoryId: 'cat-smm',
    nameBn: 'ইউটিউব অর্গানিক সাবস্ক্রাইবার্স (১০০% নন-ড্রপ / মনিটাইজেশন বুস্টার)',
    nameEn: 'YouTube Organic Subscribers (High-Retention / Refill Warranty)',
    descriptionBn: 'গুগল অ্যালগরিদম সুরক্ষিত, যা আপনার চ্যানেলের মনিটাইজেশন পেতে সরাসরি সাহায্য করবে। প্রতি ১০০০ সাবস্ক্রাইবার মাত্র ৯৫০ টাকা।',
    descriptionEn: 'Stable and high watch-time user profiles. Google API compliant with lifetime refill security. Price is BDT 950 per 1000 Subscribers.',
    pricePerUnit: 0.95, // 950 BDT per 1000
    minQuantity: 500,
    maxQuantity: 10000,
    featured: false,
    deliveryTimeBn: '৩-৭ দিন',
    deliveryTimeEn: '3-7 Days',
    inputTypeLabelBn: 'ইউটিউব চ্যানেল লিংক',
    inputTypeLabelEn: 'YouTube Channel Link',
    inputTypePlaceholderBn: 'https://www.youtube.com/@channelname',
    inputTypePlaceholderEn: 'https://www.youtube.com/@channelname'
  }
];

export const defaultBlogs: Blog[] = [
  {
    id: 'blog-1',
    titleBn: '২০২৬ সালে উইন্ডোজ ১১ জেনুইন রিটেইল কি কেন ব্যবহার করবেন এবং অ্যাক্টিভেশন টিপস',
    titleEn: 'Why You Should Use Genuine Windows 11 Retail License Keys in 2026',
    contentBn: 'ক্র্যাক সফটওয়্যার বা পাইরেটেড ওএস ব্যবহারের মাধ্যমে আপনার মূল্যবান ডেক্সটপ সিকিউরিটি হ্যাক হতে পারে। জেনুইন রিটেইল লাইসেন্স কি ব্যবহারের ফলে আপনি পাচ্ছেন লাইফটাইম অফিশিয়াল আপডেট, ম্যালওয়্যার প্রোটেকশন এবং উইন্ডোজ সিকিউরিটি সাপোর্ট। কিভাবে কয়েক সেকেন্ডে ডিজিটাল কি দিয়ে আপনার উইন্ডোজ মেম্বারশিপ অ্যাক্টিভ করবেন তা এখানে বিস্তারিত আলোচনা করা হয়েছে।',
    contentEn: 'Cracking or using pirated operating systems exposes your computer endpoints to serious security vulnerabilities. Legitimate OEM and Retail keys allow you to sync official Windows updates of Microsoft and secure Defender protocols safely. This guide outlines how easily you can apply our genuine activation codes.',
    categoryBn: 'লাইসেন্স গাইড',
    categoryEn: 'License Guides',
    imageUrl: 'https://images.unsplash.com/photo-1624561172888-ac93c696e10c?auto=format&fit=crop&q=80&w=600',
    createdAt: '2026-05-18T10:00:00Z',
    views: 1421
  },
  {
    id: 'blog-2',
    titleBn: 'কিভাবে আপনার ব্যক্তিগত স্পটিফাই ও নেটফ্লিক্স সাবস্ক্রিপশন সচল রাখবেন?',
    titleEn: 'How to Keep Spotify Premium and Netflix Accounts Running Smoothly',
    contentBn: 'প্রিমিয়াম ওটিটি বা সাবস্ক্রিপশন ব্যবহার করতে অনেকে বিভিন্ন ধরনের সমস্যায় পড়েন, যেমন প্রোফাইল পিন লক পরিবর্তন বা ফ্যামিলি ইনভাইট লিংক অ্যাক্সেস নিয়ে। ডিজিটাল গ্যালারি থেকে কেনা যেকোনো সাবস্ক্রিপশনের সিকিউর পিন এবং ফ্যামিলি মেম্বারশিপ কানেক্ট করার সম্পূর্ণ সিকিউরিটি প্রোটোকল গাইড আমাদের এই বিশেষ টিউটোরিয়াল থেকে জেনে নিন।',
    contentEn: 'Managing share codes and premium private PIN locks for streaming profiles might occasionally seem tricky. This comprehensive tutorial provides a step-by-step guideline on properly accepting family plan invites and optimizing UHD playback streams.',
    categoryBn: 'সাবস্ক্রিপশন টিপস',
    categoryEn: 'Subscription Tips',
    imageUrl: 'https://images.unsplash.com/photo-1574375927938-d5a98e8edd86?auto=format&fit=crop&q=80&w=600',
    createdAt: '2026-05-20T12:00:00Z',
    views: 890
  }
];

export const defaultCoupons: Coupon[] = [
  {
    id: 'cp-first',
    code: 'BOOST50',
    discountPercent: 10, // 10%
    minOrderAmount: 200, // Min order BDT 200
    expiryDate: '2026-12-31',
    active: true
  },
  {
    id: 'cp-mega',
    code: 'BANGLA20',
    discountPercent: 20, // 20%
    minOrderAmount: 500,
    expiryDate: '2026-12-31',
    active: true
  }
];

export const defaultAppSettings: AppSettings = {
  siteNameBn: 'ডিজিটাল গ্যালারি',
  siteNameEn: 'Digital Gallery',
  announcementBn: 'ধামাকা অফার! প্রথম অর্ডারে "BOOST50" কুপন ব্যবহার করে পেয়ে যান ১০% ইনস্ট্যান্ট ফ্ল্যাট ডিসকাউন্ট! বিকাশ ও নগদে লেনদেন সফলভাবে সচল রয়েছে।',
  announcementEn: 'Promo alert! Use coupon "BOOST50" to get 10% flat discount on your initial purchase. Secure bKash & Nagad active.',
  contactEmail: 'digitalgallery7.24@gmail.com',
  contactPhone: '+880 1712 345678',
  contactAddressBn: 'মিরপুর ১০, ঢাকা, বাংলাদেশ',
  contactAddressEn: 'Mirpur 10, Dhaka, Bangladesh',
  facebookUrl: 'https://facebook.com/digitalgallery',
  telegramUrl: 'https://t.me/digitalgallery_bd',
  youtubeUrl: 'https://youtube.com/digitalgallery',
  whatsappNumber: '+8801712345678',
  promoBanner: {
    titleBn: 'রেফার করে আজীবনের জন্য আয় করুন!',
    titleEn: 'Refer Friends & Earn Lifetime Residual Income!',
    subtitleBn: 'আপনার এফিলিয়েট লিংক দিয়ে নতুন গ্রাহক নিবন্ধন করালে তাদের প্রতি রিচার্জে ৫% সরাসরি ওয়ালেট ব্যালেন্স ক্যাশব্যাক!',
    subtitleEn: 'Share your affiliate link and earn real withdrawal balance representing 5% on friends recharge transactions.',
    ctaTextBn: 'রেফারাল ড্যাশবোর্ড',
    ctaTextEn: 'Join Affiliate Program',
    active: true,
    link: 'affiliate'
  },
  currencySymbol: '৳',
  referrerCommissionPercent: 5
};

export const defaultUsers: UserProfile[] = [
  {
    id: 'user-admin',
    name: 'Digital Gallery Admin',
    email: 'digitalgallery7.24@gmail.com',
    role: 'admin',
    walletBalance: 25000,
    referralCode: 'ADMIN777',
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'user-regular',
    name: 'Bayzid Hasan',
    email: 'bayzid6484@gmail.com', // Match the user in the metadata
    role: 'user',
    walletBalance: 650,
    referralCode: 'BAYZID99',
    referredBy: 'ADMIN777',
    createdAt: '2026-05-15T09:39:00Z'
  }
];

export const defaultOrders: Order[] = [
  {
    id: 'ORD-98421',
    userId: 'user-regular',
    serviceId: 'srv-subs-netflix',
    categoryId: 'cat-subs',
    targetLink: 'bayzid6484@gmail.com / (Shared Slot 1)',
    quantity: 1,
    totalPrice: 150,
    orderNote: 'Please process urgently, need access profile',
    status: 'processing',
    createdAt: '2026-05-21T18:30:00Z'
  },
  {
    id: 'ORD-76239',
    userId: 'user-regular',
    serviceId: 'srv-keys-win11',
    categoryId: 'cat-keys',
    targetLink: 'bayzid6484@gmail.com',
    quantity: 1,
    totalPrice: 290,
    status: 'completed',
    createdAt: '2026-05-20T10:15:00Z'
  }
];

export const defaultTransactions: PaymentTransaction[] = [
  {
    id: 'TXN-001',
    userId: 'user-regular',
    amount: 500,
    method: 'bKash',
    senderNumber: '01711122233',
    transactionId: 'TRXFB897123',
    status: 'approved',
    type: 'deposit',
    createdAt: '2026-05-20T10:00:00Z',
    note: 'Approved automatic system recharge'
  },
  {
    id: 'TXN-002',
    userId: 'user-regular',
    amount: 290,
    method: 'Wallet Balance',
    status: 'approved',
    type: 'checkout',
    createdAt: '2026-05-20T10:15:00Z',
    note: 'Deducted for Windows 11 Pro Retail Key Order ORD-76239'
  }
];

export const defaultTickets: SupportTicket[] = [
  {
    id: 'TCK-8821',
    userId: 'user-regular',
    userName: 'Bayzid Hasan',
    subject: 'Windows 11 Pro Key activation query',
    priority: 'medium',
    status: 'answered',
    createdAt: '2026-05-21T12:00:00Z',
    updatedAt: '2026-05-21T14:30:00Z',
    messages: [
      {
        senderId: 'user-regular',
        senderName: 'Bayzid Hasan',
        role: 'user',
        message: 'My Windows 11 Retail Key ORD-76239 activated successfully! Just wanted to double check if it binds to my MS Outlook account as well?',
        createdAt: '2026-05-21T12:00:00Z'
      },
      {
        senderId: 'user-admin',
        senderName: 'Admin (Babu)',
        role: 'admin',
        message: 'Hello Bayzid! Yes indeed, this genuine Retail license binds directly to your personal Microsoft account and your motherboard. It will reactivate automatically if you reinstall Windows. Thank you for choosing Digital Gallery!',
        createdAt: '2026-05-21T14:30:00Z'
      }
    ]
  }
];
