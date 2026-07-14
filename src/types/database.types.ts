// =============================================================================
// Gradfolio — Database Types
// =============================================================================
// Manual type definitions based on the database schema from PROJECT_SPEC.md.
// Replace with `supabase gen types typescript` output when connected to a
// live Supabase project.
// =============================================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          avatar_url: string | null;
          avatar_public_id: string | null;
          institution: string | null;
          program_studi: string | null;
          angkatan: number | null;
          bio: string | null;
          username: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          avatar_url?: string | null;
          avatar_public_id?: string | null;
          institution?: string | null;
          program_studi?: string | null;
          angkatan?: number | null;
          bio?: string | null;
          username?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          avatar_url?: string | null;
          avatar_public_id?: string | null;
          institution?: string | null;
          program_studi?: string | null;
          angkatan?: number | null;
          bio?: string | null;
          username?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      institutions: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      portfolio_items: {
        Row: {
          id: string;
          user_id: string;
          cover_image_url: string | null;
          cover_image_public_id: string | null;
          title: string;
          category: string;
          jenis_portfolio: string;
          semester: number | null;
          tahun_pengerjaan: number;
          deskripsi_singkat: string;
          deskripsi_lengkap: string;
          peran: string | null;
          status: "draft" | "published";
          tech_stack: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          cover_image_url?: string | null;
          cover_image_public_id?: string | null;
          title: string;
          category: string;
          jenis_portfolio: string;
          semester?: number | null;
          tahun_pengerjaan: number;
          deskripsi_singkat: string;
          deskripsi_lengkap: string;
          peran?: string | null;
          status?: "draft" | "published";
          tech_stack?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          cover_image_url?: string | null;
          cover_image_public_id?: string | null;
          title?: string;
          category?: string;
          jenis_portfolio?: string;
          semester?: number | null;
          tahun_pengerjaan?: number;
          deskripsi_singkat?: string;
          deskripsi_lengkap?: string;
          peran?: string | null;
          status?: "draft" | "published";
          tech_stack?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "portfolio_items_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      portfolio_resources: {
        Row: {
          id: string;
          portfolio_item_id: string;
          resource_type: string;
          label: string;
          url: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          portfolio_item_id: string;
          resource_type: string;
          label: string;
          url: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          portfolio_item_id?: string;
          resource_type?: string;
          label?: string;
          url?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "portfolio_resources_portfolio_item_id_fkey";
            columns: ["portfolio_item_id"];
            isOneToOne: false;
            referencedRelation: "portfolio_items";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
