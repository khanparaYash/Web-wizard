import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { Moon, Sun, BookOpen, User, Trophy, Settings, Heart } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center p-6 bg-white/10 backdrop-blur-lg border-b border-white/20 shadow-2xl">
      <Link to="/" className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        MyLibrary
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-2">
              {user.role === "student" ? (
                <>
                  <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300">
                    <User className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <Link to="/catalog" className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300">
                    <BookOpen className="w-4 h-4" />
                    Catalog
                  </Link>
                  <Link to="/leaderboard" className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300">
                    <Trophy className="w-4 h-4" />
                    Leaderboard
                  </Link>
                  <Link to="/donate" className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300">
                    <Heart className="w-4 h-4" />
                    Donate
                  </Link>
                </>
              ) : (
                <Link to="/admin" className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300">
                  <Settings className="w-4 h-4" />
                  Admin Panel
                </Link>
              )}
            </div>

            {/* User Info */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-xs text-gray-300 capitalize">{user.role}</p>
                {user.role === "student" && (
                  <p className="text-xs text-blue-400 font-semibold">{user.points || 0} points</p>
                )}
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-3 rounded-xl hover:bg-white/10 transition-all duration-300"
                title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-300" />
                )}
              </button>

              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Theme Toggle for non-authenticated users */}
            <button
              onClick={toggleTheme}
              className="p-3 rounded-xl hover:bg-white/10 transition-all duration-300"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-300" />
              )}
            </button>

            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-gray-300 hover:text-white transition-colors font-medium px-4 py-2 rounded-xl hover:bg-white/10"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
              >
                Register
              </Link>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
