import React, { useEffect, useState } from 'react';
import { NewsCard } from '../components/NewsCard';
import { AdSlot } from '../components/AdSlot';
import { dataService } from '../services/dataService';
import { Post } from '../types';
import { TrendingUp, ArrowRight } from 'lucide-react';

export const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await dataService.getPosts(true); // Only published
      setPosts(data);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const featuredPost = posts[0];
  const recentPosts = posts.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Ad Slot */}
      <div className="mb-8">
        <AdSlot format="horizontal" />
      </div>

      {/* Hero Section */}
      {featuredPost && (
        <section className="mb-12">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-bold uppercase tracking-wider text-gray-800">Trending Now</h2>
          </div>
          <NewsCard post={featuredPost} featured={true} />
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
            Latest Stories
          </h2>
          <div className="grid gap-8">
            {recentPosts.map(post => (
              <NewsCard key={post.id} post={post} />
            ))}
            {recentPosts.length === 0 && (
              <p className="text-gray-500">No recent stories found.</p>
            )}
          </div>
          
          <div className="mt-10 flex justify-center">
            <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
              Load More Articles
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
          
          {/* Sidebar Ad */}
          <AdSlot format="rectangle" />

          {/* Newsletter */}
          <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
            <h3 className="font-bold text-lg text-gray-900 mb-2">Subscribe to NexusNews</h3>
            <p className="text-sm text-gray-600 mb-4">Get the latest headlines delivered to your inbox daily.</p>
            <div className="space-y-2">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button className="w-full bg-gray-900 text-white py-2 rounded-md text-sm font-medium hover:bg-black transition-colors">
                Subscribe
              </button>
            </div>
          </div>

          {/* Categories Widget */}
          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-4">Categories</h3>
            <ul className="space-y-2">
              {['Technology', 'Business', 'Politics', 'Science', 'Health'].map(cat => (
                <li key={cat}>
                  <a href="#" className="flex items-center justify-between group">
                    <span className="text-gray-600 group-hover:text-primary transition-colors">{cat}</span>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </aside>
      </div>
    </div>
  );
};
