import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';
import { Clock, Eye } from 'lucide-react';

interface NewsCardProps {
  post: Post;
  featured?: boolean;
}

export const NewsCard: React.FC<NewsCardProps> = ({ post, featured = false }) => {
  return (
    <div className={`bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 flex flex-col h-full ${featured ? 'md:flex-row md:h-96' : ''}`}>
      <div className={`relative overflow-hidden ${featured ? 'md:w-2/3 h-64 md:h-full' : 'h-48'}`}>
        <img 
          src={post.image_url} 
          alt={post.title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-4 left-4">
           <span className="px-3 py-1 bg-primary/90 text-white text-xs font-bold uppercase tracking-wider rounded-full">
             {post.category}
           </span>
        </div>
      </div>
      <div className={`p-6 flex flex-col justify-between ${featured ? 'md:w-1/3' : ''}`}>
        <div>
          <div className="flex items-center text-gray-400 text-xs mb-3 space-x-3">
            <span className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {new Date(post.published_at).toLocaleDateString()}
            </span>
            <span className="flex items-center">
              <Eye className="w-3 h-3 mr-1" />
              {post.views}
            </span>
          </div>
          <Link to={`/post/${post.id}`}>
            <h3 className={`font-serif font-bold text-gray-900 mb-3 hover:text-primary transition-colors ${featured ? 'text-3xl' : 'text-xl'}`}>
              {post.title}
            </h3>
          </Link>
          <p className="text-gray-600 leading-relaxed text-sm line-clamp-3">
            {post.excerpt}
          </p>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
            <span className="text-xs font-medium text-gray-900">By {post.author}</span>
            <Link to={`/post/${post.id}`} className="text-primary text-sm font-semibold hover:underline">
              Read more &rarr;
            </Link>
        </div>
      </div>
    </div>
  );
};
