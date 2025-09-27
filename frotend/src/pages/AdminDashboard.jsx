import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { BookOpen, Users, Clock, TrendingUp, AlertCircle, CheckCircle, Settings, Bell, QrCode } from "lucide-react";
import toast from "react-hot-toast";
import BookManagement from "./admin/BookManagement";
import UserManagement from "./admin/UserManagement";
import AnnouncementManagement from "./admin/AnnouncementManagement";
import QRScanner from "./admin/QRScanner";

export default function AdminDashboard() {
  const { token } = useContext(AuthContext);
  const [stats, setStats] = useState({ books: 0, borrows: 0, overdue: 0 });
  const [topBooks, setTopBooks] = useState([]);
  const [pendingRenewals, setPendingRenewals] = useState([]);
  const [pendingDonations, setPendingDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, renewalsRes, donationsRes] = await Promise.allSettled([
          axios.get("http://localhost:4000/books/admin/stats", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:4000/renewals", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:4000/donations", {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);
        
        // Handle stats
        if (statsRes.status === 'fulfilled') {
          setStats(statsRes.value.data.stats);
          setTopBooks(statsRes.value.data.topBooks);
        } else {
          console.warn("Stats not available:", statsRes.reason);
          setStats({ books: 0, borrows: 0, overdue: 0 });
          setTopBooks([]);
        }
        
        // Handle renewals
        if (renewalsRes.status === 'fulfilled') {
          setPendingRenewals(renewalsRes.value.data);
        } else {
          console.warn("Renewals not available:", renewalsRes.reason);
          setPendingRenewals([]);
        }
        
        // Handle donations
        if (donationsRes.status === 'fulfilled') {
          setPendingDonations(donationsRes.value.data.filter(d => d.status === "pending"));
        } else {
          console.warn("Donations not available:", donationsRes.reason);
          setPendingDonations([]);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [token]);

  const handleRenewalAction = async (borrowId, action) => {
    try {
      await axios.post(`http://localhost:4000/renewals/${borrowId}/${action}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(`Renewal ${action}d successfully`);
      setPendingRenewals(prev => prev.filter(r => r._id !== borrowId));
    } catch (err) {
      toast.error(`Failed to ${action} renewal`);
    }
  };

  const handleDonationAction = async (donationId, action) => {
    try {
      await axios.put(`http://localhost:4000/donations/${donationId}`, { status: action }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(`Donation ${action}d successfully`);
      setPendingDonations(prev => prev.filter(d => d._id !== donationId));
    } catch (err) {
      toast.error(`Failed to ${action} donation`);
    }
  };

  if (loading) {
  return (
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: TrendingUp },
    { id: "books", label: "Books", icon: BookOpen },
    { id: "users", label: "Users", icon: Users },
    { id: "announcements", label: "Announcements", icon: Bell },
    { id: "scanner", label: "QR Scanner", icon: QrCode },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "books":
        return <BookManagement />;
      case "users":
        return <UserManagement />;
      case "announcements":
        return <AnnouncementManagement />;
      case "scanner":
        return <QRScanner />;
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300">Total Books</p>
              <p className="text-2xl font-bold text-blue-400">{stats.books}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300">Active Borrows</p>
              <p className="text-2xl font-bold text-green-400">{stats.borrows}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300">Overdue Books</p>
              <p className="text-2xl font-bold text-red-400">{stats.overdue}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300">Pending Actions</p>
              <p className="text-2xl font-bold text-yellow-400">{pendingRenewals.length + pendingDonations.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Most Borrowed Books Chart */}
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-xl">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            Most Borrowed Books
          </h2>
          {topBooks.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topBooks}>
                <XAxis dataKey="title" angle={-45} textAnchor="end" height={80} />
            <YAxis />
            <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-300">
              No borrowing data available
            </div>
          )}
        </div>

        {/* Pending Renewals */}
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-xl">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-white" />
            </div>
            Pending Renewals ({pendingRenewals.length})
          </h2>
          {pendingRenewals.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="text-gray-300">No pending renewals</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {pendingRenewals.map((renewal) => (
                <div key={renewal._id} className="p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                  <h3 className="font-semibold text-white">{renewal.bookId.title}</h3>
                  <p className="text-sm text-gray-300">
                    Student: {renewal.userId.name}
                  </p>
                  <p className="text-sm text-gray-300">
                    Due: {new Date(renewal.dueDate).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleRenewalAction(renewal._id, "approve")}
                      className="text-xs bg-green-500/20 text-green-300 px-3 py-1 rounded-full hover:bg-green-500/30 transition-colors border border-green-400/30"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleRenewalAction(renewal._id, "decline")}
                      className="text-xs bg-red-500/20 text-red-300 px-3 py-1 rounded-full hover:bg-red-500/30 transition-colors border border-red-400/30"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pending Donations */}
      {pendingDonations.length > 0 && (
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-xl">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            Pending Donations ({pendingDonations.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingDonations.map((donation) => (
              <div key={donation._id} className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <h3 className="font-semibold text-white">{donation.title}</h3>
                <p className="text-sm text-gray-300">
                  by {donation.author}
                </p>
                <p className="text-sm text-gray-300">
                  Donor: {donation.donorName}
                </p>
                {donation.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {donation.description}
                  </p>
                )}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleDonationAction(donation._id, "approved")}
                    className="text-xs bg-green-500/20 text-green-300 px-3 py-1 rounded-full hover:bg-green-500/30 transition-colors border border-green-400/30"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleDonationAction(donation._id, "declined")}
                    className="text-xs bg-red-500/20 text-red-300 px-3 py-1 rounded-full hover:bg-red-500/30 transition-colors border border-red-400/30"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg text-white p-8 rounded-3xl border border-white/20 shadow-2xl">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <span className="text-2xl">📊</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-xl text-gray-300">Manage your library system efficiently</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl">
        <div className="border-b border-white/20">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-400 text-blue-300"
                      : "border-transparent text-gray-300 hover:text-white hover:border-white/30"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
        
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
