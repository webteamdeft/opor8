import {
  User, BusinessProfile, SOPPack, SOPDocument, QuestionnaireAnswers,
  SupportTicket, HelpArticle, ChatSession, ChatMessage, GlobalConfig, Role, StepStatus
} from "../types";
import { supabase } from './supabase';

export const DB = {
  users: {
    async getAll(): Promise<User[]> {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role as Role,
        isPaid: u.is_paid,
        emailVerified: u.email_verified,
        createdAt: u.created_at
      }));
    },

    async update(id: string, updates: Partial<User>): Promise<void> {
      const dbUpdates: any = {};
      if (updates.name) dbUpdates.name = updates.name;
      if (updates.email) dbUpdates.email = updates.email;
      if (updates.role) dbUpdates.role = updates.role;
      if (updates.isPaid !== undefined) dbUpdates.is_paid = updates.isPaid;
      if (updates.emailVerified !== undefined) dbUpdates.email_verified = updates.emailVerified;

      const { error } = await supabase
        .from('users')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;
    }
  },

  profiles: {
    async getByUser(userId: string): Promise<BusinessProfile | null> {
      const { data, error } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return {
        userId: data.user_id,
        name: data.name,
        industry: data.industry,
        size: data.size,
        country: data.country,
        tone: data.tone,
        logoUrl: data.logo_url || ''
      };
    },

    async upsert(profile: BusinessProfile): Promise<void> {
      const { error } = await supabase
        .from('business_profiles')
        .upsert({
          user_id: profile.userId,
          name: profile.name,
          industry: profile.industry,
          size: profile.size,
          country: profile.country,
          tone: profile.tone,
          logo_url: profile.logoUrl || null,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;
    }
  },

  packs: {
    async getAll(userId?: string): Promise<SOPPack[]> {
      let query = supabase
        .from('sop_packs')
        .select('*')
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map(p => ({
        id: p.id,
        userId: p.user_id,
        name: p.name,
        departments: p.departments,
        status: p.status as StepStatus,
        progress: p.progress,
        createdAt: p.created_at
      }));
    },

    async create(pack: SOPPack): Promise<void> {
      const { error } = await supabase
        .from('sop_packs')
        .insert({
          id: pack.id,
          user_id: pack.userId,
          name: pack.name,
          departments: pack.departments,
          status: pack.status,
          progress: pack.progress
        });

      if (error) throw error;
    },

    async update(id: string, updates: Partial<SOPPack>): Promise<void> {
      const dbUpdates: any = {};
      if (updates.name) dbUpdates.name = updates.name;
      if (updates.departments) dbUpdates.departments = updates.departments;
      if (updates.status) dbUpdates.status = updates.status;
      if (updates.progress !== undefined) dbUpdates.progress = updates.progress;

      const { error } = await supabase
        .from('sop_packs')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;
    }
  },

  docs: {
    async getByPack(packId: string): Promise<SOPDocument[]> {
      const { data, error } = await supabase
        .from('sop_documents')
        .select('*')
        .eq('pack_id', packId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return (data || []).map(d => ({
        id: d.id,
        packId: d.pack_id,
        title: d.title,
        department: d.department,
        content: d.content,
        isSample: d.is_sample,
        version: d.version,
        lastUpdated: d.updated_at
      }));
    },

    async getAll(): Promise<SOPDocument[]> {
      const { data, error } = await supabase
        .from('sop_documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(d => ({
        id: d.id,
        packId: d.pack_id,
        title: d.title,
        department: d.department,
        content: d.content,
        isSample: d.is_sample,
        version: d.version,
        lastUpdated: d.updated_at
      }));
    },

    async createBatch(docs: SOPDocument[]): Promise<void> {
      const { error } = await supabase
        .from('sop_documents')
        .insert(
          docs.map(d => ({
            id: d.id,
            pack_id: d.packId,
            title: d.title,
            department: d.department,
            content: d.content,
            is_sample: d.isSample,
            version: d.version
          }))
        );

      if (error) throw error;
    }
  },

  answers: {
    async get(packId: string): Promise<QuestionnaireAnswers | null> {
      const { data, error } = await supabase
        .from('questionnaire_answers')
        .select('*')
        .eq('pack_id', packId)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return {
        packId: data.pack_id,
        hasEmployees: data.has_employees,
        cycle: data.cycle,
        approver: data.approver,
        tools: data.tools,
        compliance: data.compliance,
        specifics: data.specifics || ''
      };
    },

    async upsert(answers: QuestionnaireAnswers): Promise<void> {
      const { error } = await supabase
        .from('questionnaire_answers')
        .upsert({
          pack_id: answers.packId,
          has_employees: answers.hasEmployees,
          cycle: answers.cycle,
          approver: answers.approver,
          tools: answers.tools,
          compliance: answers.compliance,
          specifics: answers.specifics
        }, {
          onConflict: 'pack_id'
        });

      if (error) throw error;
    }
  },

  tickets: {
    async getAll(): Promise<SupportTicket[]> {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(t => ({
        id: t.id,
        userId: t.user_id,
        userName: t.user_name,
        category: t.category,
        description: t.description,
        status: t.status as 'Open' | 'Closed',
        createdAt: t.created_at
      }));
    },

    async create(ticket: Partial<SupportTicket>): Promise<void> {
      const { error } = await supabase
        .from('support_tickets')
        .insert({
          user_id: ticket.userId!,
          user_name: ticket.userName!,
          category: ticket.category!,
          description: ticket.description!,
          status: ticket.status || 'Open'
        });

      if (error) throw error;
    },

    async updateStatus(id: string, status: 'Open' | 'Closed'): Promise<void> {
      const { error } = await supabase
        .from('support_tickets')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
    }
  },

  articles: {
    async getAll(): Promise<HelpArticle[]> {
      const { data, error } = await supabase
        .from('help_articles')
        .select('*')
        .order('last_updated', { ascending: false });

      if (error) throw error;

      return (data || []).map(a => ({
        id: a.id,
        title: a.title,
        category: a.category,
        content: a.content,
        lastUpdated: a.last_updated
      }));
    },

    async upsert(article: HelpArticle): Promise<void> {
      const { error } = await supabase
        .from('help_articles')
        .upsert({
          id: article.id,
          title: article.title,
          category: article.category,
          content: article.content,
          last_updated: new Date().toISOString()
        }, {
          onConflict: 'id'
        });

      if (error) throw error;
    },

    async delete(id: string): Promise<void> {
      const { error } = await supabase
        .from('help_articles')
        .delete()
        .eq('id', id);

      if (error) throw error;
    }
  },

  chats: {
    async getOrCreate(userId: string, userName: string): Promise<ChatSession> {
      const { data: existing } = await supabase
        .from('chat_sessions')
        .select('*, chat_messages(*)')
        .eq('user_id', userId)
        .eq('status', 'active')
        .maybeSingle();

      if (existing) {
        return {
          id: existing.id,
          userId: existing.user_id,
          userName: existing.user_name,
          messages: (existing.chat_messages || []).map((m: any) => ({
            id: m.id,
            senderId: m.sender_id,
            senderName: m.sender_name,
            text: m.text,
            timestamp: m.created_at,
            isAdmin: m.is_admin
          })),
          status: existing.status as 'active' | 'archived',
          lastActivity: existing.last_activity
        };
      }

      const { data: newSession, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: userId,
          user_name: userName,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: newSession.id,
        userId: newSession.user_id,
        userName: newSession.user_name,
        messages: [],
        status: newSession.status as 'active' | 'archived',
        lastActivity: newSession.last_activity
      };
    },

    async sendMessage(sessionId: string, message: ChatMessage): Promise<void> {
      const { error: messageError } = await supabase
        .from('chat_messages')
        .insert({
          session_id: sessionId,
          sender_id: message.senderId,
          sender_name: message.senderName,
          text: message.text,
          is_admin: message.isAdmin
        });

      if (messageError) throw messageError;

      const { error: sessionError } = await supabase
        .from('chat_sessions')
        .update({ last_activity: new Date().toISOString() })
        .eq('id', sessionId);

      if (sessionError) throw sessionError;
    },

    async getAll(): Promise<ChatSession[]> {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*, chat_messages(*)')
        .order('last_activity', { ascending: false });

      if (error) throw error;

      return (data || []).map(s => ({
        id: s.id,
        userId: s.user_id,
        userName: s.user_name,
        messages: (s.chat_messages || []).map((m: any) => ({
          id: m.id,
          senderId: m.sender_id,
          senderName: m.sender_name,
          text: m.text,
          timestamp: m.created_at,
          isAdmin: m.is_admin
        })),
        status: s.status as 'active' | 'archived',
        lastActivity: s.last_activity
      }));
    }
  },

  config: {
    async get(): Promise<GlobalConfig> {
      const { data, error } = await supabase
        .from('global_config')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        return {
          supportEmail: 'support@opor8.ai',
          welcomeMessage: 'Welcome to the elite procedural engine.'
        };
      }

      return {
        supportEmail: data.support_email,
        welcomeMessage: data.welcome_message,
        systemAlert: data.system_alert || undefined
      };
    },

    async update(updates: Partial<GlobalConfig>): Promise<void> {
      const dbUpdates: any = { updated_at: new Date().toISOString() };
      if (updates.supportEmail) dbUpdates.support_email = updates.supportEmail;
      if (updates.welcomeMessage) dbUpdates.welcome_message = updates.welcomeMessage;
      if (updates.systemAlert !== undefined) dbUpdates.system_alert = updates.systemAlert;

      const { error } = await supabase
        .from('global_config')
        .update(dbUpdates)
        .eq('id', 1);

      if (error) throw error;
    }
  }
};
