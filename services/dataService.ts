
import { MOCK_POSTS, MOCK_COMMENTS, MOCK_USERS } from '../constants';
import { Post, Comment, User, UserRole } from '../types';
import { supabase } from '../lib/supabaseClient';

// Helper to detect if Supabase is actually configured
const isSupabaseConfigured = () => {
  try {
    // @ts-ignore
    const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
    const url = envUrl || supabase.supabaseUrl;
    // Check if it's the placeholder or a real URL
    return url && url !== 'https://your-project-id.supabase.co';
  } catch (e) {
    // If accessing import.meta throws, fallback to checking the client directly
    return !!supabase.supabaseUrl && supabase.supabaseUrl !== 'https://your-project-id.supabase.co';
  }
};

class DataService {
  // In-memory fallbacks
  private posts: Post[] = [...MOCK_POSTS];
  private comments: Comment[] = [...MOCK_COMMENTS];
  private users: User[] = [...MOCK_USERS];

  // --- Storage ---
  async uploadImage(file: File, bucket: 'avatars' | 'post-images'): Promise<string | null> {
    if (isSupabaseConfigured()) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file);

        if (uploadError) {
          console.error('Upload Error:', uploadError);
          throw uploadError;
        }

        const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
        return data.publicUrl;
      } catch (error) {
        console.error('Failed to upload image:', error);
        return null;
      }
    }

    // Mock upload
    console.log(`[Mock] Uploading ${file.name} to ${bucket}`);
    return URL.createObjectURL(file);
  }

  // --- Posts ---
  async getPosts(publishedOnly = true): Promise<Post[]> {
    if (isSupabaseConfigured()) {
      let query = supabase.from('posts').select('*').order('published_at', { ascending: false });
      
      if (publishedOnly) {
        query = query.eq('is_published', true);
      }
      
      const { data, error } = await query;
      if (!error && data) return data as Post[];
    }

    // Fallback
    await new Promise(resolve => setTimeout(resolve, 300));
    if (publishedOnly) {
      return this.posts.filter(p => p.is_published);
    }
    return this.posts;
  }

  async getPostById(id: string): Promise<Post | undefined> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.from('posts').select('*').eq('id', id).single();
      if (!error && data) return data as Post;
    }

    return this.posts.find(p => p.id === id);
  }

  async togglePublishStatus(id: string): Promise<Post | undefined> {
    if (isSupabaseConfigured()) {
      // First get current status
      const { data: current } = await supabase.from('posts').select('is_published').eq('id', id).single();
      if (current) {
        const { data, error } = await supabase
          .from('posts')
          .update({ is_published: !current.is_published })
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data as Post;
      }
    }

    const post = this.posts.find(p => p.id === id);
    if (post) {
      post.is_published = !post.is_published;
    }
    return post;
  }

  async createPost(postData: Omit<Post, 'id' | 'views' | 'social_posted'>): Promise<Post> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('posts')
        .insert([{
          ...postData,
          views: 0,
          social_posted: { facebook: false, twitter: false }
        }])
        .select()
        .single();
      
      if (error) {
        console.error("Supabase Create Post Error:", error);
        throw new Error(error.message);
      }
      if (data) return data as Post;
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    const newPost: Post = {
      id: Date.now().toString(),
      views: 0,
      social_posted: { facebook: false, twitter: false },
      ...postData
    };
    this.posts.unshift(newPost);
    return newPost;
  }

  async publishToSocial(id: string, platform: 'facebook' | 'twitter'): Promise<void> {
    if (isSupabaseConfigured()) {
      const { data: post } = await supabase.from('posts').select('social_posted').eq('id', id).single();
      if (post) {
        const updatedSocial = { ...post.social_posted, [platform]: true };
        await supabase.from('posts').update({ social_posted: updatedSocial }).eq('id', id);
      }
      return;
    }

     await new Promise(resolve => setTimeout(resolve, 800));
     const post = this.posts.find(p => p.id === id);
     if(post) {
        post.social_posted[platform] = true;
     }
  }

  // --- Comments ---
  async getCommentsForPost(postId: string): Promise<Comment[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });
      if (!error && data) return data as Comment[];
    }

    return this.comments.filter(c => c.post_id === postId && c.status === 'approved');
  }

  async getAllComments(): Promise<Comment[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.from('comments').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as Comment[];
    }
    return this.comments;
  }

  async addComment(comment: Comment): Promise<Comment> {
    if (isSupabaseConfigured()) {
      // Remove ID to let DB generate it
      const { id, ...payload } = comment; 
      const { data, error } = await supabase
        .from('comments')
        .insert([payload])
        .select()
        .single();
      if (!error && data) return data as Comment;
    }

    this.comments.push(comment);
    return comment;
  }

  async updateCommentStatus(id: string, status: Comment['status']): Promise<void> {
    if (isSupabaseConfigured()) {
      await supabase.from('comments').update({ status }).eq('id', id);
      return;
    }

    const comment = this.comments.find(c => c.id === id);
    if (comment) {
      comment.status = status;
    }
  }

  // --- Users ---
  async getAllUsers(): Promise<User[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.from('profiles').select('*');
      if (!error && data) return data as unknown as User[];
    }

    return this.users;
  }

  async updateProfile(id: string, updates: Partial<User>): Promise<void> {
     if (isSupabaseConfigured()) {
        const { error } = await supabase.from('profiles').update(updates).eq('id', id);
        if (error) throw error;
        return;
     }
     const user = this.users.find(u => u.id === id);
     if (user) {
        Object.assign(user, updates);
     }
  }

  async toggleUserSuspension(id: string): Promise<void> {
    if (isSupabaseConfigured()) {
       const { data: user } = await supabase.from('profiles').select('is_suspended').eq('id', id).single();
       if (user) {
         await supabase.from('profiles').update({ is_suspended: !user.is_suspended }).eq('id', id);
       }
       return;
    }

    const user = this.users.find(u => u.id === id);
    if (user) {
      user.is_suspended = !user.is_suspended;
    }
  }

  async updateUserRole(id: string, role: UserRole): Promise<void> {
    if (isSupabaseConfigured()) {
      await supabase.from('profiles').update({ role }).eq('id', id);
      return;
    }

    const user = this.users.find(u => u.id === id);
    if (user) {
      user.role = role;
    }
  }

  async deleteUser(id: string): Promise<void> {
    if (isSupabaseConfigured()) {
       // Manual cascade for safety, though DB should handle it if configured
       await supabase.from('comments').delete().eq('user_id', id);
       const { error } = await supabase.from('profiles').delete().eq('id', id);
       if (error) throw error;
       return;
    }
    this.users = this.users.filter(u => u.id !== id);
  }
}

export const dataService = new DataService();
