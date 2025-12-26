export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          role: 'user' | 'admin' | 'support'
          is_paid: boolean
          email_verified: boolean
          created_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          role?: 'user' | 'admin' | 'support'
          is_paid?: boolean
          email_verified?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: 'user' | 'admin' | 'support'
          is_paid?: boolean
          email_verified?: boolean
          created_at?: string
        }
      }
      business_profiles: {
        Row: {
          id: string
          user_id: string
          name: string
          industry: string
          size: string
          country: string
          tone: string
          logo_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          industry: string
          size: string
          country: string
          tone?: string
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          industry?: string
          size?: string
          country?: string
          tone?: string
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      sop_packs: {
        Row: {
          id: string
          user_id: string
          name: string
          departments: string[]
          status: 'Queued' | 'In Progress' | 'Completed' | 'Failed'
          progress: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          departments: string[]
          status?: 'Queued' | 'In Progress' | 'Completed' | 'Failed'
          progress?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          departments?: string[]
          status?: 'Queued' | 'In Progress' | 'Completed' | 'Failed'
          progress?: number
          created_at?: string
        }
      }
      sop_documents: {
        Row: {
          id: string
          pack_id: string
          title: string
          department: string
          content: string
          is_sample: boolean
          version: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          pack_id: string
          title: string
          department: string
          content: string
          is_sample?: boolean
          version?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          pack_id?: string
          title?: string
          department?: string
          content?: string
          is_sample?: boolean
          version?: string
          created_at?: string
          updated_at?: string
        }
      }
      questionnaire_answers: {
        Row: {
          id: string
          pack_id: string
          has_employees: boolean
          cycle: string
          approver: string
          tools: string[]
          compliance: string[]
          specifics: string | null
          created_at: string
        }
        Insert: {
          id?: string
          pack_id: string
          has_employees?: boolean
          cycle: string
          approver: string
          tools?: string[]
          compliance?: string[]
          specifics?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          pack_id?: string
          has_employees?: boolean
          cycle?: string
          approver?: string
          tools?: string[]
          compliance?: string[]
          specifics?: string | null
          created_at?: string
        }
      }
      support_tickets: {
        Row: {
          id: string
          user_id: string
          user_name: string
          category: string
          description: string
          status: 'Open' | 'Closed'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          user_name: string
          category: string
          description: string
          status?: 'Open' | 'Closed'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          user_name?: string
          category?: string
          description?: string
          status?: 'Open' | 'Closed'
          created_at?: string
        }
      }
      help_articles: {
        Row: {
          id: string
          title: string
          category: string
          content: string
          last_updated: string
        }
        Insert: {
          id?: string
          title: string
          category: string
          content: string
          last_updated?: string
        }
        Update: {
          id?: string
          title?: string
          category?: string
          content?: string
          last_updated?: string
        }
      }
      chat_sessions: {
        Row: {
          id: string
          user_id: string
          user_name: string
          status: 'active' | 'archived'
          last_activity: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          user_name: string
          status?: 'active' | 'archived'
          last_activity?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          user_name?: string
          status?: 'active' | 'archived'
          last_activity?: string
          created_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          session_id: string
          sender_id: string
          sender_name: string
          text: string
          is_admin: boolean
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          sender_id: string
          sender_name: string
          text: string
          is_admin?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          sender_id?: string
          sender_name?: string
          text?: string
          is_admin?: boolean
          created_at?: string
        }
      }
      global_config: {
        Row: {
          id: number
          support_email: string
          welcome_message: string
          system_alert: string | null
          updated_at: string
        }
        Insert: {
          id?: number
          support_email?: string
          welcome_message?: string
          system_alert?: string | null
          updated_at?: string
        }
        Update: {
          id?: number
          support_email?: string
          welcome_message?: string
          system_alert?: string | null
          updated_at?: string
        }
      }
    }
  }
}
