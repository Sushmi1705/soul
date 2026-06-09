import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { 
  PlusCircle, 
  LogOut, 
  FileText, 
  Layers, 
  Image as ImageIcon, 
  Compass, 
  BookOpen, 
  User,
  ArrowLeft,
  Calendar,
  Sparkles,
  List,
  Edit,
  Trash2
} from "lucide-react";

const CATEGORIES = [
  "Vedic Astrology",
  "Palmistry",
  "Vastu Consultation",
  "Numerology Analysis",
  "Tarot Reading",
  "Spiritual Healing",
  "Kundali Matching"
];

const AdminDashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("list"); // "list" or "create"
  
  // Form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [importingDocx, setImportingDocx] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");
  const adminUser = localStorage.getItem("adminUser") || "Admin";

  const apiUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:8005";

  useEffect(() => {
    if (!token) {
      toast.error("Please login to access the sanctum.");
      navigate("/admin/login");
      return;
    }
    fetchBlogs();
  }, [token, navigate]);

  const fetchBlogs = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/blogs`);
      if (response.ok) {
        const data = await response.json();
        setBlogs(data);
      } else {
        toast.error("Failed to retrieve cosmic blogs.");
      }
    } catch (error) {
      console.error("Fetch blogs error:", error);
      toast.error("Failed to connect to the blog registry.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    toast.success("Logged out successfully.");
    navigate("/admin/login");
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${apiUrl}/api/upload`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });
      const data = await response.json();
      if (response.ok) {
        setImage(data.url);
        toast.success("Local image uploaded successfully!");
      } else {
        toast.error(data.detail || "Failed to upload local image.");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Could not upload image due to connection failure.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDocxImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImportingDocx(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${apiUrl}/api/blogs/import-docx`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });
      const data = await response.json();
      if (response.ok) {
        setTitle(data.title || "");
        setContent(data.content || "");
        setExcerpt(data.excerpt || "");
        toast.success("Word Document parsed and loaded successfully!");
      } else {
        toast.error(data.detail || "Failed to parse Word Document.");
      }
    } catch (error) {
      console.error("Docx import error:", error);
      toast.error("Could not import Word Document due to connection failure.");
    } finally {
      setImportingDocx(false);
      e.target.value = "";
    }
  };

  const handleStartEdit = (blog) => {
    setTitle(blog.title || "");
    setCategory(blog.category || CATEGORIES[0]);
    setExcerpt(blog.excerpt || "");
    setContent(blog.content || "");
    setImage(blog.image || "");
    setEditingBlogId(blog.id);
    setActiveTab("create");
  };

  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm("Are you sure you want to return this blog post to the void? (Delete forever)")) {
      return;
    }
    
    try {
      const response = await fetch(`${apiUrl}/api/blogs/${blogId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (response.ok) {
        toast.success("Blog post deleted from the cosmos.");
        setBlogs(blogs.filter(b => b.id !== blogId));
      } else {
        toast.error(data.detail || "Failed to delete blog post.");
      }
    } catch (error) {
      console.error("Delete blog error:", error);
      toast.error("Could not delete post due to a connection failure.");
    }
  };

  const handleCreateBlog = async (e) => {
    e.preventDefault();
    if (!title || !excerpt || !content || !image) {
      toast.error("Please fill in all the divine fields.");
      return;
    }

    setSubmitting(true);
    try {
      const method = editingBlogId ? "PUT" : "POST";
      const endpoint = editingBlogId ? `${apiUrl}/api/blogs/${editingBlogId}` : `${apiUrl}/api/blogs`;
      
      const response = await fetch(endpoint, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          category,
          excerpt,
          content,
          image
        })
      });

      const data = await response.json();

      if (response.ok) {
        if (editingBlogId) {
          toast.success("Blog post updated and aligned!");
          setBlogs(blogs.map(b => b.id === editingBlogId ? data : b));
        } else {
          toast.success("New blog post written in the stars!");
          setBlogs([data, ...blogs]);
        }
        
        // Reset form
        setTitle("");
        setCategory(CATEGORIES[0]);
        setExcerpt("");
        setContent("");
        setImage("");
        setEditingBlogId(null);
        
        // Switch tab
        setActiveTab("list");
      } else {
        if (response.status === 401 || response.status === 403) {
          toast.error("Session expired. Please log in again.");
          handleLogout();
        } else {
          toast.error(data.detail || "Failed to submit blog post.");
        }
      }
    } catch (error) {
      console.error("Submit blog error:", error);
      toast.error("Could not write the post to the heavens (connection error).");
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) return null;

  return (
    <div className="min-h-screen bg-[#0d0905] text-[#E5E1D8] relative overflow-hidden pb-12">
      {/* Background Glow */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-[#B38B36]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-[#634a17]/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header Dashboard Nav */}
      <header className="relative z-10 border-b border-[#B38B36]/20 bg-black/40 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-[#B38B36]/15 border border-[#B38B36]/30 text-[#B38B36]">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold text-white tracking-wide flex items-center">
                Soul Admin Dashboard
              </h1>
              <p className="text-xs text-[#A89E8D] tracking-wide flex items-center">
                <User className="w-3 h-3 mr-1 text-[#B38B36]" /> Connected as <span className="text-white ml-1 font-semibold">{adminUser}</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 border border-[#B38B36]/20 hover:border-[#B38B36]/50 rounded-lg text-xs font-semibold uppercase tracking-wider text-[#A89E8D] hover:text-white transition-all flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Site</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-950/40 border border-red-900/30 hover:border-red-600/50 hover:bg-red-950/60 rounded-lg text-xs font-semibold uppercase tracking-wider text-red-200 transition-all flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-6 py-10 relative z-10">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-[#B38B36]/10 mb-8 gap-6">
          <button
            onClick={() => setActiveTab("list")}
            className={`pb-4 px-2 text-sm uppercase tracking-wider font-semibold transition-all relative flex items-center gap-2 ${
              activeTab === "list" ? "text-[#B38B36]" : "text-[#A89E8D] hover:text-white"
            }`}
          >
            <List className="w-4 h-4" />
            <span>Blog Registry ({blogs.length})</span>
            {activeTab === "list" && (
              <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B38B36]" />
            )}
          </button>
          <button
            onClick={() => {
              setActiveTab("create");
              setTitle("");
              setCategory(CATEGORIES[0]);
              setExcerpt("");
              setContent("");
              setImage("");
              setEditingBlogId(null);
            }}
            className={`pb-4 px-2 text-sm uppercase tracking-wider font-semibold transition-all relative flex items-center gap-2 ${
              activeTab === "create" ? "text-[#B38B36]" : "text-[#A89E8D] hover:text-white"
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Write New Post</span>
            {activeTab === "create" && (
              <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B38B36]" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "list" ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-[#A89E8D]">
                  <div className="border-4 border-[#B38B36] border-t-transparent w-10 h-10 rounded-full animate-spin mb-4"></div>
                  <p className="text-sm tracking-wider uppercase">Loading blog archives...</p>
                </div>
              ) : blogs.length === 0 ? (
                <div className="text-center py-20 bg-black/20 border border-[#B38B36]/10 rounded-2xl">
                  <FileText className="w-12 h-12 text-[#B38B36]/40 mx-auto mb-4" />
                  <p className="text-lg font-serif">The celestial archives are empty.</p>
                  <p className="text-sm text-[#A89E8D] mt-2">Write your first post to start sharing divine knowledge.</p>
                  <button
                    onClick={() => setActiveTab("create")}
                    className="mt-6 px-5 py-2.5 bg-[#B38B36] text-[#1c1206] font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-[#d0a74b] transition-all"
                  >
                    Write Blog Post
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {blogs.map((blog) => (
                    <motion.div
                      layout
                      key={blog.id}
                      className="bg-black/30 border border-[#B38B36]/20 rounded-xl overflow-hidden hover:border-[#B38B36]/50 transition-all group flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative h-48 overflow-hidden bg-black/40">
                          <img
                            src={blog.image}
                            alt={blog.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <span className="absolute bottom-3 left-3 px-2.5 py-1 text-[10px] uppercase font-bold tracking-widest bg-black/75 border border-[#B38B36]/30 text-[#B38B36] rounded-md">
                            {blog.category}
                          </span>
                        </div>
                        <div className="p-6">
                          <div className="flex items-center text-xs text-[#A89E8D] mb-3 gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{blog.date}</span>
                          </div>
                          <h3 className="font-serif text-lg font-bold text-white mb-2 leading-snug group-hover:text-[#B38B36] transition-colors line-clamp-2">
                            {blog.title}
                          </h3>
                          <p className="text-sm text-[#A89E8D]/80 line-clamp-3 leading-relaxed">
                            {blog.excerpt}
                          </p>
                        </div>
                      </div>
                      
                      {/* Card Actions */}
                      <div className="border-t border-[#B38B36]/15 px-6 py-4 flex items-center justify-between gap-4 bg-black/10">
                        <button
                          onClick={() => handleStartEdit(blog)}
                          className="flex items-center gap-1.5 px-3 py-1.5 border border-[#B38B36]/20 hover:border-[#B38B36]/50 rounded text-xs font-semibold text-[#B38B36] hover:bg-[#B38B36]/10 transition-all cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteBlog(blog.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 border border-red-900/30 rounded text-xs font-semibold text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="create"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="max-w-3xl mx-auto bg-black/20 border border-[#B38B36]/20 rounded-2xl p-8"
            >
              <h2 className="text-2xl font-serif font-bold text-white mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#B38B36]" /> {editingBlogId ? "Edit Cosmic Post" : "Write Divine Knowledge"}
              </h2>

              {/* Word Document Import Box */}
              <div className="mb-6 p-4 border border-[#B38B36]/30 bg-[#17120a]/40 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#B38B36]/10 text-[#B38B36]">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-white font-bold">Import from Word (.docx)</h4>
                    <p className="text-[11px] text-[#A89E8D] mt-0.5">Quickly pre-fill form fields by uploading a Word document.</p>
                  </div>
                </div>
                <div>
                  {importingDocx ? (
                    <div className="flex items-center gap-2 px-4 py-2 border border-[#B38B36]/20 bg-[#17120a]/60 rounded-lg">
                      <div className="border-2 border-[#B38B36] border-t-transparent w-4 h-4 rounded-full animate-spin"></div>
                      <span className="text-xs text-[#A89E8D]">Parsing...</span>
                    </div>
                  ) : (
                    <label className="px-4 py-2 border border-[#B38B36]/30 hover:border-[#B38B36] rounded-lg text-xs font-semibold uppercase tracking-wider text-[#B38B36] hover:text-white transition-all cursor-pointer inline-flex items-center gap-1.5">
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Choose .docx file</span>
                      <input
                        type="file"
                        accept=".docx"
                        onChange={handleDocxImport}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <form onSubmit={handleCreateBlog} className="space-y-6">
                
                {/* Title */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-[#A89E8D] block font-medium">
                    Post Title
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#B38B36]/70">
                      <FileText className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Navigating Saturn Retrograde"
                      className="w-full pl-10 pr-4 py-3 bg-[#17120a]/60 border border-[#B38B36]/20 rounded-xl text-white placeholder-[#786c5f] focus:outline-none focus:border-[#B38B36] transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Grid Category & Image */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Category */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-[#A89E8D] block font-medium">
                      Category
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#B38B36]/70">
                        <Layers className="w-4 h-4" />
                      </span>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-[#17120a]/60 border border-[#B38B36]/20 rounded-xl text-white focus:outline-none focus:border-[#B38B36] transition-all text-sm appearance-none cursor-pointer"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat} className="bg-[#1c140c] text-white">
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Local Image Upload */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-[#A89E8D] block font-medium">
                      Banner Image (Local)
                    </label>
                    <div className="relative flex flex-col items-center justify-center border border-dashed border-[#B38B36]/30 hover:border-[#B38B36]/60 bg-[#17120a]/60 rounded-xl p-3 transition-all min-h-[50px]">
                      {uploadingImage ? (
                        <div className="flex items-center justify-center space-x-2 py-1">
                          <div className="border-2 border-[#B38B36] border-t-transparent w-4 h-4 rounded-full animate-spin"></div>
                          <span className="text-xs text-[#A89E8D]">Uploading image...</span>
                        </div>
                      ) : image ? (
                        <div className="w-full flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <img src={image} alt="Preview" className="w-10 h-10 object-cover rounded-lg border border-[#B38B36]/30" />
                            <span className="text-xs text-white line-clamp-1 truncate max-w-[120px]">Uploaded successfully</span>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => setImage("")}
                            className="text-[10px] uppercase tracking-wider font-bold text-red-400 hover:text-red-300 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer py-1">
                          <div className="flex items-center gap-1.5 text-xs text-[#A89E8D] font-medium hover:text-[#B38B36] transition-all">
                            <ImageIcon className="w-4 h-4 text-[#B38B36]/70" />
                            <span>Choose Local Image File</span>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                {/* Excerpt */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-[#A89E8D] block font-medium">
                    Short Excerpt
                  </label>
                  <textarea
                    rows={2}
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Provide a brief summary of the blog post to draw readers in..."
                    className="w-full px-4 py-3 bg-[#17120a]/60 border border-[#B38B36]/20 rounded-xl text-white placeholder-[#786c5f] focus:outline-none focus:border-[#B38B36] transition-all text-sm resize-none"
                  />
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-[#A89E8D] block font-medium">
                    Full Content
                  </label>
                  <textarea
                    rows={8}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Speak your celestial wisdom..."
                    className="w-full px-4 py-3 bg-[#17120a]/60 border border-[#B38B36]/20 rounded-xl text-white placeholder-[#786c5f] focus:outline-none focus:border-[#B38B36] transition-all text-sm resize-y"
                  />
                </div>

                {/* Submit button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-gradient-to-r from-[#8e6b23] to-[#B38B36] hover:from-[#B38B36] hover:to-[#d0a74b] text-[#1c1206] font-bold tracking-wider uppercase rounded-xl transition-all shadow-[0_4px_20px_rgba(179,139,54,0.25)] flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
                >
                  {submitting ? (
                    <span className="border-2 border-[#1c1206] border-t-transparent w-5 h-5 rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <span>{editingBlogId ? "Update Post" : "Publish to Universe"}</span>
                      <Sparkles className="w-4 h-4" />
                    </>
                  )}
                </motion.button>

              </form>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
};

export default AdminDashboard;
