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
import { fetchFromCloud, saveToCloud } from './supabase';

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
  updateUserRole: (userId: string, role: 'user' | 'admin') => void;

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
  editCoupon: (id: string, c: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  addBlog: (b: Omit<Blog, 'id' | 'views' | 'createdAt'>) => void;
  editBlog: (id: string, b: Partial<Blog>) => void;
  deleteBlog: (id: string) => void;
  deleteUser: (id: string) => void;
  editUser: (id: string, u: Partial<UserProfile>) => void;
  deleteOrder: (id: string) => void;
  editOrder: (id: string, o: Partial<Order>) => void;
  deleteTransaction: (id: string) => void;
  editTransaction: (id: string, tData: Partial<PaymentTransaction>) => void;
  deleteSupportTicket: (id: string) => void;

  // Supabase Cloud Actions
  syncAllToSupabase: () => Promise<{ success: boolean; message: string }>;
  isCloudLoading: boolean;
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
  const [isCloudLoading, setIsCloudLoading] = useState<boolean>(false);

  // Selected language translations
  const t = translations[lang];

  // Load all states on startup
  useEffect(() => {
    const loadAllAndSync = async () => {
      setIsCloudLoading(true);
      const localLang = localStorage.getItem('seba_lang') as Language;
      if (localLang) setLangState(localLang);

      const loadData = <T,>(key: string, defaultVal: T): T => {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultVal;
      };

      // 1. Initial State from localStorage / defaults
      const initialSettings = loadData('seba_settings', defaultAppSettings);
      const initialUsers = loadData('seba_users', defaultUsers);
      const initialCategories = loadData('seba_categories', defaultCategories);
      const initialServices = loadData('seba_services', defaultServices);
      const initialOrders = loadData('seba_orders', defaultOrders);
      const initialTransactions = loadData('seba_transactions', defaultTransactions);
      const initialTickets = loadData('seba_tickets', defaultTickets);
      const initialCoupons = loadData('seba_coupons', defaultCoupons);
      const initialBlogs = loadData('seba_blogs', defaultBlogs);

      setSettings(initialSettings);
      setUsersState(initialUsers);
      setCategoriesState(initialCategories);
      setServicesState(initialServices);
      setOrdersState(initialOrders);
      setTransactionsState(initialTransactions);
      setTicketsState(initialTickets);
      setCouponsState(initialCoupons);
      setBlogsState(initialBlogs);
      setNotifications(loadData('seba_notifications', [
        "Welcome to our premium follow-link digital automation suite!",
        "ব্যবহার করুন প্রোমো কোড BOOST50 এবং বুঝে নিন ১০% ক্যাশব্যাক ডিসকাউন্ট।"
      ]));

      // 2. Async Sync with Supabase (if tables exist)
      try {
        const cloudSettings = await fetchFromCloud<AppSettings>('settings', initialSettings);
        setSettings(cloudSettings);

        const cloudUsers = await fetchFromCloud<UserProfile[]>('users', initialUsers);
        setUsersState(cloudUsers);

        const cloudCategories = await fetchFromCloud<Category[]>('categories', initialCategories);
        setCategoriesState(cloudCategories);

        const cloudServices = await fetchFromCloud<Service[]>('services', initialServices);
        setServicesState(cloudServices);

        const cloudOrders = await fetchFromCloud<Order[]>('orders', initialOrders);
        setOrdersState(cloudOrders);

        const cloudTransactions = await fetchFromCloud<PaymentTransaction[]>('transactions', initialTransactions);
        setTransactionsState(cloudTransactions);

        const cloudTickets = await fetchFromCloud<SupportTicket[]>('tickets', initialTickets);
        setTicketsState(cloudTickets);

        const cloudCoupons = await fetchFromCloud<Coupon[]>('coupons', initialCoupons);
        setCouponsState(cloudCoupons);

        const cloudBlogs = await fetchFromCloud<Blog[]>('blogs', initialBlogs);
        setBlogsState(cloudBlogs);

        // Update current user references if they are already in state
        const savedUserStr = localStorage.getItem('seba_current_user');
        if (savedUserStr) {
          const parsed = JSON.parse(savedUserStr) as UserProfile;
          const freshUser = cloudUsers.find(u => u.id === parsed.id);
          if (freshUser) {
            setCurrentUserState(freshUser);
            localStorage.setItem('seba_current_user', JSON.stringify(freshUser));
          } else {
            setCurrentUserState(parsed);
          }
        } else {
          // Default user auto log-in (to make dashboard instantly readable with stats)
          const defaultUser = cloudUsers.find(u => u.email === 'bayzid6484@gmail.com') || cloudUsers.find(u => u.role === 'admin') || cloudUsers[1];
          if (defaultUser) {
            setCurrentUserState(defaultUser);
            localStorage.setItem('seba_current_user', JSON.stringify(defaultUser));
          }
        }
      } catch (err) {
        console.warn('Realtime Supabase Cloud sync error, using storage fallback:', err);
        // Sync local current user if not updated
        const savedUser = localStorage.getItem('seba_current_user');
        if (savedUser) {
          setCurrentUserState(JSON.parse(savedUser));
        } else {
          const defaultUser = initialUsers.find(u => u.email === 'bayzid6484@gmail.com') || initialUsers[1];
          setCurrentUserState(defaultUser);
          localStorage.setItem('seba_current_user', JSON.stringify(defaultUser));
        }
      } finally {
        setIsCloudLoading(false);
      }
    };

    loadAllAndSync();
  }, []);

  // Update helper functions that also write to localStorage + Supabase Cloud
  const saveAndSet = <T,>(key: string, setter: React.Dispatch<React.SetStateAction<T>>, val: T | ((prev: T) => T)) => {
    setter((prev) => {
      const nextVal = typeof val === 'function' ? (val as Function)(prev) : val;
      localStorage.setItem(key, JSON.stringify(nextVal));

      // Asynchronous background write to Supabase
      const tableName = key.replace('seba_', '');
      saveToCloud(tableName, nextVal);

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
    // Auto register or find admin if email matches
    if (email.toLowerCase() === 'digitalgallery7.24@gmail.com' || email.toLowerCase() === 'admin@test.com') {
      const adminAcc = users.find(u => u.role === 'admin') || defaultUsers.find(u => u.role === 'admin') || defaultUsers[0];
      // Sync admin email locally to make sure it matches
      const updatedAdmin = { ...adminAcc, email: email.toLowerCase() };
      setCurrentUser(updatedAdmin);
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

  const updateUserRole = (userId: string, role: 'user' | 'admin') => {
    saveAndSet<UserProfile[]>('seba_users', setUsersState, (prev) => {
      const rawUsers = prev.map(u => u.id === userId ? { ...u, role } : u);
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
    saveAndSet<Coupon[]>('seba_coupons', setCouponsState, (prev) => {
      const exists = prev.some(item => item.id === c.id);
      if (exists) {
        return prev.map(item => item.id === c.id ? { ...item, ...c } : item);
      }
      return [...prev, c];
    });
  };

  const editCoupon = (id: string, cData: Partial<Coupon>) => {
    saveAndSet<Coupon[]>('seba_coupons', setCouponsState, (prev) => 
      prev.map(c => c.id === id ? { ...c, ...cData } : c)
    );
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

  const editBlog = (id: string, bData: Partial<Blog>) => {
    saveAndSet<Blog[]>('seba_blogs', setBlogsState, (prev) => 
      prev.map(b => b.id === id ? { ...b, ...bData } : b)
    );
  };

  const deleteBlog = (id: string) => {
    saveAndSet<Blog[]>('seba_blogs', setBlogsState, (prev) => prev.filter(b => b.id !== id));
  };

  // CRUD Users
  const deleteUser = (id: string) => {
    saveAndSet<UserProfile[]>('seba_users', setUsersState, (prev) => prev.filter(u => u.id !== id));
  };

  const editUser = (id: string, uData: Partial<UserProfile>) => {
    saveAndSet<UserProfile[]>('seba_users', setUsersState, (prev) => {
      const rawUsers = prev.map(u => u.id === id ? { ...u, ...uData } : u);
      if (currentUser && currentUser.id === id) {
        const updated = rawUsers.find(u => u.id === id);
        if (updated) {
          setCurrentUserState(updated);
          localStorage.setItem('seba_current_user', JSON.stringify(updated));
        }
      }
      return rawUsers;
    });
  };

  // CRUD Orders
  const deleteOrder = (id: string) => {
    saveAndSet<Order[]>('seba_orders', setOrdersState, (prev) => prev.filter(o => o.id !== id));
  };

  const editOrder = (id: string, oData: Partial<Order>) => {
    saveAndSet<Order[]>('seba_orders', setOrdersState, (prev) => 
      prev.map(o => o.id === id ? { ...o, ...oData } : o)
    );
  };

  // CRUD Transactions
  const deleteTransaction = (id: string) => {
    saveAndSet<PaymentTransaction[]>('seba_transactions', setTransactionsState, (prev) => prev.filter(t => t.id !== id));
  };

  const editTransaction = (id: string, tData: Partial<PaymentTransaction>) => {
    saveAndSet<PaymentTransaction[]>('seba_transactions', setTransactionsState, (prev) => 
      prev.map(t => t.id === id ? { ...t, ...tData } : t)
    );
  };

  // CRUD Support Tickets
  const deleteSupportTicket = (id: string) => {
    saveAndSet<SupportTicket[]>('seba_tickets', setTicketsState, (prev) => prev.filter(t => t.id !== id));
  };

  // Notifications
  const addNotification = (msg: string) => {
    saveAndSet<string[]>('seba_notifications', setNotifications, (prev) => [msg, ...prev].slice(0, 5));
  };

  const clearNotifications = () => {
    saveAndSet<string[]>('seba_notifications', setNotifications, []);
  };

  // Force seed / sync all tables to Supabase
  const syncAllToSupabase = async (): Promise<{ success: boolean; message: string }> => {
    try {
      setIsCloudLoading(true);
      const s1 = await saveToCloud('settings', settings);
      const s2 = await saveToCloud('users', users);
      const s3 = await saveToCloud('categories', categories);
      const s4 = await saveToCloud('services', services);
      const s5 = await saveToCloud('orders', orders);
      const s6 = await saveToCloud('transactions', transactions);
      const s7 = await saveToCloud('tickets', tickets);
      const s8 = await saveToCloud('coupons', coupons);
      const s9 = await saveToCloud('blogs', blogs);

      if (s1 && s2 && s3 && s4 && s5 && s6 && s7 && s8 && s9) {
        return { success: true, message: 'All tables synced successfully to Supabase!' };
      } else {
        return { success: true, message: 'Synced partially. Please ensure tables are created with public access in Supabase.' };
      }
    } catch (err: any) {
      console.error('Supabase seed error:', err);
      return { success: false, message: `Failed to sync: ${err.message || err}` };
    } finally {
      setIsCloudLoading(false);
    }
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
      updateUserRole,
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
      editCoupon,
      deleteCoupon,
      addBlog,
      editBlog,
      deleteBlog,
      deleteUser,
      editUser,
      deleteOrder,
      editOrder,
      deleteTransaction,
      editTransaction,
      deleteSupportTicket,
      syncAllToSupabase,
      isCloudLoading
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
