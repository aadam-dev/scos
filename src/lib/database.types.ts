export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          category: string
          committee_id: string
          created_at: string
          created_by: string
          date: string
          description: string
          duration_minutes: number
          expected_minutes: number | null
          exported_at: string | null
          external_review_notes: string | null
          id: string
          lifecycle_status: Database["public"]["Enums"]["log_lifecycle_status"]
          location: string
          participation_type: Database["public"]["Enums"]["activity_participation_type"]
          status: Database["public"]["Enums"]["activity_status"]
          submitted_to_iou_at: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          committee_id: string
          created_at?: string
          created_by: string
          date: string
          description: string
          duration_minutes: number
          expected_minutes?: number | null
          exported_at?: string | null
          external_review_notes?: string | null
          id?: string
          lifecycle_status?: Database["public"]["Enums"]["log_lifecycle_status"]
          location: string
          participation_type: Database["public"]["Enums"]["activity_participation_type"]
          status?: Database["public"]["Enums"]["activity_status"]
          submitted_to_iou_at?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          committee_id?: string
          created_at?: string
          created_by?: string
          date?: string
          description?: string
          duration_minutes?: number
          expected_minutes?: number | null
          exported_at?: string | null
          external_review_notes?: string | null
          id?: string
          lifecycle_status?: Database["public"]["Enums"]["log_lifecycle_status"]
          location?: string
          participation_type?: Database["public"]["Enums"]["activity_participation_type"]
          status?: Database["public"]["Enums"]["activity_status"]
          submitted_to_iou_at?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_committee_id_fkey"
            columns: ["committee_id"]
            isOneToOne: false
            referencedRelation: "committees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "member_semester_stats"
            referencedColumns: ["member_id"]
          },
          {
            foreignKeyName: "activities_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_media: {
        Row: {
          activity_id: string
          id: string
          mime_type: string
          public_url: string | null
          storage_path: string
          uploaded_at: string
          uploaded_by: string
        }
        Insert: {
          activity_id: string
          id?: string
          mime_type: string
          public_url?: string | null
          storage_path: string
          uploaded_at?: string
          uploaded_by: string
        }
        Update: {
          activity_id?: string
          id?: string
          mime_type?: string
          public_url?: string | null
          storage_path?: string
          uploaded_at?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_media_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_media_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "member_semester_stats"
            referencedColumns: ["member_id"]
          },
          {
            foreignKeyName: "activity_media_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_participants: {
        Row: {
          activity_id: string
          approved_minutes: number
          claimed_minutes: number
          created_at: string
          evidence_required: boolean
          id: string
          member_id: string
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          submitted_minutes: number
          updated_at: string
        }
        Insert: {
          activity_id: string
          approved_minutes: number
          claimed_minutes?: number
          created_at?: string
          evidence_required?: boolean
          id?: string
          member_id: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          submitted_minutes?: number
          updated_at?: string
        }
        Update: {
          activity_id?: string
          approved_minutes?: number
          claimed_minutes?: number
          created_at?: string
          evidence_required?: boolean
          id?: string
          member_id?: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          submitted_minutes?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_participants_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_participants_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "member_semester_stats"
            referencedColumns: ["member_id"]
          },
          {
            foreignKeyName: "activity_participants_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_participants_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "member_semester_stats"
            referencedColumns: ["member_id"]
          },
          {
            foreignKeyName: "activity_participants_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance: {
        Row: {
          created_at: string
          id: string
          marked_at: string
          marked_via: Database["public"]["Enums"]["attendance_mode"]
          meeting_id: string
          member_id: string
          status: Database["public"]["Enums"]["attendance_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          marked_at?: string
          marked_via: Database["public"]["Enums"]["attendance_mode"]
          meeting_id: string
          member_id: string
          status: Database["public"]["Enums"]["attendance_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          marked_at?: string
          marked_via?: Database["public"]["Enums"]["attendance_mode"]
          meeting_id?: string
          member_id?: string
          status?: Database["public"]["Enums"]["attendance_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "member_semester_stats"
            referencedColumns: ["member_id"]
          },
          {
            foreignKeyName: "attendance_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      committees: {
        Row: {
          chair_name: string
          created_at: string
          id: string
          location: string
          logo_url: string | null
          name: string
          secretary_name: string
          semester_end: string
          semester_start: string
          updated_at: string
        }
        Insert: {
          chair_name: string
          created_at?: string
          id?: string
          location: string
          logo_url?: string | null
          name: string
          secretary_name: string
          semester_end: string
          semester_start: string
          updated_at?: string
        }
        Update: {
          chair_name?: string
          created_at?: string
          id?: string
          location?: string
          logo_url?: string | null
          name?: string
          secretary_name?: string
          semester_end?: string
          semester_start?: string
          updated_at?: string
        }
        Relationships: []
      }
      email_events: {
        Row: {
          committee_id: string
          created_at: string
          error_message: string | null
          id: string
          payload: Json
          recipient_id: string | null
          resend_message_id: string | null
          scheduled_for: string
          sent_at: string | null
          status: Database["public"]["Enums"]["email_event_status"]
          subject: string
          template: string
          to_email: string
        }
        Insert: {
          committee_id: string
          created_at?: string
          error_message?: string | null
          id?: string
          payload?: Json
          recipient_id?: string | null
          resend_message_id?: string | null
          scheduled_for?: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["email_event_status"]
          subject: string
          template: string
          to_email: string
        }
        Update: {
          committee_id?: string
          created_at?: string
          error_message?: string | null
          id?: string
          payload?: Json
          recipient_id?: string | null
          resend_message_id?: string | null
          scheduled_for?: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["email_event_status"]
          subject?: string
          template?: string
          to_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_events_committee_id_fkey"
            columns: ["committee_id"]
            isOneToOne: false
            referencedRelation: "committees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_events_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "member_semester_stats"
            referencedColumns: ["member_id"]
          },
          {
            foreignKeyName: "email_events_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hours_log: {
        Row: {
          id: string
          logged_at: string
          member_id: string
          minutes: number
          semester_key: string
          source_id: string
          source_type: Database["public"]["Enums"]["hours_source_type"]
        }
        Insert: {
          id?: string
          logged_at?: string
          member_id: string
          minutes: number
          semester_key: string
          source_id: string
          source_type: Database["public"]["Enums"]["hours_source_type"]
        }
        Update: {
          id?: string
          logged_at?: string
          member_id?: string
          minutes?: number
          semester_key?: string
          source_id?: string
          source_type?: Database["public"]["Enums"]["hours_source_type"]
        }
        Relationships: [
          {
            foreignKeyName: "hours_log_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "member_semester_stats"
            referencedColumns: ["member_id"]
          },
          {
            foreignKeyName: "hours_log_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      meeting_minutes: {
        Row: {
          action_items: string | null
          actions_synced_at: string | null
          attendees_present: string[]
          created_at: string
          created_by: string
          decisions: string | null
          id: string
          meeting_id: string
          published_at: string | null
          structured_minutes: Json
          summary: string
          updated_at: string
        }
        Insert: {
          action_items?: string | null
          actions_synced_at?: string | null
          attendees_present?: string[]
          created_at?: string
          created_by: string
          decisions?: string | null
          id?: string
          meeting_id: string
          published_at?: string | null
          structured_minutes?: Json
          summary: string
          updated_at?: string
        }
        Update: {
          action_items?: string | null
          actions_synced_at?: string | null
          attendees_present?: string[]
          created_at?: string
          created_by?: string
          decisions?: string | null
          id?: string
          meeting_id?: string
          published_at?: string | null
          structured_minutes?: Json
          summary?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meeting_minutes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "member_semester_stats"
            referencedColumns: ["member_id"]
          },
          {
            foreignKeyName: "meeting_minutes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meeting_minutes_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: true
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
        ]
      }
      meetings: {
        Row: {
          agenda_items: Json
          attendance_mode: Database["public"]["Enums"]["attendance_mode"]
          closed_at: string | null
          committee_id: string
          created_at: string
          created_by: string
          id: string
          linked_planning_item_ids: string[]
          location: string
          minutes_reminder_sent_at: string | null
          opened_at: string | null
          scheduled_at: string
          session_code_hash: string | null
          session_expires_at: string | null
          title: string
          updated_at: string
        }
        Insert: {
          agenda_items?: Json
          attendance_mode?: Database["public"]["Enums"]["attendance_mode"]
          closed_at?: string | null
          committee_id: string
          created_at?: string
          created_by: string
          id?: string
          linked_planning_item_ids?: string[]
          location: string
          minutes_reminder_sent_at?: string | null
          opened_at?: string | null
          scheduled_at: string
          session_code_hash?: string | null
          session_expires_at?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          agenda_items?: Json
          attendance_mode?: Database["public"]["Enums"]["attendance_mode"]
          closed_at?: string | null
          committee_id?: string
          created_at?: string
          created_by?: string
          id?: string
          linked_planning_item_ids?: string[]
          location?: string
          minutes_reminder_sent_at?: string | null
          opened_at?: string | null
          scheduled_at?: string
          session_code_hash?: string | null
          session_expires_at?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meetings_committee_id_fkey"
            columns: ["committee_id"]
            isOneToOne: false
            referencedRelation: "committees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meetings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "member_semester_stats"
            referencedColumns: ["member_id"]
          },
          {
            foreignKeyName: "meetings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string
          committee_id: string
          created_at: string
          href: string | null
          id: string
          read_at: string | null
          recipient_id: string
          title: string
          type: string
        }
        Insert: {
          body: string
          committee_id: string
          created_at?: string
          href?: string | null
          id?: string
          read_at?: string | null
          recipient_id: string
          title: string
          type: string
        }
        Update: {
          body?: string
          committee_id?: string
          created_at?: string
          href?: string | null
          id?: string
          read_at?: string | null
          recipient_id?: string
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_committee_id_fkey"
            columns: ["committee_id"]
            isOneToOne: false
            referencedRelation: "committees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "member_semester_stats"
            referencedColumns: ["member_id"]
          },
          {
            foreignKeyName: "notifications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      planning_item_members: {
        Row: {
          assigned_role: string | null
          created_at: string
          id: string
          member_id: string
          planning_item_id: string
        }
        Insert: {
          assigned_role?: string | null
          created_at?: string
          id?: string
          member_id: string
          planning_item_id: string
        }
        Update: {
          assigned_role?: string | null
          created_at?: string
          id?: string
          member_id?: string
          planning_item_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "planning_item_members_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "member_semester_stats"
            referencedColumns: ["member_id"]
          },
          {
            foreignKeyName: "planning_item_members_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planning_item_members_planning_item_id_fkey"
            columns: ["planning_item_id"]
            isOneToOne: false
            referencedRelation: "planning_items"
            referencedColumns: ["id"]
          },
        ]
      }
      planning_items: {
        Row: {
          category: string
          committee_id: string
          created_at: string
          created_by: string
          description: string
          evidence_required: boolean
          expected_minutes: number | null
          id: string
          location: string | null
          owner_id: string | null
          source_agenda_order: number | null
          source_meeting_id: string | null
          status: Database["public"]["Enums"]["planning_status"]
          synced_from_minutes_at: string | null
          target_date: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          committee_id: string
          created_at?: string
          created_by: string
          description: string
          evidence_required?: boolean
          expected_minutes?: number | null
          id?: string
          location?: string | null
          owner_id?: string | null
          source_agenda_order?: number | null
          source_meeting_id?: string | null
          status?: Database["public"]["Enums"]["planning_status"]
          synced_from_minutes_at?: string | null
          target_date?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          committee_id?: string
          created_at?: string
          created_by?: string
          description?: string
          evidence_required?: boolean
          expected_minutes?: number | null
          id?: string
          location?: string | null
          owner_id?: string | null
          source_agenda_order?: number | null
          source_meeting_id?: string | null
          status?: Database["public"]["Enums"]["planning_status"]
          synced_from_minutes_at?: string | null
          target_date?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "planning_items_committee_id_fkey"
            columns: ["committee_id"]
            isOneToOne: false
            referencedRelation: "committees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planning_items_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "member_semester_stats"
            referencedColumns: ["member_id"]
          },
          {
            foreignKeyName: "planning_items_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planning_items_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "member_semester_stats"
            referencedColumns: ["member_id"]
          },
          {
            foreignKeyName: "planning_items_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planning_items_source_meeting_id_fkey"
            columns: ["source_meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          committee_id: string
          created_at: string
          email: string
          full_name: string
          id: string
          joined_date: string
          location: string | null
          orientation_completed_at: string | null
          academy_quiz_passed_at: string | null
          academy_quiz_score: number | null
          phone: string | null
          preferred_positions: string[]
          program_type: string | null
          role: Database["public"]["Enums"]["committee_role"]
          target_hours: number | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          committee_id: string
          created_at?: string
          email: string
          full_name: string
          id: string
          joined_date: string
          location?: string | null
          orientation_completed_at?: string | null
          academy_quiz_passed_at?: string | null
          academy_quiz_score?: number | null
          phone?: string | null
          preferred_positions?: string[]
          program_type?: string | null
          role?: Database["public"]["Enums"]["committee_role"]
          target_hours?: number | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          committee_id?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          joined_date?: string
          location?: string | null
          orientation_completed_at?: string | null
          academy_quiz_passed_at?: string | null
          academy_quiz_score?: number | null
          phone?: string | null
          preferred_positions?: string[]
          program_type?: string | null
          role?: Database["public"]["Enums"]["committee_role"]
          target_hours?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_committee_id_fkey"
            columns: ["committee_id"]
            isOneToOne: false
            referencedRelation: "committees"
            referencedColumns: ["id"]
          },
        ]
      }
      internship_applications: {
        Row: {
          id: string
          committee_id: string
          full_name: string
          email: string
          phone: string | null
          school_program: string | null
          track: Database["public"]["Enums"]["internship_track"]
          availability: string | null
          motivation: string
          status: Database["public"]["Enums"]["intake_status"]
          admin_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          committee_id?: string
          full_name: string
          email: string
          phone?: string | null
          school_program?: string | null
          track?: Database["public"]["Enums"]["internship_track"]
          availability?: string | null
          motivation: string
          status?: Database["public"]["Enums"]["intake_status"]
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          committee_id?: string
          full_name?: string
          email?: string
          phone?: string | null
          school_program?: string | null
          track?: Database["public"]["Enums"]["internship_track"]
          availability?: string | null
          motivation?: string
          status?: Database["public"]["Enums"]["intake_status"]
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      outreach_opportunities: {
        Row: {
          id: string
          committee_id: string
          title: string
          summary: string
          location: string | null
          hours_estimate: number | null
          starts_on: string | null
          ends_on: string | null
          published: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          committee_id: string
          title: string
          summary: string
          location?: string | null
          hours_estimate?: number | null
          starts_on?: string | null
          ends_on?: string | null
          published?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          committee_id?: string
          title?: string
          summary?: string
          location?: string | null
          hours_estimate?: number | null
          starts_on?: string | null
          ends_on?: string | null
          published?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      outreach_signups: {
        Row: {
          id: string
          opportunity_id: string
          committee_id: string
          full_name: string
          email: string
          phone: string | null
          note: string | null
          status: Database["public"]["Enums"]["intake_status"]
          admin_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          opportunity_id: string
          committee_id: string
          full_name: string
          email: string
          phone?: string | null
          note?: string | null
          status?: Database["public"]["Enums"]["intake_status"]
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          opportunity_id?: string
          committee_id?: string
          full_name?: string
          email?: string
          phone?: string | null
          note?: string | null
          status?: Database["public"]["Enums"]["intake_status"]
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      committee_assets: {
        Row: {
          id: string
          committee_id: string
          title: string
          description: string | null
          category: Database["public"]["Enums"]["asset_category"]
          year_term: string | null
          tags: string[]
          storage_path: string
          mime_type: string | null
          file_size: number | null
          uploaded_by: string | null
          archived: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          committee_id: string
          title: string
          description?: string | null
          category?: Database["public"]["Enums"]["asset_category"]
          year_term?: string | null
          tags?: string[]
          storage_path: string
          mime_type?: string | null
          file_size?: number | null
          uploaded_by?: string | null
          archived?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          committee_id?: string
          title?: string
          description?: string | null
          category?: Database["public"]["Enums"]["asset_category"]
          year_term?: string | null
          tags?: string[]
          storage_path?: string
          mime_type?: string | null
          file_size?: number | null
          uploaded_by?: string | null
          archived?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      sc_webinars: {
        Row: {
          id: string
          committee_id: string
          title: string
          summary: string
          host_label: string | null
          starts_at: string
          ends_at: string | null
          timezone: string
          format: string
          join_url: string
          registration_url: string | null
          location: string | null
          audience: string | null
          contact_email: string | null
          published: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          committee_id: string
          title: string
          summary: string
          host_label?: string | null
          starts_at: string
          ends_at?: string | null
          timezone?: string
          format?: string
          join_url: string
          registration_url?: string | null
          location?: string | null
          audience?: string | null
          contact_email?: string | null
          published?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          committee_id?: string
          title?: string
          summary?: string
          host_label?: string | null
          starts_at?: string
          ends_at?: string | null
          timezone?: string
          format?: string
          join_url?: string
          registration_url?: string | null
          location?: string | null
          audience?: string | null
          contact_email?: string | null
          published?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      member_semester_stats: {
        Row: {
          attendance_rate: number | null
          committee_id: string | null
          full_name: string | null
          joined_date: string | null
          member_id: string | null
          member_status: string | null
          total_hours: number | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_committee_id_fkey"
            columns: ["committee_id"]
            isOneToOne: false
            referencedRelation: "committees"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      calculate_member_attendance_rate: {
        Args: { p_committee_id: string; p_member_id: string }
        Returns: number
      }
      current_user_committee_id: { Args: never; Returns: string }
      current_user_role: {
        Args: never
        Returns: Database["public"]["Enums"]["committee_role"]
      }
      is_committee_admin: { Args: never; Returns: boolean }
      refresh_hours_log_for_activity: {
        Args: { p_activity_id: string }
        Returns: undefined
      }
    }
    Enums: {
      activity_participation_type: "on_ground" | "virtual"
      activity_status: "pending" | "approved" | "rejected" | "needs_revision"
      attendance_mode: "button" | "code"
      attendance_status: "present" | "absent" | "excused"
      committee_role: "chair" | "secretary" | "member"
      email_event_status: "queued" | "sent" | "failed" | "cancelled"
      hours_source_type: "activity" | "attendance_bonus"
      log_lifecycle_status:
        | "draft"
        | "logged"
        | "exported"
        | "submitted_to_iou"
        | "iou_reviewed"
      planning_status:
        | "idea"
        | "planned"
        | "scheduled"
        | "active"
        | "completed"
        | "archived"
      intake_status: "new" | "contacted" | "accepted" | "declined"
      internship_track: "local_internship" | "volunteer"
      asset_category:
        | "branding"
        | "template"
        | "project"
        | "photo"
        | "report"
        | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      activity_participation_type: ["on_ground", "virtual"],
      activity_status: ["pending", "approved", "rejected", "needs_revision"],
      attendance_mode: ["button", "code"],
      attendance_status: ["present", "absent", "excused"],
      committee_role: ["chair", "secretary", "member"],
      email_event_status: ["queued", "sent", "failed", "cancelled"],
      hours_source_type: ["activity", "attendance_bonus"],
      log_lifecycle_status: [
        "draft",
        "logged",
        "exported",
        "submitted_to_iou",
        "iou_reviewed",
      ],
      planning_status: [
        "idea",
        "planned",
        "scheduled",
        "active",
        "completed",
        "archived",
      ],
    },
  },
} as const
