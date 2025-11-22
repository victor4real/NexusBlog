import { User, Post, Comment, UserRole } from './types';

// Mock Users
export const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'admin@nexus.com',
    name: 'Admin User',
    role: UserRole.ADMIN,
    is_suspended: false,
    avatar_url: 'https://picsum.photos/id/64/100/100'
  },
  {
    id: '2',
    email: 'reader@nexus.com',
    name: 'Jane Reader',
    role: UserRole.USER,
    is_suspended: false,
    avatar_url: 'https://picsum.photos/id/65/100/100'
  },
  {
    id: '3',
    email: 'troll@nexus.com',
    name: 'Troll User',
    role: UserRole.USER,
    is_suspended: true,
    avatar_url: 'https://picsum.photos/id/66/100/100'
  }
];

// Mock Posts
export const MOCK_POSTS: Post[] = [
  {
    id: '101',
    title: 'The Future of AI in Journalism',
    excerpt: 'How artificial intelligence is reshaping the way we consume and create news content in 2024.',
    content: 'Artificial intelligence is no longer just a buzzword; it is a fundamental shift in how news is gathered, processed, and delivered. From automated summary generation to real-time fact-checking, AI tools are empowering journalists to cover more ground. However, this technological leap brings ethical questions regarding bias and the potential for deepfakes...',
    category: 'Technology',
    image_url: 'https://picsum.photos/id/1/800/400',
    author: 'Sarah Tech',
    published_at: new Date(Date.now() - 86400000).toISOString(),
    is_published: true,
    social_posted: { facebook: true, twitter: false },
    views: 1205
  },
  {
    id: '102',
    title: 'Global Markets Rally Amid Tech Boom',
    excerpt: 'Stock markets across Asia and Europe see significant gains as tech sector reports record profits.',
    content: 'The global economy showed strong signs of resilience this week as major indices hit new highs. The rally was primarily driven by the semiconductor industry, which continues to see unprecedented demand. Analysts suggest that this trend is likely to continue through Q4...',
    category: 'Business',
    image_url: 'https://picsum.photos/id/20/800/400',
    author: 'John Dow',
    published_at: new Date(Date.now() - 172800000).toISOString(),
    is_published: true,
    social_posted: { facebook: true, twitter: true },
    views: 850
  },
  {
    id: '103',
    title: 'Sustainable Living: Top Tips for 2024',
    excerpt: 'Simple changes you can make in your daily routine to reduce your carbon footprint.',
    content: 'Sustainability starts at home. By reducing plastic waste, composting organic matter, and choosing energy-efficient appliances, individuals can make a measurable impact. In this guide, we explore ten actionable steps...',
    category: 'Lifestyle',
    image_url: 'https://picsum.photos/id/28/800/400',
    author: 'Eco Warrior',
    published_at: new Date().toISOString(),
    is_published: true,
    social_posted: { facebook: false, twitter: false },
    views: 340
  },
  {
    id: '104',
    title: 'Draft Article: The Mars Mission',
    excerpt: 'An exclusive look into the preparation for the next manned mission to Mars.',
    content: 'This is a draft content that is not yet visible to the public...',
    category: 'Science',
    image_url: 'https://picsum.photos/id/45/800/400',
    author: 'Admin User',
    published_at: new Date().toISOString(),
    is_published: false,
    social_posted: { facebook: false, twitter: false },
    views: 0
  }
];

// Mock Comments
export const MOCK_COMMENTS: Comment[] = [
  {
    id: 'c1',
    post_id: '101',
    user_id: '2',
    user_name: 'Jane Reader',
    content: 'This is a fascinating read. I worry about job displacement though.',
    status: 'approved',
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'c2',
    post_id: '101',
    user_id: '3',
    user_name: 'Troll User',
    content: 'AI is a scam! Fake news!',
    status: 'flagged',
    created_at: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 'c3',
    post_id: '102',
    user_id: '2',
    user_name: 'Jane Reader',
    content: 'Great market analysis.',
    status: 'pending',
    created_at: new Date(Date.now() - 1800000).toISOString()
  }
];

export const CATEGORIES = [
  { id: '1', name: 'Technology', slug: 'technology' },
  { id: '2', name: 'Business', slug: 'business' },
  { id: '3', name: 'Science', slug: 'science' },
  { id: '4', name: 'Lifestyle', slug: 'lifestyle' },
  { id: '5', name: 'World', slug: 'world' },
];
