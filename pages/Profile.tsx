import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../services/dataService';
import { User, Camera, Save, Loader } from 'lucide-react';

export const Profile = () => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setAvatarUrl(user.avatar_url || '');
    }
  }, [user]);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      setMessage(null);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const publicUrl = await dataService.uploadImage(file, 'avatars');

      if (publicUrl) {
        setAvatarUrl(publicUrl);
        setMessage({ type: 'success', text: 'Image uploaded! Click Save to apply changes.' });
      } else {
        throw new Error('Upload failed');
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setSaving(true);
      setMessage(null);
      await dataService.updateProfile(user.id, {
        name,
        avatar_url: avatarUrl
      });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      // Reload page to reflect changes in auth context (or update context manually)
      setTimeout(() => window.location.reload(), 1000);
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  if (!user) return <div className="p-8 text-center">Please log in to view your profile.</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Profile Settings</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Manage your public profile and account details.</p>
        </div>
        
        <div className="px-4 py-5 sm:p-6">
          <form onSubmit={handleSave}>
            
            {/* Avatar Section */}
            <div className="mb-8 flex flex-col items-center">
              <div className="relative group">
                <div className="h-32 w-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-md">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-400">
                      <User className="h-16 w-16" />
                    </div>
                  )}
                </div>
                <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-blue-700 transition-colors">
                  {uploading ? <Loader className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                </label>
                <input 
                  id="avatar-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleAvatarUpload}
                  disabled={uploading}
                />
              </div>
              <p className="mt-3 text-sm text-gray-500">Click camera icon to upload new photo</p>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-500 sm:text-sm cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-gray-500">Email cannot be changed directly.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <div className="mt-1 flex items-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 uppercase">
                    {user.role}
                  </span>
                </div>
              </div>
            </div>

            {message && (
              <div className={`mt-4 p-3 rounded-md text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {message.text}
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={saving || uploading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="-ml-1 mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};