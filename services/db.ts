import {
  SOPDocument, SOPPack, User, BusinessProfile, QuestionnaireAnswers,
  SupportTicket, HelpArticle, ChatSession, ChatMessage, GlobalConfig,
  TransactionResponse, Product
} from "../types";
import { api, BASE_URL } from './api';

/**
 * DB Service Refactored for Custom API
 * All paths are relative to the /api/v1 base URL defined in api.ts
 */

export const DB = {
  users: {
    async getAll(): Promise<User[]> {
      return api.get('/users');
    },

    async update(id: string, updates: Partial<User>): Promise<void> {
      return api.put(`/users/${id}`, updates);
    }
  },

  profiles: {
    async getByUser(userId: string): Promise<BusinessProfile | null> {
      try {
        // Fetch current user's profile
        const response = await api.get('/user/profile');
        const data = response.data || response;
        const profileData = data.profile || data.businessProfile || data;

        return {
          userId: profileData.userId || userId,
          name: profileData.name || profileData.businessName || '',
          industry: profileData.industry || profileData.industryType || '',
          size: profileData.size || '',
          country: profileData.country || '',
          tone: profileData.tone || profileData.complianceTone || 'Professional',
          logoUrl: profileData.logoUrl || profileData.logo_url || profileData.brandingLogo || '',
          // Additional fields for API
          fullName: profileData.fullName || '',
          dob: profileData.dob || '',
          gender: profileData.gender || '',
          businessName: profileData.businessName || profileData.name || '',
          industryType: profileData.industryType || profileData.industry || '',
          complianceTone: profileData.complianceTone || profileData.tone || '',
          primaryExportFormat: profileData.primaryExportFormat || 'PDF',
          brandingLogo: profileData.brandingLogo || profileData.logoUrl || profileData.logo_url || ''
        };
      } catch (err) {
        console.warn('[DB] Failed to fetch profile:', err);
        return null;
      }
    },

    async upsert(profile: BusinessProfile | FormData): Promise<void> {
      return api.put('/user/profile', profile);
    }
  },
  // 
  packs: {
    async getAll(userId?: string): Promise<SOPPack[]> {
      const endpoint = userId ? `/packs?userId=${userId}` : '/packs';
      return api.get(endpoint);
    },

    async create(pack: SOPPack): Promise<void> {
      return api.post('/packs', pack);
    },

    async update(id: string, updates: Partial<SOPPack>): Promise<void> {
      return api.put(`/packs/${id}`, updates);
    }
  },

  docs: {
    async getByPack(packId: string): Promise<SOPDocument[]> {
      return api.get(`/docs?packId=${packId}`);
    },

    async getAll(): Promise<SOPDocument[]> {
      return api.get('/docs');
    },

    async createBatch(docs: SOPDocument[]): Promise<void> {
      return api.post('/docs/batch', { docs });
    },

    async generateDocument(question: string): Promise<{ title: string, businessVertical: string, lastSynthesis: string, pdfUrl: string, docxUrl: string }> {
      const response = await api.post('/openai/generate-document', { question });
      // The API returns { success: true, data: { ... } }
      const data = response.data || response;

      // Prepend root BASE_URL if the URLs are relative (stripping /api/v1)
      const rootURL = BASE_URL.replace(/\/api\/v1\/?$/, '');

      return {
        ...data,
        pdfUrl: data.pdfUrl?.startsWith('http') ? data.pdfUrl : `${rootURL}${data.pdfUrl}`,
        docxUrl: data.docxUrl?.startsWith('http') ? data.docxUrl : `${rootURL}${data.docxUrl}`
      };
    },

    async generateDocumentWithAnswers(answers: { type: string, questionId: string, answer: string }[]): Promise<any> {
      return await api.post('/openai/generate-document-answer', { answers });
    },

    async getActiveJob(): Promise<any> {
      try {
        return await api.get('/openai/active-job');
      } catch (error: any) {
        return { success: false, message: error?.message || 'No active job' };
      }
    },

    async getJobProgress(jobId: string): Promise<any> {
      try {
        const response = await api.get(`/openai/progress/${jobId}`);
        const data = response.data || response;
        const result = response.result || data.result;

        // Normalize status to lowercase
        const status = (response.status || data.status || 'in-progress').toLowerCase();
        const progress = typeof response.progress === 'number' ? response.progress : (typeof data.progress === 'number' ? data.progress : parseInt(data.progress || response.progress) || 0);

        let formattedResult = result;
        if (result) {
          const rootURL = BASE_URL.replace(/\/api\/v1\/?$/, '');
          formattedResult = {
            ...result,
            pdfUrl: result.pdfUrl?.startsWith('http') ? result.pdfUrl : `${rootURL}${result.pdfUrl}`,
            docxUrl: result.docxUrl?.startsWith('http') ? result.docxUrl : `${rootURL}${result.docxUrl}`,
            htmlUrl: result.htmlUrl?.startsWith('http') ? result.htmlUrl : `${rootURL}${result.htmlUrl}`
          };
        }

        return {
          ...response,
          ...data,
          status: status as any,
          progress,
          result: formattedResult
        };
      } catch (error) {
        console.error(`[DB] Error fetching job progress ${jobId}:`, error);
        throw error;
      }
    },

    getSSEUrl(jobId: string): string {
      return `${BASE_URL.replace(/\/api\/v1\/?$/, '')}/api/v1/openai/progress/${jobId}`;
    },

    async getUserDocuments(options: {
      offset?: number;
      limit?: number;
      search?: string;
      sort?: string;
      order?: number;
    } = {}): Promise<SOPDocument[]> {
      const payload = {
        offset: options.offset ?? 0,
        limit: options.limit ?? 10,
        search: options.search ?? '',
        sort: options.sort ?? 'createdAt',
        order: options.order ?? -1
      };

      const response = await api.post('/user/document-list', payload);
      const data = response.data || response;
      const list = data.list || [];
      const rootURL = BASE_URL.replace(/\/api\/v1\/?$/, '');

      return list.map((doc: any) => ({
        id: doc._id,
        title: doc.title,
        department: doc.businessVertical,
        lastUpdated: doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : 'N/A',
        pdfUrl: doc.pdfUrl ? (doc.pdfUrl.startsWith('http') ? doc.pdfUrl : `${rootURL}${doc.pdfUrl}`) : undefined,
        docxUrl: doc.docxUrl ? (doc.docxUrl.startsWith('http') ? doc.docxUrl : `${rootURL}${doc.docxUrl}`) : undefined,
        deploymentStatus: doc.deploymentStatus || 'Live & Audit-Ready'
      }));
    },

    async downloadAllDocumentsZip(options: {
      search?: string;
      sort?: string;
      order?: number;
    } = {}): Promise<{ url: string }> {
      const payload = {
        offset: 0,
        limit: 1000,
        search: options.search ?? '',
        sort: options.sort ?? 'createdAt',
        order: options.order ?? -1
      };

      const response = await api.post('/user/document-zip', payload);
      const data = response.data || response;
      const rootURL = BASE_URL.replace(/\/api\/v1\/?$/, '');

      return {
        url: data.url?.startsWith('http') ? data.url : `${rootURL}${data.url}`
      };
    }
  },

  answers: {
    async get(packId: string): Promise<QuestionnaireAnswers | null> {
      try {
        return await api.get(`/answers/${packId}`);
      } catch (err) {
        return null;
      }
    },

    async upsert(answers: QuestionnaireAnswers): Promise<void> {
      return api.post('/answers/upsert', answers);
    }
  },

  tickets: {
    async getAll(): Promise<SupportTicket[]> {
      return api.get('/tickets');
    },

    async create(ticket: Partial<SupportTicket>): Promise<void> {
      return api.post('/tickets', ticket);
    },

    async updateStatus(id: string, status: 'Open' | 'Closed'): Promise<void> {
      return api.put(`/tickets/${id}/status`, { status });
    }
  },

  articles: {
    async getAll(): Promise<HelpArticle[]> {
      return api.get('/articles');
    },

    async upsert(article: HelpArticle): Promise<void> {
      return api.post('/articles/upsert', article);
    },

    async delete(id: string): Promise<void> {
      return api.delete(`/articles/${id}`);
    }
  },

  chats: {
    async getOrCreate(userId: string, userName: string): Promise<ChatSession> {
      return api.post('/chats/session', { userId, userName });
    },

    async sendMessage(sessionId: string, message: ChatMessage): Promise<void> {
      return api.post(`/chats/session/${sessionId}/messages`, message);
    },

    async getAll(): Promise<ChatSession[]> {
      return api.get('/chats/sessions');
    }
  },

  config: {
    async get(): Promise<GlobalConfig> {
      return api.get('/config');
    },

    async update(updates: Partial<GlobalConfig>): Promise<void> {
      return api.put('/config', updates);
    }
  },

  payments: {
    async getProducts(): Promise<{ data: Product[] }> {
      return api.get('/payment/plans');
    },


    async createStripeSession(planId: string): Promise<{ url: string }> {
      // Use the specific plan ID from the product data
      return api.get(`/payment/stripe/${planId}`);
    },


    async getTransactionHistory(options: {
      offset?: number;
      limit?: number;
      sort?: string;
      order?: number;
      search?: string;
    } = {}): Promise<TransactionResponse> {
      const payload = {
        offset: options.offset ?? 0,
        limit: options.limit ?? 10,
        sort: options.sort ?? 'createdAt',
        order: options.order ?? -1,
        search: options.search ?? ''
      };
      return api.post('/user/transaction-history', payload);
    }
  },

  companies: {
    async getCompanyList(): Promise<any> {
      const payload = {
        offset: 0,
        limit: 10,
        sort: "createdAt",
        order: -1,
        search: ""
      };
      const response = await api.post('/user/company-list', payload);
      return response.data || response;
    },

    async getQuestions(companyId: string): Promise<any> {
      const payload = {
        companyId,
        offset: 0,
        limit: 10,
        sort: "createdAt",
        order: -1,
        search: ""
      };
      const response = await api.post('/user/questions-list', payload);
      return response.data || response;
    }
  }
};
