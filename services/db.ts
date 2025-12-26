
import { 
  User, BusinessProfile, SOPPack, SOPDocument, QuestionnaireAnswers, 
  SupportTicket, HelpArticle, ChatSession, ChatMessage, GlobalConfig 
} from "../types";
import { INITIAL_USER, INITIAL_HELP_ARTICLES, INITIAL_DOCUMENTS } from "./initialData";

const DB_KEYS = {
  USERS: 'op8_users',
  PROFILES: 'op8_profiles',
  PACKS: 'op8_packs',
  DOCS: 'op8_docs',
  ANSWERS: 'op8_answers',
  TICKETS: 'op8_tickets',
  ARTICLES: 'op8_help_articles',
  CHATS: 'op8_chats',
  CONFIG: 'op8_global_config'
};

const get = <T>(key: string): T[] => {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch (e) {
    return [];
  }
};

const set = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const DB = {
  initialize: () => {
    // Seed Users
    if (get(DB_KEYS.USERS).length === 0) {
      set(DB_KEYS.USERS, [INITIAL_USER]);
    }
    // Seed Articles
    if (get(DB_KEYS.ARTICLES).length === 0) {
      set(DB_KEYS.ARTICLES, INITIAL_HELP_ARTICLES);
    }
    // Seed Docs
    if (get(DB_KEYS.DOCS).length === 0) {
      set(DB_KEYS.DOCS, INITIAL_DOCUMENTS);
    }
    // Seed Config
    if (!localStorage.getItem(DB_KEYS.CONFIG)) {
      set(DB_KEYS.CONFIG, {
        supportEmail: 'support@opor8.ai',
        welcomeMessage: 'Welcome to the elite procedural engine. How can we optimize your operations today?'
      });
    }
  },

  config: {
    get: (): GlobalConfig => JSON.parse(localStorage.getItem(DB_KEYS.CONFIG) || JSON.stringify({
      supportEmail: 'support@opor8.ai',
      welcomeMessage: 'Welcome to the elite procedural engine.'
    })),
    update: (updates: Partial<GlobalConfig>) => {
      const current = DB.config.get();
      set(DB_KEYS.CONFIG, { ...current, ...updates });
    }
  },

  users: {
    find: (email: string) => get<User>(DB_KEYS.USERS).find(u => u.email.toLowerCase() === email.toLowerCase()),
    getAll: () => get<User>(DB_KEYS.USERS),
    create: (user: User) => {
      const users = get<User>(DB_KEYS.USERS);
      users.push(user);
      set(DB_KEYS.USERS, users);
    },
    update: (id: string, updates: Partial<User>) => {
      const users = get<User>(DB_KEYS.USERS).map(u => u.id === id ? { ...u, ...updates } : u);
      set(DB_KEYS.USERS, users);
    }
  },

  profiles: {
    getByUser: (userId: string) => get<BusinessProfile>(DB_KEYS.PROFILES).find(p => p.userId === userId),
    upsert: (profile: BusinessProfile) => {
      const profiles = get<BusinessProfile>(DB_KEYS.PROFILES).filter(p => p.userId !== profile.userId);
      profiles.push(profile);
      set(DB_KEYS.PROFILES, profiles);
    }
  },

  packs: {
    getAll: (userId?: string) => {
      const all = get<SOPPack>(DB_KEYS.PACKS);
      return userId ? all.filter(p => p.userId === userId) : all;
    },
    create: (pack: SOPPack) => {
      const packs = get<SOPPack>(DB_KEYS.PACKS);
      packs.push(pack);
      set(DB_KEYS.PACKS, packs);
    },
    update: (id: string, updates: Partial<SOPPack>) => {
      const packs = get<SOPPack>(DB_KEYS.PACKS).map(p => p.id === id ? { ...p, ...updates } : p);
      set(DB_KEYS.PACKS, packs);
    }
  },

  docs: {
    getByPack: (packId: string) => get<SOPDocument>(DB_KEYS.DOCS).filter(d => d.packId === packId),
    getAll: () => get<SOPDocument>(DB_KEYS.DOCS),
    createBatch: (docs: SOPDocument[]) => {
      const existing = get<SOPDocument>(DB_KEYS.DOCS);
      set(DB_KEYS.DOCS, [...existing, ...docs]);
    }
  },

  articles: {
    getAll: () => get<HelpArticle>(DB_KEYS.ARTICLES),
    upsert: (article: HelpArticle) => {
      const all = get<HelpArticle>(DB_KEYS.ARTICLES).filter(a => a.id !== article.id);
      all.push(article);
      set(DB_KEYS.ARTICLES, all);
    },
    delete: (id: string) => {
      const all = get<HelpArticle>(DB_KEYS.ARTICLES).filter(a => a.id !== id);
      set(DB_KEYS.ARTICLES, all);
    }
  },

  chats: {
    getOrCreate: (userId: string, userName: string): ChatSession => {
      const all = get<ChatSession>(DB_KEYS.CHATS);
      const existing = all.find(c => c.userId === userId && c.status === 'active');
      if (existing) return existing;
      
      const newSession: ChatSession = {
        id: 'chat_' + Math.random().toString(36).substr(2, 9),
        userId,
        userName,
        messages: [],
        status: 'active',
        lastActivity: new Date().toISOString()
      };
      all.push(newSession);
      set(DB_KEYS.CHATS, all);
      return newSession;
    },
    sendMessage: (sessionId: string, message: ChatMessage) => {
      const all = get<ChatSession>(DB_KEYS.CHATS);
      const updated = all.map(c => {
        if (c.id === sessionId) {
          return {
            ...c,
            messages: [...c.messages, message],
            lastActivity: new Date().toISOString()
          };
        }
        return c;
      });
      set(DB_KEYS.CHATS, updated);
    },
    getAll: () => get<ChatSession>(DB_KEYS.CHATS)
  },

  answers: {
    get: (packId: string) => get<QuestionnaireAnswers>(DB_KEYS.ANSWERS).find(a => a.packId === packId),
    upsert: (answers: QuestionnaireAnswers) => {
      const all = get<QuestionnaireAnswers>(DB_KEYS.ANSWERS).filter(a => a.packId !== answers.packId);
      all.push(answers);
      set(DB_KEYS.ANSWERS, all);
    }
  },

  tickets: {
    getAll: () => get<SupportTicket>(DB_KEYS.TICKETS),
    create: (ticket: Partial<SupportTicket>) => {
      const tickets = get<SupportTicket>(DB_KEYS.TICKETS);
      const newTicket = {
        ...ticket,
        id: 'tkt_' + Math.random().toString(36).substr(2, 9),
        status: 'Open',
        createdAt: new Date().toISOString()
      } as SupportTicket;
      tickets.push(newTicket);
      set(DB_KEYS.TICKETS, tickets);
    }
  }
};
