import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { Search, Filter, BookOpen, Star, Calendar, User } from "lucide-react";
import toast from "react-hot-toast";

export default function BookCatalog() {
  const { token, user } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState({});

  useEffect(() => {
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
    fetchBooks();
  }, [token, search, category]);

  const categories = [...new Set(books.map(book => book.category).filter(Boolean))];

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
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
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
          <span className="text-3xl">📚</span>
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Book Catalog
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Discover your next great read from our collection
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-xl">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by title or author..."
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              className="pl-10 pr-8 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none min-w-[150px] backdrop-blur-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>{filteredBooks.length} books found</span>
          {user?.role === "student" && (
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {user.points || 0} points
            </span>
          )}
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              No books found
            </h3>
            <p className="text-gray-400">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          filteredBooks.map((book) => (
            <div
              key={book._id}
              className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              {/* Book Cover */}
              <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center overflow-hidden">
                {book.coverUrl ? (
                  <img 
                    src={book.coverUrl} 
                    alt={book.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`w-full h-full flex items-center justify-center ${book.coverUrl ? 'hidden' : 'flex'}`}>
                  <BookOpen className="w-16 h-16 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              
              <div className="p-6">
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
                      {book.availableCopies} available
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/book/${book._id}`}
                    className="flex-1 bg-white/10 text-white py-2 px-3 rounded-xl text-center text-sm font-medium hover:bg-white/20 transition-colors border border-white/20"
                  >
                    View Details
                  </Link>
                  
                  {user?.role === "student" && (
                    <button
                      disabled={book.availableCopies === 0 || borrowing[book._id]}
                      onClick={() => borrowBook(book._id)}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-3 rounded-xl text-sm font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      {borrowing[book._id] ? "Borrowing..." : "Borrow"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  async function borrowBook(bookId) {
    setBorrowing(prev => ({ ...prev, [bookId]: true }));
    
    try {
      const res = await axios.post(
        `http://localhost:4000/borrow/${bookId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { borrow, slipUrl } = res.data;
      toast.success("Book borrowed successfully! Your slip is ready.");
      
      // Update the book's available copies in the UI
      setBooks(prev => prev.map(book => 
        book._id === bookId 
          ? { ...book, availableCopies: book.availableCopies - 1 }
          : book
      ));

      // Open borrow slip in new tab
      if (slipUrl) {
        window.open(`http://localhost:4000${slipUrl}`, "_blank");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to borrow book");
    } finally {
      setBorrowing(prev => ({ ...prev, [bookId]: false }));
    }
  }
}
