export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  is_suspended: boolean;
  avatar_url?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image_url: string;
  author: string;
  published_at: string;
  is_published: boolean;
  social_posted: {
    facebook: boolean;
    twitter: boolean;
  };
  views: number;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  user_name: string;
  content: string;
  status: 'approved' | 'pending' | 'flagged' | 'rejected';
  created_at: string;
}
