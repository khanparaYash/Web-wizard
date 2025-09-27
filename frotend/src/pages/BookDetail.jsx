import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { ArrowLeft, Star, Calendar, User, BookOpen, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";

export default function BookDetail() {
  const { id } = useParams();
  const { token, user } = useContext(AuthContext);
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [borrowing, setBorrowing] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/books/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBook(res.data.book);
        setReviews(res.data.reviews);
      } catch (err) {
        console.error("Failed to fetch book", err);
        toast.error("Failed to load book details");
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id, token]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!rating || !comment.trim()) {
      toast.error("Please provide both rating and comment");
      return;
    }
    
    setSubmittingReview(true);
    try {
      const res = await axios.post(
        `http://localhost:4000/reviews/${id}`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviews([...reviews, res.data]);
      setRating(0);
      setComment("");
      toast.success("Review submitted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const borrowBook = async () => {
    setBorrowing(true);
    try {
      const res = await axios.post(
        `http://localhost:4000/borrow/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { borrow, slipUrl } = res.data;
      toast.success("Book borrowed successfully! Your slip is ready.");
      
      // Update book availability
      setBook(prev => ({ ...prev, availableCopies: prev.availableCopies - 1 }));

      // Open borrow slip in new tab
      if (slipUrl) {
        window.open(`http://localhost:4000${slipUrl}`, "_blank");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to borrow book");
    } finally {
      setBorrowing(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
          Book not found
        </h2>
        <Link to="/catalog" className="text-blue-600 hover:text-blue-700">
          ← Back to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back Button */}
      <Link 
        to="/catalog" 
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Catalog
      </Link>

      {/* Book Header */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Book Cover */}
          <div className="lg:col-span-1">
            <div className="h-80 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-xl flex items-center justify-center overflow-hidden">
              {book.coverUrl ? (
                <img 
                  src={book.coverUrl} 
                  alt={book.title}
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className={`w-full h-full flex items-center justify-center ${book.coverUrl ? 'hidden' : 'flex'}`}>
                <BookOpen className="w-24 h-24 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          {/* Book Info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {book.title}
              </h1>
              <p className="text-xl text-gray-300 mb-4">
                by {book.author}
              </p>
              
              {book.category && (
                <span className="inline-block bg-blue-500/20 text-blue-300 text-sm px-3 py-1 rounded-full border border-blue-400/30">
                  {book.category}
                </span>
              )}
            </div>

            {/* Book Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="text-sm text-gray-300">Rating</p>
                  <p className="font-semibold text-white">{book.avgRating?.toFixed(1) || "No rating"}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-300">Available</p>
                  <p className={`font-semibold ${book.availableCopies > 0 ? "text-green-400" : "text-red-400"}`}>
                    {book.availableCopies} copies
                  </p>
                </div>
              </div>
            </div>

            {/* Borrow Button */}
            {user?.role === "student" && (
              <button
                disabled={book.availableCopies === 0 || borrowing}
                onClick={borrowBook}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {borrowing ? "Borrowing..." : book.availableCopies > 0 ? "Borrow Book" : "Not Available"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
          <MessageSquare className="w-6 h-6" />
          Reviews ({reviews.length})
        </h2>

        {/* Add Review Form */}
        {user?.role === "student" && (
          <form onSubmit={submitReview} className="mb-8 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
            <h3 className="text-lg font-semibold mb-4 text-white">Write a Review</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Rating
                </label>
        <select
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        >
          <option value={0}>Select rating</option>
          {[1, 2, 3, 4, 5].map((star) => (
            <option key={star} value={star}>
              {star} ⭐
            </option>
          ))}
        </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Comment
              </label>
        <textarea
                placeholder="Share your thoughts about this book..."
                className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
              />
            </div>

        <button
          type="submit"
              disabled={submittingReview || !rating || !comment.trim()}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-6 rounded-xl font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
              {submittingReview ? "Submitting..." : "Submit Review"}
        </button>
      </form>
        )}

        {/* Reviews List */}
      {reviews.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-300">No reviews yet</p>
            <p className="text-sm text-gray-400">Be the first to review this book!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="font-semibold text-white">
                      {review.userId.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating ? "text-yellow-500 fill-current" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-300">{review.comment}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(review.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
      )}
      </div>
    </div>
  );
}
