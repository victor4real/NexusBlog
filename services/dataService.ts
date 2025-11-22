import { MOCK_POSTS, MOCK_COMMENTS, MOCK_USERS } from '../constants';
import { Post, Comment, User, UserRole } from '../types';

// In a real app, these would be async calls to Supabase
// e.g., await supabase.from('posts').select('*')...

class DataService {
  private posts: Post[] = [...MOCK_POSTS];
  private comments: Comment[] = [...MOCK_COMMENTS];
  private users: User[] = [...MOCK_USERS];

  // --- Posts ---
  async getPosts(publishedOnly = true): Promise<Post[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    if (publishedOnly) {
      return this.posts.filter(p => p.is_published);
    }
    return this.posts;
  }

  async getPostById(id: string): Promise<Post | undefined> {
    return this.posts.find(p => p.id === id);
  }

  async togglePublishStatus(id: string): Promise<Post | undefined> {
    const post = this.posts.find(p => p.id === id);
    if (post) {
      post.is_published = !post.is_published;
    }
    return post;
  }

  async publishToSocial(id: string, platform: 'facebook' | 'twitter'): Promise<void> {
     await new Promise(resolve => setTimeout(resolve, 800)); // Network delay
     const post = this.posts.find(p => p.id === id);
     if(post) {
        post.social_posted[platform] = true;
     }
  }

  // --- Comments ---
  async getCommentsForPost(postId: string): Promise<Comment[]> {
    return this.comments.filter(c => c.post_id === postId && c.status === 'approved');
  }

  async getAllComments(): Promise<Comment[]> {
    // For admin
    return this.comments;
  }

  async addComment(comment: Comment): Promise<Comment> {
    this.comments.push(comment);
    return comment;
  }

  async updateCommentStatus(id: string, status: Comment['status']): Promise<void> {
    const comment = this.comments.find(c => c.id === id);
    if (comment) {
      comment.status = status;
    }
  }

  // --- Users ---
  async getAllUsers(): Promise<User[]> {
    return this.users;
  }

  async toggleUserSuspension(id: string): Promise<void> {
    const user = this.users.find(u => u.id === id);
    if (user) {
      user.is_suspended = !user.is_suspended;
    }
  }

  async updateUserRole(id: string, role: UserRole): Promise<void> {
    const user = this.users.find(u => u.id === id);
    if (user) {
      user.role = role;
    }
  }
}

export const dataService = new DataService();
