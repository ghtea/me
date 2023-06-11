export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      questions: {
        Row: {
          answer: string | null
          author_id: string
          created_at: string
          id: string
          notion_url: string | null
          privacy: string
          skill_ids_to_sync: string[] | null
          status: string
          synchronized_at: string | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          answer?: string | null
          author_id: string
          created_at?: string
          id: string
          notion_url?: string | null
          privacy?: string
          skill_ids_to_sync?: string[] | null
          status?: string
          synchronized_at?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Update: {
          answer?: string | null
          author_id?: string
          created_at?: string
          id?: string
          notion_url?: string | null
          privacy?: string
          skill_ids_to_sync?: string[] | null
          status?: string
          synchronized_at?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_author_id_fkey"
            columns: ["author_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      skill_question_relation: {
        Row: {
          created_at: string
          id: string
          question_id: string
          skill_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          question_id: string
          skill_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          question_id?: string
          skill_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "skill_question_relation_question_id_fkey"
            columns: ["question_id"]
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "skill_question_relation_skill_id_fkey"
            columns: ["skill_id"]
            referencedRelation: "skills"
            referencedColumns: ["id"]
          }
        ]
      }
      skills: {
        Row: {
          author_id: string
          created_at: string
          id: string
          synchronized_at: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id: string
          created_at?: string
          id: string
          synchronized_at?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          created_at?: string
          id?: string
          synchronized_at?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "skills_author_id_fkey"
            columns: ["author_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
