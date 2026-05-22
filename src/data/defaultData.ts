import { Category, Service, Blog, AppSettings, Coupon, SupportTicket, UserProfile, Order, PaymentTransaction } from '../types';

export const defaultCategories: Category[] = [
  {
    id: 'cat-fb',
    nameBn: 'ফেসবুক সার্ভিসেস',
    nameEn: 'Facebook Services',
    slug: 'facebook',
    iconName: 'Facebook',
    descriptionBn: 'পেইজ ফলোয়ার, লাইক, গ্রুপ মেম্বার এবং ভিডিওর ভিউ বাড়ান',
    descriptionEn: 'Boost page followers, post likes, group members, and video views'
  },
  {
    id: 'cat-yt',
    nameBn: 'ইউটিউব সার্ভিসেস',
    nameEn: 'YouTube Services',
    slug: 'youtube',
    iconName: 'Youtube',
    descriptionBn: 'ইউটিউব অর্গানিক সাবস্ক্রাইবার, ওয়াচটাইম এবং ভিডিও লাইক সার্ভিস',
    descriptionEn: 'YouTube organic subscribers, watchtime hours, and video likes'
  },
  {
    id: 'cat-tt',
    nameBn: 'টিকটক সার্ভিসেস',
    nameEn: 'TikTok Services',
    slug: 'tiktok',
    iconName: 'Video',
    descriptionBn: 'টিকটক ফলোয়ার, রিয়েল ভিডিও ভিউ এবং শেয়ার সার্ভিস',
    descriptionEn: 'TikTok followers, active video views, likes, and shares'
  },
  {
    id: 'cat-ig',
    nameBn: 'ইনস্টাগ্রাম প্যাক',
    nameEn: 'Instagram Packages',
    slug: 'instagram',
    iconName: 'Instagram',
    descriptionBn: 'ইনস্টাগ্রাম এক্টিভ ফলোয়ার, রিয়েল লাইক এবং রিলে ভিডিও ভিউ',
    descriptionEn: 'Instagram active followers, genuine likes, and reels views'
  },
  {
    id: 'cat-links',
    nameBn: 'লিংক এবং ট্রাফিক সার্ভিস',
    nameEn: 'Follow-Link & Traffic',
    slug: 'links-traffic',
    iconName: 'Link',
    descriptionBn: 'ওয়েবসাইট রিয়েল ভিজিটর, রেফারে্ল লিংক ক্লিক এবং শর্টলিংক বাইপাস ট্রাফিক',
    descriptionEn: 'Website real traffic, referral links booster, and link bypass hits'
  }
];

export const defaultServices: Service[] = [
  {
    id: 'srv-fb-1',
    categoryId: 'cat-fb',
    nameBn: 'ফেসবুক পেইজ ফলোয়ার + লাইক (স্থায়ী / ১০০% নন-ড্রপ)',
    nameEn: 'Facebook Page Followers + Likes (Non-Drop & Instant)',
    descriptionBn: 'বাস্তব বাংলাদেশি ইউজার প্রোফাইল, যা স্থায়ী থাকবে এবং পেইজের রিচ বাড়াতে সাহায্য করবে। পাসওয়ার্ডের প্রয়োজন নেই।',
    descriptionEn: 'Real profile accounts from Bangladesh. 100% stable, zero drops. No login or password required.',
    pricePerUnit: 0.12, // 120 BDT per 1000
    minQuantity: 500,
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
    id: 'srv-fb-2',
    categoryId: 'cat-fb',
    nameBn: 'ফেসবুক ওল্ড প্রোফাইল ফলোয়ার্স (ইনস্ট্যান্ট স্টার্ট)',
    nameEn: 'Facebook Active Profile Followers (Instant Dispatch)',
    descriptionBn: 'প্রোফাইলে ইনস্ট্যান্ট রিয়েল ফলোয়ার বাড়ান। অটোমেটিক সার্ভার ডেসপ্যাচ।',
    descriptionEn: 'Increase followers on your personal profile instantly. Automated speed.',
    pricePerUnit: 0.09, // 90 BDT per 1000
    minQuantity: 1000,
    maxQuantity: 100000,
    featured: false,
    deliveryTimeBn: '১-৬ ঘণ্টা',
    deliveryTimeEn: '1-6 Hours',
    inputTypeLabelBn: 'ফেসবুক প্রোফাইল লিংক',
    inputTypeLabelEn: 'Facebook Profile URL',
    inputTypePlaceholderBn: 'https://www.facebook.com/username',
    inputTypePlaceholderEn: 'https://www.facebook.com/username'
  },
  {
    id: 'srv-fb-3',
    categoryId: 'cat-fb',
    nameBn: 'ভিডিও ৩ সেকেন্ড থ্রু-প্লে ভিউজ (মনিটাইজেশন বুস্টার)',
    nameEn: 'Video Watch Views (Monetization Booster Pack)',
    descriptionBn: 'ফেসবুক ভিডিও মনিটাইজেশন ৩ সেকেন্ড এবং ১ মিনিট ভিউ সম্পন্ন করার বিশ্বস্ত প্যাক।',
    descriptionEn: 'Maximize facebook video thrupts. Ideal for monetization watch-time parameters.',
    pricePerUnit: 0.04, // 40 BDT per 1000
    minQuantity: 1000,
    maxQuantity: 500000,
    featured: false,
    deliveryTimeBn: '২৪-৪৮ ঘণ্টা',
    deliveryTimeEn: '24-48 Hours',
    inputTypeLabelBn: 'ফেসবুক ভিডিও ইউআরএল (Video URL)',
    inputTypeLabelEn: 'Facebook Video URL',
    inputTypePlaceholderBn: 'https://www.facebook.com/video-url...',
    inputTypePlaceholderEn: 'https://www.facebook.com/video-url...'
  },
  {
    id: 'srv-yt-1',
    categoryId: 'cat-yt',
    nameBn: 'ইউটিউব হাই-রিটেনশন অর্গানিক সাবস্ক্রাইবার্স (লাইফটাইম গ্যারান্টি)',
    nameEn: 'YouTube Premium High-Retention Subscribers (Lifetime Warranty)',
    descriptionBn: '৩ বছর রিফিল ওয়্যারেন্টি সহ রিয়েল অ্যাক্টিভ সাবস্ক্রাইবার্স। গুগল ফিল্টার সেফ।',
    descriptionEn: 'Organic accounts with dynamic click sessions. Google API safe with full refill warranty.',
    pricePerUnit: 0.95, // 950 BDT per 1000
    minQuantity: 100,
    maxQuantity: 10000,
    featured: true,
    deliveryTimeBn: '৩-৭ দিন',
    deliveryTimeEn: '3-7 Days',
    inputTypeLabelBn: 'ইউটিউব চ্যানেল লিংক',
    inputTypeLabelEn: 'YouTube Channel Link',
    inputTypePlaceholderBn: 'https://www.youtube.com/@channelname',
    inputTypePlaceholderEn: 'https://www.youtube.com/@channelname'
  },
  {
    id: 'srv-yt-2',
    categoryId: 'cat-yt',
    nameBn: 'ইউটিউব ভিডিও ওয়াচটাইম ঘন্টা (১০০% রনিড্রপ মনিটাইজেশন স্পেশাল)',
    nameEn: 'YouTube Video Watchtime Hours (Monetization Special)',
    descriptionBn: 'ভিডিও অবশ্যই ১৫+ বা ৩০+ মিনিটের হতে হবে। আপনার চ্যানেলের ৪০০০ ঘন্টা ওয়াচ টাইম সম্পন্ন করতে সাহায্য করবে।',
    descriptionEn: 'Requires video of length 15 mins or above. Safe and fast update in YouTube Studio dashboard.',
    pricePerUnit: 0.45, // 450 BDT per 1000 hours
    minQuantity: 500,
    maxQuantity: 4000,
    featured: true,
    deliveryTimeBn: '৪-৯ দিন',
    deliveryTimeEn: '4-9 Days',
    inputTypeLabelBn: 'ভিডিও লিংক (অবশ্যই ১৫মিনিট+ দীর্ঘ হতে হবে)',
    inputTypeLabelEn: 'Video Link (Must be 15 mins+ long)',
    inputTypePlaceholderBn: 'https://www.youtube.com/watch?v=...',
    inputTypePlaceholderEn: 'https://www.youtube.com/watch?v=...'
  },
  {
    id: 'srv-tt-1',
    categoryId: 'cat-tt',
    nameBn: 'টিকটক রিয়েল ফলোয়ার্স (ইনস্ট্যান্ট এবং নন-ড্রপ)',
    nameEn: 'TikTok Real Followers (Instant Non-Drop)',
    descriptionBn: 'টিকটক অ্যাকাউন্টের ফলোয়ার্স এবং লাইভ স্ট্রিম আনলকার প্যাক। অত্যন্ত দ্রুত ডেলিভারি হয়।',
    descriptionEn: 'Boost TikTok followers to unlock live streaming features. Lightning fast delivery setup.',
    pricePerUnit: 0.08, // 80 BDT per 1000
    minQuantity: 500,
    maxQuantity: 100000,
    featured: true,
    deliveryTimeBn: '৩০ মিনিট - ৪ ঘণ্টা',
    deliveryTimeEn: '30 Min - 4 Hours',
    inputTypeLabelBn: 'টিকটক ইউজারনেম / প্রোফাইল লিংক',
    inputTypeLabelEn: 'TikTok Username or Profile URL',
    inputTypePlaceholderBn: 'https://www.tiktok.com/@profile_name',
    inputTypePlaceholderEn: 'https://www.tiktok.com/@profile_name'
  },
  {
    id: 'srv-tt-2',
    categoryId: 'cat-tt',
    nameBn: 'টিকটক ভিডিও ভিউস ও হার্ট লাইকস (সুপার ফার্স্ট)',
    nameEn: 'TikTok Fast Video Views & Hearts (Turbo Engine)',
    descriptionBn: 'টিকটক ভিডিওর ভিউ একদম ইনস্ট্যান্ট বৃদ্ধি করুন। ট্রেন্ডিং এলগোরিদম বুস্টার।',
    descriptionEn: 'Provides lightning-fast views to get your video recommended by TikTok algorithms.',
    pricePerUnit: 0.02, // 20 BDT per 1000
    minQuantity: 1000,
    maxQuantity: 1000000,
    featured: false,
    deliveryTimeBn: 'ইনস্ট্যান্ট (১-৫ মিনিট)',
    deliveryTimeEn: 'Instant (1-5 Mins)',
    inputTypeLabelBn: 'টিকটক ভিডিও লিংক',
    inputTypeLabelEn: 'TikTok Video URL',
    inputTypePlaceholderBn: 'https://www.tiktok.com/@username/video/...',
    inputTypePlaceholderEn: 'https://www.tiktok.com/@username/video/...'
  },
  {
    id: 'srv-ig-1',
    categoryId: 'cat-ig',
    nameBn: 'ইনস্টাগ্রাম প্রিমিয়াম রিয়েল ফলোয়ার্স',
    nameEn: 'Instagram Premium Real Followers',
    descriptionBn: 'হাই-কোয়ালিটি ইনস্টাগ্রাম ফলোয়ার যা রিয়েল ইউজারদের মত দেখায় এবং দীর্ঘস্থায়ী হয়।',
    descriptionEn: 'High density instagram followers that look organic, stable with bio pictures.',
    pricePerUnit: 0.15, // 150 BDT per 1000
    minQuantity: 200,
    maxQuantity: 50000,
    featured: true,
    deliveryTimeBn: '১-১২ ঘণ্টা',
    deliveryTimeEn: '1-12 Hours',
    inputTypeLabelBn: 'ইনস্টাগ্রাম প্রোফাইল লিংক / ইউজারনেম',
    inputTypeLabelEn: 'Instagram Profile URL or Username',
    inputTypePlaceholderBn: 'https://www.instagram.com/your_username',
    inputTypePlaceholderEn: 'https://www.instagram.com/your_username'
  },
  {
    id: 'srv-links-1',
    categoryId: 'cat-links',
    nameBn: 'ফলো-লিংক এবং শর্টলিংক ইউনিক ক্লিক ভিউয়ার প্যাক',
    nameEn: 'Bypass Follow-link / Custom Redirect Hits Booster',
    descriptionBn: 'যেকোনো ডিজিটাল শর্টনার লিংক অথবা কাস্টম ফলো লিংকের রিয়েল ক্লিক বাড়ান। রেফারেল টার্গেট পূর্ণ করতে উপযোগী।',
    descriptionEn: 'Boost successful bypass clicks on link shorteners or referral redirect nodes. Ideal for bounty/referral systems.',
    pricePerUnit: 0.05, // 50 BDT per 1000 clicks
    minQuantity: 1000,
    maxQuantity: 25000,
    featured: true,
    deliveryTimeBn: '২-৬ ঘণ্টা',
    deliveryTimeEn: '2-6 Hours',
    inputTypeLabelBn: 'শর্টলিংক / গন্তব্য রিডিরেক্ট লিংক',
    inputTypeLabelEn: 'Follow-Link / Shortener Redirect URL',
    inputTypePlaceholderBn: 'https://link-short.com/... or Referral URL',
    inputTypePlaceholderEn: 'https://link-short.com/... or Referral URL'
  },
  {
    id: 'srv-links-2',
    categoryId: 'cat-links',
    nameBn: 'ওয়েব ট্রাফিক - গ্লোবাল হাই রিটেনশন (এসইও সেফ)',
    nameEn: 'Website Traffic - Direct Global Hits (SEO & AdSense Safe)',
    descriptionBn: 'আপনার ব্লগের রিচ ও রাংকিং বাড়াতে সরাসরি অর্গানিক ট্রাফিক পাঠান। গুগল এডসেন্স এর জন্য সুরক্ষিত।',
    descriptionEn: 'High quality web traffic. Boost your Alexa/Ahrefs rankings. Fully Adsense and SEO compliance.',
    pricePerUnit: 0.03, // 30 BDT per 1000 hits
    minQuantity: 5000,
    maxQuantity: 500000,
    featured: false,
    deliveryTimeBn: '২৪ ঘণ্টা',
    deliveryTimeEn: '24 Hours',
    inputTypeLabelBn: 'ওয়েবসাইট লিংক / ব্লগ লিংক',
    inputTypeLabelEn: 'Website or Blog URL',
    inputTypePlaceholderBn: 'https://www.mywebsite.com',
    inputTypePlaceholderEn: 'https://www.mywebsite.com'
  }
];

export const defaultBlogs: Blog[] = [
  {
    id: 'blog-1',
    titleBn: '২০২৬ সালে ফেসবুক পেইজে অর্গানিক ফলোয়ার বাড়ানোর সেরা ৫টি কৌশল',
    titleEn: '5 Proven Methods to Grow Organic Facebook Page Followers in 2026',
    contentBn: 'ফেসবুক অ্যালগরিদম প্রতিনিয়ত পরিবর্তিত হচ্ছে। পেইজের রিচ বাড়াতে হলে আপনাকে এখন রিয়েল কনটেন্টের দিকে মনোযোগী হতে হবে। ফেইসবুক রিলস ভিডিওর মাধ্যমে গ্রাহকদের যুক্ত করা এবং প্রিমিয়াম বুস্টিং ও ফলো-লিংক সার্ভিস ব্যবহার করে পেইজের প্রাতিষ্ঠানিক ফুর্ততা লাভ করার চমৎকার মেথডগুলো এই ব্লগে আলোচনা করা হয়েছে।',
    contentEn: 'The Facebook algorithm is continuously shifting dashboard layouts. In 2026, dynamic short-form video content combined with safe micro-targeted campaigns represents the quickest path to gain real page visibility and validation.',
    categoryBn: 'সোশ্যাল টিপস',
    categoryEn: 'Social Growth Tips',
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600',
    createdAt: '2026-05-18T10:00:00Z',
    views: 1421
  },
  {
    id: 'blog-2',
    titleBn: 'অ্যাফিলিয়েট এবং শর্টলিংক নেটওয়ার্ক থেকে কীভাবে বেশি আয় করবেন?',
    titleEn: 'How to Maximize Earnings from Affiliate and URL Shortener Networks',
    contentBn: 'অনেক তরুণেরাই শর্টলিংক বা কন্টেন্ট লকার ব্যবহার করে অনলাইন থেকে আয় করে থাকেন। কিন্তু ভিজিটর বা ক্লিক কম থাকার কারণে আয় আশানুরূপ হয় না। আমাদের ফলো-লিংক ক্লিক সার্ভিস ব্যবহারের মাধ্যমে কীভাবে নিরাপদ ট্রাফিক জেনারেট করে নিজের আয় দিগুণ করবেন তার একটি সম্পূর্ণ গাইডলাইন এটি।',
    contentEn: 'Earning through affiliate marketing is a reliable way to make smart passive income. However, low click rates often limit success. Discover how safe targeted traffic nodes can boost link bypass counts without breaching terms of service.',
    categoryBn: 'অনলাইন আর্নিং',
    categoryEn: 'Affiliate Marketing',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600',
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
  siteNameBn: 'সেবা বুস্ট বিডি',
  siteNameEn: 'Seba Boost BD',
  announcementBn: 'ধামাকা অফার! প্রথম অর্ডারে "BOOST50" কুপন ব্যবহার করে পেয়ে যান ১০% ইনস্ট্যান্ট ফ্ল্যাট ডিসকাউন্ট! বিকাশ ও নগদে লেনদেন সফলভাবে সচল রয়েছে।',
  announcementEn: 'Promo alert! Use coupon "BOOST50" to get 10% flat discount on your initial purchase. Secure bKash & Nagad active.',
  contactEmail: 'support@sebaboostbd.com',
  contactPhone: '+880 1712 345678',
  contactAddressBn: 'মিরপুর ১০, ঢাকা, বাংলাদেশ',
  contactAddressEn: 'Mirpur 10, Dhaka, Bangladesh',
  facebookUrl: 'https://facebook.com/sebaboostbd',
  telegramUrl: 'https://t.me/sebaboostbd',
  youtubeUrl: 'https://youtube.com/sebaboostbd',
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
    name: 'Babu Chowdhury (Admin)',
    email: 'admin@test.com',
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
    serviceId: 'srv-fb-1',
    categoryId: 'cat-fb',
    targetLink: 'https://www.facebook.com/bayzidofficialpage',
    quantity: 1000,
    totalPrice: 120,
    orderNote: 'Please process urgently',
    status: 'processing',
    createdAt: '2026-05-21T18:30:00Z'
  },
  {
    id: 'ORD-76239',
    userId: 'user-regular',
    serviceId: 'srv-tt-1',
    categoryId: 'cat-tt',
    targetLink: 'https://www.tiktok.com/@bayzid_trends',
    quantity: 2000,
    totalPrice: 160,
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
    amount: 160,
    method: 'Wallet Balance',
    status: 'approved',
    type: 'checkout',
    createdAt: '2026-05-20T10:15:00Z',
    note: 'Deducted for TikTok Followers Order ORD-76239'
  }
];

export const defaultTickets: SupportTicket[] = [
  {
    id: 'TCK-8821',
    userId: 'user-regular',
    userName: 'Bayzid Hasan',
    subject: 'Facebook followers service update delay',
    priority: 'medium',
    status: 'answered',
    createdAt: '2026-05-21T12:00:00Z',
    updatedAt: '2026-05-21T14:30:00Z',
    messages: [
      {
        senderId: 'user-regular',
        senderName: 'Bayzid Hasan',
        role: 'user',
        message: 'My order ORD-98421 is still processing. Usually it starts in 1 hour. Can you check?',
        createdAt: '2026-05-21T12:00:00Z'
      },
      {
        senderId: 'user-admin',
        senderName: 'Admin (Babu)',
        role: 'admin',
        message: 'Hello Bayzid! Our FB server is undergoing a brief API update cycle. It will resume in a few minutes, do not worry, your followers are 100% stable.',
        createdAt: '2026-05-21T14:30:00Z'
      }
    ]
  }
];
