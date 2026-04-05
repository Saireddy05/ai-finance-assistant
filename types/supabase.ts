export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          currency: string
          xp: number
          level: number
          streak: number
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          currency?: string
          xp?: number
          level?: number
          streak?: number
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          currency?: string
          xp?: number
          level?: number
          streak?: number
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          category: string
          description: string | null
          date: string
          type: 'income' | 'expense'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          category: string
          description?: string | null
          date?: string
          type: 'income' | 'expense'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          category?: string
          description?: string | null
          date?: string
          type?: 'income' | 'expense'
          created_at?: string
        }
      }
      budgets: {
        Row: {
          id: string
          user_id: string
          category: string
          limit_amount: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category: string
          limit_amount: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category?: string
          limit_amount?: number
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: 'info' | 'warning' | 'success' | 'error'
          is_read: boolean
          is_dismissed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type?: 'info' | 'warning' | 'success' | 'error'
          is_read?: boolean
          is_dismissed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: 'info' | 'warning' | 'success' | 'error'
          is_read?: boolean
          is_dismissed?: boolean
          created_at?: string
        }
      }
      notification_history: {
        Row: {
          id: string
          user_id: string
          title: string
          category: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          category?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          category?: string | null
          created_at?: string
        }
      }
      savings_goals: {
        Row: {
          id: string
          user_id: string
          title: string
          target_amount: number
          current_amount: number
          deadline: string | null
          status: 'active' | 'completed' | 'cancelled'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          target_amount: number
          current_amount?: number
          deadline?: string | null
          status?: 'active' | 'completed' | 'cancelled'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          target_amount?: number
          current_amount?: number
          deadline?: string | null
          status?: 'active' | 'completed' | 'cancelled'
          created_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          user_id: string
          title: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          created_at?: string
        }
      },
      ai_messages: {
        Row: {
          id: string
          user_id: string
          conversation_id: string
          role: 'user' | 'assistant'
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          conversation_id: string
          role: 'user' | 'assistant'
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          conversation_id?: string
          role?: 'user' | 'assistant'
          content?: string
          created_at?: string
        }
      },
      user_lessons: {
        Row: {
          id: string
          user_id: string
          lesson_id: number
          completed_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: number
          completed_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          lesson_id?: number
          completed_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
