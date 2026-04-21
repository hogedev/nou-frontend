export interface Photo {
  id: number;
  object_key: string;
  thumb_key: string | null;
  original_filename: string | null;
  width: number | null;
  height: number | null;
  content_type: string | null;
  caption: string | null;
  created_at: string;
}

export interface Entry {
  id: number;
  text: string | null;
  entry_date: string;
  time_slot: "morning" | "afternoon" | null;
  photos: Photo[];
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  offset: number;
  limit: number;
}

export interface LoginResponse {
  access_token: string;
  username: string;
  is_admin: boolean;
}

export interface SiteSetting {
  key: string;
  value: string;
}

export interface AdminUser {
  id: number;
  username: string;
  is_admin: boolean;
  is_public: boolean;
}
