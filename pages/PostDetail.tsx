import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Post, Comment } from '../types';
import { dataService } from '../services/dataService';
import { AdSlot } from '../components/AdSlot';
import { useAuth } from '../context/AuthContext';
import { Facebook, Twitter, Link2, Clock, User as UserIcon } from 'lucide-react';

export const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        const p = await dataService.getPostById(id);
        const c = await dataService.getCommentsForPost(id);
        if (p) setPost(p);
        setComments(c);
        setLoading(false);
      };
      fetchData();
    }
  }, [id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id || !newComment.trim()) return;

    const commentData: Comment = {
      id: Date.now().toString(),
      post_id: id,
      user_id: user.id,
      user_name: user.name,
      content: newComment,
      status: 'pending', // Default status
      created_at: new Date().toISOString()
    };

    await dataService.addComment(commentData);
    setNewComment('');
    alert("Comment submitted for moderation.");
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!post) return <div className="p-10 text-center">Post not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-primary">Home</Link> / 
        <Link to="#" className="hover:text-primary mx-1">{post.category}</Link> / 
        <span className="text-gray-800 ml-1 truncate">{post.title}</span>
      </div>

      {/* Header */}
      <h1 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-6 leading-tight">
        {post.title}
      </h1>

      <div className="flex items-center justify-between border-b border-gray-100 pb-6 mb-8">
        <div className="flex items-center space-x-4">
           <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
             <UserIcon className="w-6 h-6 text-gray-500" />
           </div>
           <div>
             <p className="text-sm font-bold text-gray-900">{post.author}</p>
             <p className="text-xs text-gray-500 flex items-center">
               <Clock className="w-3 h-3 mr-1" />
               {new Date(post.published_at).toDateString()}
             </p>
           </div>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100"><Facebook className="w-4 h-4" /></button>
          <button className="p-2 rounded-full bg-sky-50 text-sky-500 hover:bg-sky-100"><Twitter className="w-4 h-4" /></button>
          <button className="p-2 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100"><Link2 className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Main Image */}
      <img src={post.image_url} alt={post.title} className="w-full h-auto rounded-xl mb-8 shadow-sm" />

      {/* Content */}
      <article className="prose prose-lg prose-blue max-w-none mb-10 text-gray-800">
        <p className="font-medium text-xl text-gray-600 mb-6">{post.excerpt}</p>
        <p>{post.content}</p>
        {/* Placeholders for more text since mock data is short */}
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        
        <div className="my-8">
          <AdSlot format="horizontal" />
        </div>

        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      </article>

      {/* Comment Section */}
      <div className="bg-gray-50 rounded-xl p-6 md:p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Comments ({comments.length})</h3>
        
        <div className="space-y-6 mb-8">
          {comments.map(comment => (
            <div key={comment.id} className="flex space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">
                  {comment.user_name.charAt(0)}
                </div>
              </div>
              <div className="flex-grow">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-sm text-gray-900">{comment.user_name}</span>
                    <span className="text-xs text-gray-400">{new Date(comment.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-700 text-sm">{comment.content}</p>
                </div>
              </div>
            </div>
          ))}
          {comments.length === 0 && <p className="text-gray-500 italic text-sm">No comments yet. Be the first to share your thoughts!</p>}
        </div>

        {isAuthenticated ? (
          <form onSubmit={handleCommentSubmit}>
            <div className="mb-4">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">Leave a comment</label>
              <textarea
                id="comment"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                placeholder="What are your thoughts?"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              ></textarea>
            </div>
            <button type="submit" className="px-6 py-2 bg-primary text-white rounded-md font-medium hover:bg-blue-700 transition-colors">
              Post Comment
            </button>
          </form>
        ) : (
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-md text-center">
            <p className="text-blue-800 text-sm">Please <Link to="/login" className="font-bold underline">log in</Link> to join the discussion.</p>
          </div>
        )}
      </div>
    </div>
  );
};
