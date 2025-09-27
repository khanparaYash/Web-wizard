import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Plus, Edit, Trash2, Search, Filter, BookOpen, Star, Calendar } from "lucide-react";
import toast from "react-hot-toast";

export default function BookManagement() {
  const { token } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    totalCopies: 1,
    coverUrl: ""
  });

  useEffect(() => {
    fetchBooks();
  }, [token]);

  const fetchBooks = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (category) params.append("category", category);
      
      const res = await axios.get(`http://localhost:4000/books?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks(res.data);
    } catch (err) {
      console.error("Failed to fetch books", err);
      toast.error("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBook) {
        await axios.put(`http://localhost:4000/books/${editingBook._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Book updated successfully");
      } else {
        await axios.post("http://localhost:4000/books", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Book added successfully");
      }
      
      setShowAddForm(false);
      setEditingBook(null);
      setFormData({ title: "", author: "", category: "", totalCopies: 1, coverUrl: "" });
      fetchBooks();
    } catch (err) {
      toast.error("Failed to save book");
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      category: book.category,
      totalCopies: book.totalCopies,
      coverUrl: book.coverUrl || ""
    });
    setShowAddForm(true);
  };

  const handleDelete = async (bookId) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    
    try {
      await axios.delete(`http://localhost:4000/books/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Book deleted successfully");
      fetchBooks();
    } catch (err) {
      toast.error("Failed to delete book");
    }
  };

  const categories = [...new Set(books.map(book => book.category).filter(Boolean))];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-80 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-lg">📚</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Book Management</h1>
          </div>
          <p className="text-gray-300">Manage your library's book collection</p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(true);
            setEditingBook(null);
            setFormData({ title: "", author: "", category: "", totalCopies: 1, coverUrl: "" });
          }}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Book
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-xl">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search books..."
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              className="pl-10 pr-8 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none min-w-[150px]"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <button
            onClick={fetchBooks}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Search
          </button>
        </div>
        
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          {books.length} books found
        </div>
      </div>

      {/* Add/Edit Book Form */}
      {showAddForm && (
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-xl">
          <h2 className="text-xl font-bold mb-4 text-white">
            {editingBook ? "Edit Book" : "Add New Book"}
          </h2>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Author *
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category *
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Total Copies *
              </label>
              <input
                type="number"
                min="1"
                required
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                value={formData.totalCopies}
                onChange={(e) => setFormData({ ...formData, totalCopies: parseInt(e.target.value) })}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Cover URL (Optional)
              </label>
              <input
                type="url"
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                value={formData.coverUrl}
                onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
              />
            </div>

            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all duration-300"
              >
                {editingBook ? "Update Book" : "Add Book"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingBook(null);
                }}
                className="bg-white/10 text-white px-6 py-2 rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              No books found
            </h3>
            <p className="text-gray-400">
              {search || category ? "Try adjusting your search criteria" : "Add your first book to get started"}
            </p>
          </div>
        ) : (
          books.map((book) => (
            <div
              key={book._id}
              className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              {/* Book Cover */}
              <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center">
                {book.coverUrl ? (
                  <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                ) : (
                  <BookOpen className="w-16 h-16 text-blue-600 dark:text-blue-400" />
                )}
              </div>
              
              <div className="p-4">
                <h2 className="text-lg font-semibold text-white mb-1 line-clamp-2">
                  {book.title}
                </h2>
                <p className="text-sm text-gray-300 mb-2">
                  by {book.author}
                </p>
                
                {book.category && (
                  <span className="inline-block bg-blue-500/20 text-blue-300 text-xs px-3 py-1 rounded-full mb-3 border border-blue-400/30">
                    {book.category}
                  </span>
                )}
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-300">
                      {book.avgRating?.toFixed(1) || "No rating"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className={`font-medium ${
                      book.availableCopies > 0 ? "text-green-400" : "text-red-400"
                    }`}>
                      {book.availableCopies}/{book.totalCopies}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(book)}
                    className="flex-1 bg-blue-500/20 text-blue-300 py-2 px-3 rounded-xl text-center text-sm font-medium hover:bg-blue-500/30 transition-colors border border-blue-400/30"
                  >
                    <Edit className="w-4 h-4 mx-auto" />
                  </button>
                  <button
                    onClick={() => handleDelete(book._id)}
                    className="flex-1 bg-red-500/20 text-red-300 py-2 px-3 rounded-xl text-center text-sm font-medium hover:bg-red-500/30 transition-colors border border-red-400/30"
                  >
                    <Trash2 className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
