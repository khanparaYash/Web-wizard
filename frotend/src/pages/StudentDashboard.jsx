import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { BookOpen, Trophy, Clock, Star, Bell, TrendingUp } from "lucide-react";
import toast from "react-hot-toast";

export default function StudentDashboard() {
  const { user, token } = useContext(AuthContext);
  const [borrowHistory, setBorrowHistory] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [recommendations, setRecommendations] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [historyRes, announcementsRes] = await Promise.all([
          axios.get("http://localhost:4000/borrow/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:4000/announcements")
        ]);

        setBorrowHistory(historyRes.data);
        setAnnouncements(announcementsRes.data.slice(0, 3)); // Show latest 3

        // Try to fetch recommendations, but don't fail if it doesn't work
        try {
          const recommendationsRes = await axios.get(`http://localhost:4000/recommendations/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
          setRecommendations(recommendationsRes.data);
        } catch (recErr) {
          console.warn("Recommendations not available:", recErr);
          setRecommendations({ mostBorrowed: [], topRated: [], categoryMatch: [] });
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [token, user]);

  const handleRenewalRequest = async (borrowId) => {
    try {
      await axios.post(`http://localhost:4000/borrow/renew/${borrowId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Renewal requested! Admin will review it.");
    } catch (err) {
      toast.error("Failed to request renewal");
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const activeBorrows = borrowHistory.filter(b => b.status === "borrowed");
  const overdueBorrows = borrowHistory.filter(b => 
    b.status === "borrowed" && new Date(b.dueDate) < new Date()
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Header */}
      <div className="bg-white/10 backdrop-blur-lg text-white p-8 rounded-3xl border border-white/20 shadow-2xl">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <span className="text-2xl">👋</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-xl text-gray-300">Ready to discover your next great read?</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300">Your Points</p>
              <p className="text-2xl font-bold text-yellow-400">{user?.points || 0}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300">Active Borrows</p>
              <p className="text-2xl font-bold text-green-400">{activeBorrows.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300">Overdue</p>
              <p className="text-2xl font-bold text-red-400">{overdueBorrows.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300">Badges</p>
              <p className="text-2xl font-bold text-purple-400">{user?.badges?.length || 0}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Borrows */}
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-xl">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            Your Active Borrows
          </h2>
          {activeBorrows.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-300">No active borrows</p>
              <Link to="/catalog" className="text-blue-400 hover:text-blue-300 mt-2 inline-block font-medium">
                Browse books →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {activeBorrows.map((borrow) => (
                <div key={borrow._id} className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                  <h3 className="font-semibold text-lg text-white">{borrow.bookId.title}</h3>
                  <p className="text-sm text-gray-300">
                    Due: {new Date(borrow.dueDate).toLocaleDateString()}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-sm font-medium ${
                      new Date(borrow.dueDate) < new Date()
                        ? "text-red-400"
                        : new Date(borrow.dueDate) - new Date() < 2 * 24 * 60 * 60 * 1000
                        ? "text-yellow-400"
                        : "text-green-400"
                    }`}>
                      {new Date(borrow.dueDate) < new Date() ? "Overdue" :
                       new Date(borrow.dueDate) - new Date() < 2 * 24 * 60 * 60 * 1000 ? "Due Soon" : "On Time"}
                    </span>
                    {borrow.status === "borrowed" && (
                      <button
                        onClick={() => handleRenewalRequest(borrow._id)}
                        className="text-xs bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full hover:bg-blue-500/30 transition-colors border border-blue-400/30"
                      >
                        Request Renewal
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Announcements */}
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-xl">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Bell className="w-4 h-4 text-white" />
            </div>
            Latest Announcements
          </h2>
          {announcements.length === 0 ? (
            <p className="text-gray-300">No announcements</p>
          ) : (
            <div className="space-y-3">
              {announcements.map((announcement) => (
                <div key={announcement._id} className="p-4 bg-blue-500/10 backdrop-blur-sm rounded-xl border border-blue-400/20">
                  <h3 className="font-semibold text-blue-200">
                    {announcement.title}
              </h3>
                  <p className="text-sm text-gray-300 mt-1">
                    {announcement.message}
                  </p>
                  <p className="text-xs text-blue-400 mt-2">
                    {new Date(announcement.date).toLocaleDateString()}
              </p>
            </div>
          ))}
            </div>
          )}
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.mostBorrowed && recommendations.mostBorrowed.length > 0 && (
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-xl">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            Recommended for You
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.mostBorrowed.slice(0, 3).map((book) => (
              <Link
                key={book._id}
                to={`/book/${book._id}`}
                className="p-4 bg-white/5 backdrop-blur-sm rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20"
              >
                {/* Book Cover */}
                <div className="h-32 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg flex items-center justify-center overflow-hidden mb-3">
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
                    <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                
                <h3 className="font-semibold text-white">{book.title}</h3>
                <p className="text-sm text-gray-300">{book.author}</p>
                <p className="text-xs text-blue-400 mt-1">
                  Popular Choice
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
