import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, Category, Service, Order, PaymentMethod, 
  PaymentTransaction, SupportTicket, Coupon, Blog, AppSettings 
} from '../types';
import { 
  defaultCategories, defaultServices, defaultBlogs, 
  defaultCoupons, defaultAppSettings, defaultUsers, 
  defaultOrders, defaultTransactions, defaultTickets 
} from '../data/defaultData';
import { Language, translations } from '../translations';

interface StateContextType {
  // Config & Translations
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof translations.bn;
  settings: AppSettings;
  updateSettings: (newSettings: AppSettings) => void;

  // Auth
  currentUser: UserProfile | null;
  setCurrentUser: (u: UserProfile | null) => void;
  loginUser: (email: string) => boolean;
  registerUser: (name: string, email: string, refCode?: string) => boolean;
  logoutUser: () => void;
  users: UserProfile[];
  updateUserBalance: (userId: string, amount: number) => void;

  // Core Lists
  categories: Category[];
  services: Service[];
  orders: Order[];
  transactions: PaymentTransaction[];
  tickets: SupportTicket[];
  coupons: Coupon[];
  blogs: Blog[];

  // App-wide Alerts / Notifications
  notifications: string[];
  addNotification: (msg: string) => void;
  clearNotifications: () => void;

  // Transactional Actions
  createOrder: (order: Omit<Order, 'id' | 'createdAt'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  submitPayment: (payment: Omit<PaymentTransaction, 'id' | 'createdAt' | 'status'>) => void;
  approvePayment: (txnId: string) => void;
  rejectPayment: (txnId: string) => void;
  applyCoupon: (code: string, amount: number) => { discount: number; error?: string };
  submitSupportTicket: (subject: string, priority: 'low' | 'medium' | 'high', firstMessage: string) => void;
  replyToTicket: (ticketId: string, message: string, isAdmin: boolean) => void;
  updateTicketStatus: (ticketId: string, status: SupportTicket['status']) => void;

  // Admin Actions (CRUD)
  addService: (s: Omit<Service, 'id'>) => void;
  editService: (id: string, s: Partial<Service>) => void;
  deleteService: (id: string) => void;
  addCategory: (c: Omit<Category, 'id' | 'slug'>) => void;
  editCategory: (id: string, c: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  addCoupon: (c: Coupon) => void;
  deleteCoupon: (id: string) => void;
  addBlog: (b: Omit<Blog, 'id' | 'views' | 'createdAt'>) => void;
  deleteBlog: (id: string) => void;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

export const StateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State initialization with localStorage fallback
  const [lang, setLangState] = useState<Language>('bn');
  const [settings, setSettings] = useState<AppSettings>(defaultAppSettings);
  const [currentUser, setCurrentUserState] = useState<UserProfile | null>(null);
  
  const [users, setUsersState] = useState<UserProfile[]>([]);
  const [categories, setCategoriesState] = useState<Category[]>([]);
  const [services, setServicesState] = useState<Service[]>([]);
  const [orders, setOrdersState] = useState<Order[]>([]);
  const [transactions, setTransactionsState] = useState<PaymentTransaction[]>([]);
  const [tickets, setTicketsState] = useState<SupportTicket[]>([]);
  const [coupons, setCouponsState] = useState<Coupon[]>([]);
  const [blogs, setBlogsState] = useState<Blog[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);

  // Selected language translations
  const t = translations[lang];

  // Load all states on startup
  useEffect(() => {
    const localLang = localStorage.getItem('seba_lang') as Language;
    if (localLang) setLangState(localLang);

    const loadData = <T,>(key: string, defaultVal: T): T => {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultVal;
    };

    setSettings(loadData('seba_settings', defaultAppSettings));
    setUsersState(loadData('seba_users', defaultUsers));
    setCategoriesState(loadData('seba_categories', defaultCategories));
    setServicesState(loadData('seba_services', defaultServices));
    setOrdersState(loadData('seba_orders', defaultOrders));
    setTransactionsState(loadData('seba_transactions', defaultTransactions));
    setTicketsState(loadData('seba_tickets', defaultTickets));
    setCouponsState(loadData('seba_coupons', defaultCoupons));
    setBlogsState(loadData('seba_blogs', defaultBlogs));
    setNotifications(loadData('seba_notifications', [
      "Welcome to our premium follow-link digital automation suite!",
      "ব্যবহার করুন প্রোমো কোড BOOST50 এবং বুঝে নিন ১০% ক্যাশব্যাক ডিসকাউন্ট।"
    ]));

    // Auto log-in Bayzid (the default user) to provide a premium instantly-accessible ready dashboard
    const savedUser = localStorage.getItem('seba_current_user');
    if (savedUser) {
      setCurrentUserState(JSON.parse(savedUser));
    } else {
      // By default, start with Bayzid logged in to make the applet feel rich immediately!
      const defaultUser = defaultUsers.find(u => u.email === 'bayzid6484@gmail.com') || defaultUsers[1];
      setCurrentUserState(defaultUser);
      localStorage.setItem('seba_current_user', JSON.stringify(defaultUser));
    }
  }, []);

  // Update helper functions that also write to localStorage
  const saveAndSet = <T,>(key: string, setter: React.Dispatch<React.SetStateAction<T>>, val: T | ((prev: T) => T)) => {
    setter((prev) => {
      const nextVal = typeof val === 'function' ? (val as Function)(prev) : val;
      localStorage.setItem(key, JSON.stringify(nextVal));
      return nextVal;
    });
  };

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('seba_lang', newLang);
  };

  const updateSettings = (newSettings: AppSettings) => {
    saveAndSet('seba_settings', setSettings, newSettings);
  };

  const setCurrentUser = (u: UserProfile | null) => {
    setCurrentUserState(u);
    if (u) {
      localStorage.setItem('seba_current_user', JSON.stringify(u));
    } else {
      localStorage.removeItem('seba_current_user');
    }
  };

  // Auth Operations
  const loginUser = (email: string): boolean => {
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setCurrentUser(existing);
      return true;
    }
    // Auto register as default user if email matches
    if (email.toLowerCase() === 'admin@test.com') {
      const adminAcc = users.find(u => u.role === 'admin') || defaultUsers[0];
      setCurrentUser(adminAcc);
      return true;
    }
    return false;
  };

  const registerUser = (name: string, email: string, refCode?: string): boolean => {
    const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) return false;

    // Check referrer code validation
    let referredBy: string | undefined;
    if (refCode) {
      const referrer = users.find(u => u.referralCode.toUpperCase() === refCode.toUpperCase());
      if (referrer) {
        referredBy = referrer.id;
      }
    }

    const newUser: UserProfile = {
      id: `usr-${Math.floor(100000 + Math.random() * 900000)}`,
      name,
      email,
      role: 'user',
      walletBalance: 0, // initially zero
      referralCode: name.toUpperCase().replace(/\s+/g, '').substring(0, 5) + Math.floor(Math.random() * 99),
      referredBy,
      createdAt: new Date().toISOString()
    };

    saveAndSet<UserProfile[]>('seba_users', setUsersState, (prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    return true;
  };

  const logoutUser = () => {
    setCurrentUser(null);
  };

  const updateUserBalance = (userId: string, amount: number) => {
    saveAndSet<UserProfile[]>('seba_users', setUsersState, (prev) => {
      const rawUsers = prev.map(u => u.id === userId ? { ...u, walletBalance: Number((u.walletBalance + amount).toFixed(2)) } : u);
      // Sync currentUser state if logged in
      if (currentUser && currentUser.id === userId) {
        const updated = rawUsers.find(u => u.id === userId);
        if (updated) {
          setCurrentUserState(updated);
          localStorage.setItem('seba_current_user', JSON.stringify(updated));
        }
      }
      return rawUsers;
    });
  };

  // Core transactional behaviors
  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt'>): Order => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString()
    };

    saveAndSet<Order[]>('seba_orders', setOrdersState, (prev) => [newOrder, ...prev]);

    // Handle payment reduction if order is paid from user wallet balance
    if (currentUser && orderData.userId === currentUser.id && currentUser.walletBalance >= orderData.totalPrice) {
      updateUserBalance(currentUser.id, -orderData.totalPrice);
      
      // Register checkout transaction
      const checkoutTx: PaymentTransaction = {
        id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        userId: currentUser.id,
        amount: orderData.totalPrice,
        method: 'Wallet Balance',
        status: 'approved',
        type: 'checkout',
        createdAt: new Date().toISOString(),
        note: `Payment for Order ${newOrder.id}`
      };
      saveAndSet<PaymentTransaction[]>('seba_transactions', setTransactionsState, (prev) => [checkoutTx, ...prev]);
    }

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    saveAndSet<Order[]>('seba_orders', setOrdersState, (prev) => {
      const order = prev.find(o => o.id === orderId);
      if (!order) return prev;

      // Handle custom refund parameters to wallet balance if cancelled / refunded
      if ((status === 'cancelled' || status === 'refunded') && (order.status !== 'cancelled' && order.status !== 'refunded')) {
        if (order.userId) {
          updateUserBalance(order.userId, order.totalPrice);
          const refundTx: PaymentTransaction = {
            id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
            userId: order.userId,
            amount: order.totalPrice,
            method: 'Wallet Refund',
            status: 'approved',
            type: 'deposit',
            createdAt: new Date().toISOString(),
            note: `Refund for Order ${orderId}`
          };
          saveAndSet<PaymentTransaction[]>('seba_transactions', setTransactionsState, (prevTx) => [refundTx, ...prevTx]);
        }
      }

      return prev.map(o => o.id === orderId ? { ...o, status } : o);
    });
  };

  const submitPayment = (paymentData: Omit<PaymentTransaction, 'id' | 'createdAt' | 'status'>) => {
    const newTx: PaymentTransaction = {
      ...paymentData,
      id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    saveAndSet<PaymentTransaction[]>('seba_transactions', setTransactionsState, (prev) => [newTx, ...prev]);
  };

  const approvePayment = (txnId: string) => {
    saveAndSet<PaymentTransaction[]>('seba_transactions', setTransactionsState, (prev) => {
      const transaction = prev.find(t => t.id === txnId);
      if (!transaction || transaction.status !== 'pending') return prev;

      // Add to user wallet balance
      updateUserBalance(transaction.userId, transaction.amount);

      // Check if this newly refilled user has a referrer, and credit them 5%
      const payingUser = users.find(u => u.id === transaction.userId);
      if (payingUser && payingUser.referredBy) {
        const commissionAmount = Number((transaction.amount * (settings.referrerCommissionPercent / 100)).toFixed(2));
        if (commissionAmount > 0) {
          updateUserBalance(payingUser.referredBy, commissionAmount);
          // Insert affiliate commission transaction
          const commissionTx: PaymentTransaction = {
            id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
            userId: payingUser.referredBy,
            amount: commissionAmount,
            method: 'Referral Bonus',
            status: 'approved',
            type: 'deposit',
            createdAt: new Date().toISOString(),
            note: `Commission from ${payingUser.name}'s wallet recharge of ${transaction.amount} BDT`
          };
          // Insert inside active transactions immediately
          setTimeout(() => {
            saveAndSet<PaymentTransaction[]>('seba_transactions', setTransactionsState, (prevTx) => [commissionTx, ...prevTx]);
          }, 100);
        }
      }

      return prev.map(t => t.id === txnId ? { ...t, status: 'approved' } : t);
    });
  };

  const rejectPayment = (txnId: string) => {
    saveAndSet<PaymentTransaction[]>('seba_transactions', setTransactionsState, (prev) => 
      prev.map(t => t.id === txnId ? { ...t, status: 'rejected' } : t)
    );
  };

  const applyCoupon = (code: string, amount: number): { discount: number; error?: string } => {
    const matched = coupons.find(c => c.code.toUpperCase() === code.toUpperCase() && c.active);
    if (!matched) {
      return { discount: 0, error: lang === 'bn' ? 'অকার্যকর বা মেয়াদোত্তীর্ণ কুপন কোড!' : 'Invalid or expired coupon code!' };
    }
    if (amount < matched.minOrderAmount) {
      return { 
        discount: 0, 
        error: lang === 'bn' 
          ? `এই কুপন ব্যবহারের জন্য সর্বনিম্ন অর্ডার মূল্য ${matched.minOrderAmount} টাকা হতে হবে।`
          : `Minimum order of ${matched.minOrderAmount} BDT is required for this coupon.`
      };
    }
    const discount = Number(((amount * matched.discountPercent) / 100).toFixed(2));
    const cappedDiscount = matched.maxDiscount ? Math.min(discount, matched.maxDiscount) : discount;
    return { discount: cappedDiscount };
  };

  const submitSupportTicket = (subject: string, priority: 'low' | 'medium' | 'high', firstMessage: string) => {
    if (!currentUser) return;
    const newTicket: SupportTicket = {
      id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: currentUser.id,
      userName: currentUser.name,
      subject,
      priority,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          senderId: currentUser.id,
          senderName: currentUser.name,
          role: 'user',
          message: firstMessage,
          createdAt: new Date().toISOString()
        }
      ]
    };
    saveAndSet<SupportTicket[]>('seba_tickets', setTicketsState, (prev) => [newTicket, ...prev]);
  };

  const replyToTicket = (ticketId: string, message: string, isAdmin: boolean) => {
    saveAndSet<SupportTicket[]>('seba_tickets', setTicketsState, (prev) => 
      prev.map(t => {
        if (t.id === ticketId) {
          const replies = [
            ...t.messages,
            {
              senderId: isAdmin ? 'admin' : (currentUser?.id || 'guest'),
              senderName: isAdmin ? 'Support Executive (Admin)' : (currentUser?.name || 'User'),
              role: (isAdmin ? 'admin' : 'user') as 'admin' | 'user',
              message,
              createdAt: new Date().toISOString()
            }
          ];
          return {
            ...t,
            status: isAdmin ? 'answered' : 'open',
            updatedAt: new Date().toISOString(),
            messages: replies
          };
        }
        return t;
      })
    );
  };

  const updateTicketStatus = (ticketId: string, status: SupportTicket['status']) => {
    saveAndSet<SupportTicket[]>('seba_tickets', setTicketsState, (prev) => 
      prev.map(t => t.id === ticketId ? { ...t, status } : t)
    );
  };

  // CRUD for Services (Admin Dashboard panel actions)
  const addService = (sData: Omit<Service, 'id'>) => {
    const newService: Service = {
      ...sData,
      id: `srv-${Math.floor(100000 + Math.random() * 900000)}`
    };
    saveAndSet<Service[]>('seba_services', setServicesState, (prev) => [...prev, newService]);
  };

  const editService = (id: string, sData: Partial<Service>) => {
    saveAndSet<Service[]>('seba_services', setServicesState, (prev) => 
      prev.map(s => s.id === id ? { ...s, ...sData } : s)
    );
  };

  const deleteService = (id: string) => {
    saveAndSet<Service[]>('seba_services', setServicesState, (prev) => prev.filter(s => s.id !== id));
  };

  // CRUD for Categories
  const addCategory = (cData: Omit<Category, 'id' | 'slug'>) => {
    const newCat: Category = {
      ...cData,
      id: `cat-${Math.floor(1000 + Math.random() * 9000)}`,
      slug: cData.nameEn.toLowerCase().replace(/\s+/g, '-')
    };
    saveAndSet<Category[]>('seba_categories', setCategoriesState, (prev) => [...prev, newCat]);
  };

  const editCategory = (id: string, cData: Partial<Category>) => {
    saveAndSet<Category[]>('seba_categories', setCategoriesState, (prev) => 
      prev.map(c => c.id === id ? { 
        ...c, 
        ...cData,
        slug: cData.nameEn ? cData.nameEn.toLowerCase().replace(/\s+/g, '-') : c.slug
      } : c)
    );
  };

  const deleteCategory = (id: string) => {
    saveAndSet<Category[]>('seba_categories', setCategoriesState, (prev) => prev.filter(c => c.id !== id));
  };

  // CRUD Coupon
  const addCoupon = (c: Coupon) => {
    saveAndSet<Coupon[]>('seba_coupons', setCouponsState, (prev) => [...prev, c]);
  };

  const deleteCoupon = (id: string) => {
    saveAndSet<Coupon[]>('seba_coupons', setCouponsState, (prev) => prev.filter(c => c.id !== id));
  };

  // CRUD Blogs
  const addBlog = (blogData: Omit<Blog, 'id' | 'views' | 'createdAt'>) => {
    const b: Blog = {
      ...blogData,
      id: `blog-${Math.floor(10000 + Math.random() * 90000)}`,
      views: 0,
      createdAt: new Date().toISOString()
    };
    saveAndSet<Blog[]>('seba_blogs', setBlogsState, (prev) => [b, ...prev]);
  };

  const deleteBlog = (id: string) => {
    saveAndSet<Blog[]>('seba_blogs', setBlogsState, (prev) => prev.filter(b => b.id !== id));
  };

  // Notifications
  const addNotification = (msg: string) => {
    saveAndSet<string[]>('seba_notifications', setNotifications, (prev) => [msg, ...prev].slice(0, 5));
  };

  const clearNotifications = () => {
    saveAndSet<string[]>('seba_notifications', setNotifications, []);
  };

  return (
    <StateContext.Provider value={{
      lang,
      setLang,
      t,
      settings,
      updateSettings,
      currentUser,
      setCurrentUser,
      loginUser,
      registerUser,
      logoutUser,
      users,
      updateUserBalance,
      categories,
      services,
      orders,
      transactions,
      tickets,
      coupons,
      blogs,
      notifications,
      addNotification,
      clearNotifications,
      createOrder,
      updateOrderStatus,
      submitPayment,
      approvePayment,
      rejectPayment,
      applyCoupon,
      submitSupportTicket,
      replyToTicket,
      updateTicketStatus,
      addService,
      editService,
      deleteService,
      addCategory,
      editCategory,
      deleteCategory,
      addCoupon,
      deleteCoupon,
      addBlog,
      deleteBlog
    }}>
      {children}
    </StateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(StateContext);
  if (!context) throw new Error('useAppState must be used within a StateProvider');
  return context;
};
