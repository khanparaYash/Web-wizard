import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Trophy, Medal, Award, Star, Crown } from "lucide-react";
import toast from "react-hot-toast";

export default function Leaderboard() {
  const { token, user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get("http://localhost:4000/leaderboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch leaderboard", err);
        toast.error("Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [token]);

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 1:
        return <Trophy className="w-6 h-6 text-gray-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <Award className="w-5 h-5 text-gray-500" />;
    }
  };

  const getRankColor = (index) => {
    switch (index) {
      case 0:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
      case 1:
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-white";
      case 2:
        return "bg-gradient-to-r from-amber-400 to-amber-600 text-white";
      default:
        return "bg-white/10 backdrop-blur-lg text-white border border-white/20";
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mb-4">
          <span className="text-3xl">🏆</span>
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
          Leaderboard
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Top performers in our library community
        </p>
      </div>

      {/* Current User Stats */}
      {user && (
        <div className="bg-white/10 backdrop-blur-lg text-white p-6 rounded-2xl border border-white/20 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Your Ranking</h2>
              <p className="text-blue-100">
                {users.findIndex(u => u._id === user.id) + 1 || "Unranked"} of {users.length} users
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{user.points || 0}</p>
              <p className="text-blue-100">points</p>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-white/20">
          <h2 className="text-xl font-bold flex items-center gap-2 text-white">
            <Trophy className="w-5 h-5" />
            Top Performers
          </h2>
        </div>
        
        <div className="divide-y divide-white/20">
          {users.length === 0 ? (
            <div className="p-8 text-center">
              <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-300">No users found</p>
            </div>
          ) : (
            users.map((userItem, index) => (
              <div
                key={userItem._id}
                className={`p-6 transition-colors ${
                  user && userItem._id === user.id 
                    ? "bg-blue-500/10 border-l-4 border-blue-400" 
                    : "hover:bg-white/5"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full ${getRankColor(index)}`}>
                      {index < 3 ? (
                        getRankIcon(index)
                      ) : (
                        <span className="font-bold text-lg">{index + 1}</span>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg text-white">
                        {userItem.name}
                        {user && userItem._id === user.id && (
                          <span className="ml-2 text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full border border-blue-400/30">
                            You
                          </span>
                        )}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm text-gray-300">
                          {userItem.badges?.length || 0} badges
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-400">
                      {userItem.points}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">points</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Badge Information */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Award className="w-5 h-5" />
          How to Earn Points
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Borrow a book: +10 points</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Return on time: +5 points</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>Late return: -2 points per day</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>Write a review: +3 points</span>
          </div>
        </div>
      </div>
    </div>
  );
}
