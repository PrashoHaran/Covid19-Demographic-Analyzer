import { useState, useEffect } from 'react';
import { 
  User, Mail, Calendar, MapPin, Shield, CreditCard, 
  Settings, Bell, Lock, Database, BarChart3, Activity, 
  Award, TrendingUp, Globe, Edit2, Camera, Check,
  Upload, Download, Eye, EyeOff
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getData } from '@/context/userContext';
import axios from 'axios';
import { toast } from 'sonner';

const ProfilePage = () => {
  const { user, setUser } = getData();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    analyses: 48,
    datasets: 12,
    visualizations: 26,
    accuracy: 94.5
  });
  const [showPassword, setShowPassword] = useState(false);
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    location: user?.location || 'New York, USA',
    bio: user?.bio || 'Data Analyst specializing in COVID-19 demographic patterns and predictive modeling.',
    company: user?.company || 'Health Analytics Inc.',
    role: user?.role || 'Senior Data Scientist',
    joinDate: user?.joinDate || '2023-03-15'
  });

  const userStats = [
    { label: 'Analyses Completed', value: stats.analyses, icon: <BarChart3 className="w-4 h-4" />, color: 'from-blue-500 to-cyan-400' },
    { label: 'Datasets Used', value: stats.datasets, icon: <Database className="w-4 h-4" />, color: 'from-emerald-500 to-teal-400' },
    { label: 'Visualizations', value: stats.visualizations, icon: <Activity className="w-4 h-4" />, color: 'from-purple-500 to-pink-400' },
    { label: 'Model Accuracy', value: `${stats.accuracy}%`, icon: <TrendingUp className="w-4 h-4" />, color: 'from-orange-500 to-red-400' }
  ];

  const recentActivities = [
    { action: 'Uploaded new dataset', time: '2 hours ago', type: 'upload' },
    { action: 'Created comparison analysis', time: 'Yesterday', type: 'analysis' },
    { action: 'Shared visualization', time: '2 days ago', type: 'share' },
    { action: 'Updated prediction model', time: '1 week ago', type: 'update' },
    { action: 'Completed training module', time: '2 weeks ago', type: 'training' }
  ];

  const subscriptionPlans = [
    { name: 'Basic', price: 0, features: ['5 analyses/month', 'Basic datasets', 'Standard support'], current: false },
    { name: 'Pro', price: 29, features: ['Unlimited analyses', 'All datasets', 'Priority support', 'Advanced models'], current: true },
    { name: 'Enterprise', price: 99, features: ['Everything in Pro', 'Custom datasets', 'Dedicated support', 'API access'], current: false }
  ];

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const res = await axios.put('http://localhost:8000/user/profile', profileData, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      if (res.data.success) {
        setUser(res.data.user);
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      }
    } catch (error) {
      toast.error('Failed to update profile');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setLoading(true);
    const formData = new FormData();
    formData.append('avatar', file);
    
    try {
      const accessToken = localStorage.getItem("accessToken");
      const res = await axios.post('http://localhost:8000/user/avatar', formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (res.data.success) {
        setUser(res.data.user);
        toast.success('Profile picture updated!');
      }
    } catch (error) {
      toast.error('Failed to upload avatar');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account and preferences</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-8">
                {/* Avatar Section */}
                <div className="relative group">
                  <Avatar className="w-32 h-32 ring-4 ring-white ring-offset-4 ring-offset-emerald-50 shadow-lg">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-400 text-white text-3xl">
                      {user.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <label className="absolute bottom-0 right-0 bg-emerald-500 p-3 rounded-full cursor-pointer hover:bg-emerald-600 transition-colors shadow-lg group">
                    <Camera className="w-5 h-5 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
                  </label>
                  
                  <div className="absolute -inset-4 bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.username}
                        onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                        className="text-3xl font-bold bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 w-full"
                      />
                    ) : (
                      <h2 className="text-3xl font-bold text-gray-900">{user.username}</h2>
                    )}
                    <button
                      onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                      disabled={loading}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-400 text-white rounded-lg hover:shadow-lg transition-all"
                    >
                      {isEditing ? (
                        loading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            Save Changes
                          </>
                        )
                      ) : (
                        <>
                          <Edit2 className="w-4 h-4" />
                          Edit Profile
                        </>
                      )}
                    </button>
                  </div>

                  {isEditing ? (
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 mb-4"
                      rows="2"
                    />
                  ) : (
                    <p className="text-gray-600 mb-6">{profileData.bio}</p>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 text-gray-700">
                      <Mail className="w-5 h-5 text-emerald-500" />
                      <span className="font-medium">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <MapPin className="w-5 h-5 text-emerald-500" />
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileData.location}
                          onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                          className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1"
                        />
                      ) : (
                        <span className="font-medium">{profileData.location}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <Calendar className="w-5 h-5 text-emerald-500" />
                      <span className="font-medium">Joined {new Date(profileData.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <Shield className="w-5 h-5 text-emerald-500" />
                      <span className="font-medium bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">
                        Pro Plan
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {userStats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
                    <div className="text-white">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
                <button className="text-emerald-600 hover:text-emerald-700 font-medium">
                  View All
                </button>
              </div>
              
              <div className="space-y-6">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === 'upload' ? 'bg-blue-50 text-blue-600' :
                      activity.type === 'analysis' ? 'bg-emerald-50 text-emerald-600' :
                      activity.type === 'share' ? 'bg-purple-50 text-purple-600' :
                      'bg-orange-50 text-orange-600'
                    }`}>
                      {activity.type === 'upload' ? <Upload className="w-5 h-5" /> :
                       activity.type === 'analysis' ? <BarChart3 className="w-5 h-5" /> :
                       activity.type === 'share' ? <Globe className="w-5 h-5" /> :
                       <Award className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Settings & Subscription */}
          <div className="space-y-8">
          

            {/* Security Settings */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Security</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Change Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="New password"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Two-Factor Authentication
                  </label>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Add extra security to your account</span>
                    <button className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg font-medium hover:bg-emerald-100 transition-colors">
                      Enable
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
              
              <div className="space-y-4">
                <button className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Download className="w-5 h-5 text-gray-600" />
                    <span className="font-medium">Export Data</span>
                  </div>
                  <div className="text-gray-400">→</div>
                </button>
                
                <button className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5 text-gray-600" />
                    <span className="font-medium">Account Settings</span>
                  </div>
                  <div className="text-gray-400">→</div>
                </button>
                
                <button className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-gray-600" />
                    <span className="font-medium">Notification Preferences</span>
                  </div>
                  <div className="text-gray-400">→</div>
                </button>
                
                <button className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-red-600 hover:text-red-700">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5" />
                    <span className="font-medium">Delete Account</span>
                  </div>
                  <div className="text-gray-400">→</div>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;