import { Icon } from '../components/icons/LucideIcons.jsx';
import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function CommunityPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Create Post Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('Crop Protection');
  const [submitting, setSubmitting] = useState(false);

  // Active replies state: { [postId]: { replies: [], open: boolean, input: '' } }
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [postReplies, setPostReplies] = useState({});
  const [replyInput, setReplyInput] = useState('');
  const [replySubmitting, setReplySubmitting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await api.getCommunityPosts();
      const list = res.posts || (Array.isArray(res) ? res : []);
      setPosts(list);
    } catch (err) {
      console.error('Failed to load community posts', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await api.likeCommunityPost(postId);
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          return { ...p, likes_count: (p.likes_count || 0) + 1 };
        }
        return p;
      }));
    } catch (err) {
      console.error('Like error', err);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    setSubmitting(true);
    try {
      const res = await api.createCommunityPost({
        title: newTitle,
        content: newContent,
        category: newCategory,
        district: user?.district || 'Tamil Nadu'
      });
      if (res.post || res.id) {
        setPosts(prev => [res.post || res, ...prev]);
        setIsCreateOpen(false);
        setNewTitle('');
        setNewContent('');
      }
    } catch (err) {
      alert('Error creating post: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleReplies = async (postId) => {
    if (expandedPostId === postId) {
      setExpandedPostId(null);
      return;
    }
    setExpandedPostId(postId);
    if (!postReplies[postId]) {
      try {
        const res = await api.getCommunityReplies(postId);
        setPostReplies(prev => ({
          ...prev,
          [postId]: res.replies || (Array.isArray(res) ? res : [])
        }));
      } catch (err) {
        console.error('Failed to fetch replies', err);
      }
    }
  };

  const handleAddReply = async (postId) => {
    if (!replyInput.trim()) return;
    setReplySubmitting(true);
    try {
      const res = await api.replyCommunityPost(postId, { content: replyInput });
      const newReply = res.reply || {
        id: 'rep_' + Date.now(),
        author_name: user?.full_name || 'Farmer',
        content: replyInput,
        created_at: new Date().toISOString()
      };
      setPostReplies(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newReply]
      }));
      setReplyInput('');
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, replies_count: (p.replies_count || 0) + 1 } : p));
    } catch (err) {
      alert('Reply failed: ' + err.message);
    } finally {
      setReplySubmitting(false);
    }
  };

  const categories = ['all', 'Crop Protection', 'Water Management', 'Organic Farming', 'Market Trends', 'General Farming'];

  const filteredPosts = posts.filter(p => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#003b1b] to-[#14532d] text-white p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-800/60 border border-emerald-600/40 text-emerald-200 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <Icon name="forum" className="text-sm" />
            Tamil Nadu Uzhavar Mandram & Knowledge Exchange
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Farmer Community & Agri Q&A
          </h1>
          <p className="text-emerald-100 text-sm mt-1 font-tamil">
            விவசாயிகள் கலந்துரையாடல், பயிர் ஆலோசனை மற்றும் அனுபவப் பகிர்வு மன்றம்
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-5 py-3 bg-amber-400 hover:bg-amber-500 text-stone-900 font-bold rounded-xl shadow-lg transition-transform transform hover:scale-105 flex items-center gap-2 text-sm whitespace-nowrap"
        >
          <Icon name="edit_square" className="" />
          Ask Question / பகிர்
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 space-y-3">
        <div className="relative w-full">
          <Icon name="search" className="absolute left-3 top-2.5 text-stone-400 text-sm" />
          <input
            type="text"
            placeholder="Search discussions, crop diseases, fertilizer queries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-[#14532d]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-stone-100">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === c
                  ? 'bg-[#14532d] text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {c === 'all' ? 'All Discussions' : c}
            </button>
          ))}
        </div>
      </div>

      {/* Discussions Feed */}
      {loading ? (
        <div className="p-12 text-center text-stone-500 flex flex-col items-center justify-center gap-3">
          <Icon name="progress_activity" className="animate-spin text-3xl text-[#14532d]" />
          <p className="text-sm font-medium">Loading farmer discussions...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                    {post.author_name ? post.author_name[0] : 'U'}
                  </div>
                  <div>
                    <div className="font-bold text-stone-900 text-sm flex items-center gap-2">
                      {post.author_name || 'Anonymous Farmer'}
                      {post.district && (
                        <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded font-normal">
                          {post.district}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-stone-400">
                      {post.created_at ? new Date(post.created_at).toLocaleDateString('en-IN') : 'Recently'}
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-stone-100 text-stone-700">
                  {post.category || 'General'}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-stone-900">{post.title}</h3>
                <p className="text-sm text-stone-600 mt-2 leading-relaxed whitespace-pre-line">{post.content}</p>
              </div>

              {/* Interactions Bar */}
              <div className="flex items-center justify-between pt-3 border-t border-stone-100 text-xs">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleLike(post.id)}
                    className="flex items-center gap-1.5 text-stone-600 hover:text-rose-600 transition-colors font-medium"
                  >
                    <Icon name="favorite" className="text-sm text-rose-500" />
                    <span>{post.likes_count || 0} Helpful</span>
                  </button>

                  <button
                    onClick={() => toggleReplies(post.id)}
                    className="flex items-center gap-1.5 text-stone-600 hover:text-[#14532d] transition-colors font-medium"
                  >
                    <Icon name="chat_bubble" className="text-sm" />
                    <span>{post.replies_count || (postReplies[post.id]?.length || 0)} Answers</span>
                  </button>
                </div>

                <button
                  onClick={() => toggleReplies(post.id)}
                  className="text-xs font-bold text-[#14532d] hover:underline"
                >
                  {expandedPostId === post.id ? 'Hide Replies' : 'Reply / View Answers'}
                </button>
              </div>

              {/* Expanded Replies Section */}
              {expandedPostId === post.id && (
                <div className="mt-4 pt-4 border-t border-stone-100 bg-stone-50/70 p-4 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Answers & Farmer Experiences:
                  </h4>

                  <div className="space-y-2">
                    {postReplies[post.id] && postReplies[post.id].length > 0 ? (
                      postReplies[post.id].map((rep, rIdx) => (
                        <div key={rIdx} className="bg-white p-3 rounded-lg border border-stone-200 text-xs space-y-1">
                          <div className="flex items-center justify-between text-stone-500 text-[11px]">
                            <span className="font-bold text-stone-800">{rep.author_name || 'Farmer'}</span>
                            <span>{new Date(rep.created_at).toLocaleDateString('en-IN')}</span>
                          </div>
                          <p className="text-stone-700">{rep.content}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-stone-400 italic">No answers yet. Share your experience below!</p>
                    )}
                  </div>

                  {/* Add reply input */}
                  <div className="flex gap-2 pt-2">
                    <input
                      type="text"
                      placeholder="Write your advice or answer..."
                      value={replyInput}
                      onChange={(e) => setReplyInput(e.target.value)}
                      className="flex-1 px-3 py-2 border border-stone-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-[#14532d]"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddReply(post.id)}
                    />
                    <button
                      onClick={() => handleAddReply(post.id)}
                      disabled={replySubmitting}
                      className="px-4 py-2 bg-[#14532d] text-white font-semibold rounded-lg text-xs hover:bg-[#003b1b] transition-colors disabled:opacity-50"
                    >
                      Answer
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create Post Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <h3 className="font-bold text-stone-900 text-lg">Ask Farmer Community</h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-stone-400 hover:text-stone-600">
                <Icon name="close" className="" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Title / கேள்வி தலைப்பு *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Best organic spray for yellow vein mosaic in bhendi?"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Topic Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white"
                >
                  <option value="Crop Protection">Crop Protection (பூச்சி & நோய்)</option>
                  <option value="Water Management">Water & Drip Management (நீர் பாசனம்)</option>
                  <option value="Organic Farming">Organic & Natural Farming (இயற்கை விவசாயம்)</option>
                  <option value="Market Trends">Market Trends & Rates (சந்தை நிலவரம்)</option>
                  <option value="General Farming">General Agri Discussion (பொது விவாதம்)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Details / விளக்கமான விவரங்கள் *</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Describe your soil, crop age, and what treatments you have tried so far..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-[#14532d] hover:bg-[#003b1b] text-white rounded-xl text-xs font-semibold transition-all shadow disabled:opacity-50"
                >
                  {submitting ? 'Publishing...' : 'Publish to Forum'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
