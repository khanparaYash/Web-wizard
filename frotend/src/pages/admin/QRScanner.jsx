import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { QrCode, Camera, CheckCircle, XCircle, AlertCircle, Scan, Upload, Zap, Shield, Clock } from "lucide-react";
import toast from "react-hot-toast";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function QRScanner() {
  const { token } = useContext(AuthContext);
  const [scannedData, setScannedData] = useState("");
  const [borrowInfo, setBorrowInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [scannerActive, setScannerActive] = useState(false);
  const [scanMode, setScanMode] = useState("camera"); // "camera" or "manual"
  const scannerRef = useRef(null);
  const qrScannerRef = useRef(null);

  // Camera QR Scanner Functions
  const startCameraScanner = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.clear();
    }

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
    };

    qrScannerRef.current = new Html5QrcodeScanner("qr-reader", config, false);
    
    qrScannerRef.current.render(
      (decodedText) => {
        handleQRCodeDetected(decodedText);
        stopCameraScanner();
      },
      (error) => {
        // Handle scan errors silently
      }
    );
    
    setScannerActive(true);
  };

  const stopCameraScanner = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.clear();
      qrScannerRef.current = null;
    }
    setScannerActive(false);
  };

  const handleQRCodeDetected = (decodedText) => {
    setScannedData(decodedText);
    fetchBorrowInfo(decodedText);
    toast.success("QR Code detected!");
  };

  const handleQRScan = () => {
    if (!scannedData.trim()) {
      toast.error("Please enter a borrow ID or QR code data");
      return;
    }
    fetchBorrowInfo(scannedData.trim());
  };

  const fetchBorrowInfo = async (inputData) => {
    setLoading(true);
    try {
      // Try to parse as JSON first (QR code format)
      let borrowId = inputData;
      try {
        const qrData = JSON.parse(inputData);
        if (qrData.type === "borrow" && qrData.borrowId) {
          borrowId = qrData.borrowId;
        }
      } catch (e) {
        // If not JSON, treat as direct borrow ID
        borrowId = inputData;
      }

      const res = await axios.get(`http://localhost:4000/borrow/${borrowId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBorrowInfo(res.data);
      toast.success("Borrow information loaded successfully");
    } catch (err) {
      console.error("Failed to fetch borrow info", err);
      toast.error("Invalid QR code or borrow not found");
      setBorrowInfo(null);
    } finally {
      setLoading(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.clear();
      }
    };
  }, []);

  const handleReturn = async () => {
    if (!borrowInfo) return;
    
    setProcessing(true);
    try {
      await axios.post(`http://localhost:4000/borrow/return/${borrowInfo._id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      toast.success("Book returned successfully!");
      setBorrowInfo(null);
      setScannedData("");
    } catch (err) {
      console.error("Failed to return book", err);
      toast.error("Failed to return book");
    } finally {
      setProcessing(false);
    }
  };

  const clearScan = () => {
    setScannedData("");
    setBorrowInfo(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Modern Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <Scan className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Smart QR Scanner
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Advanced QR code scanning technology for seamless book return processing
          </p>
        </div>

        {/* Mode Selection */}
        <div className="flex justify-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-2 border border-white/20">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setScanMode("camera");
                  stopCameraScanner();
                }}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                  scanMode === "camera"
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <Camera className="w-5 h-5" />
                Camera Scan
              </button>
              <button
                onClick={() => {
                  setScanMode("manual");
                  stopCameraScanner();
                }}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                  scanMode === "manual"
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <Upload className="w-5 h-5" />
                Manual Entry
              </button>
            </div>
          </div>
        </div>

        {/* Scanner Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Camera Scanner */}
          {scanMode === "camera" && (
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center gap-3">
                  <Zap className="w-6 h-6 text-yellow-400" />
                  <h2 className="text-2xl font-bold text-white">Live Camera Scanner</h2>
                </div>
                
                <div className="relative">
                  <div 
                    id="qr-reader" 
                    className="rounded-2xl overflow-hidden border-2 border-white/30"
                    style={{ minHeight: '300px' }}
                  ></div>
                  
                  {!scannerActive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl">
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                          <Camera className="w-8 h-8 text-white" />
                        </div>
                        <p className="text-white font-medium">Camera Ready</p>
                        <button
                          onClick={startCameraScanner}
                          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center gap-2 mx-auto"
                        >
                          <Scan className="w-5 h-5" />
                          Start Scanning
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {scannerActive && (
                  <button
                    onClick={stopCameraScanner}
                    className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-2 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center gap-2 mx-auto"
                  >
                    <XCircle className="w-5 h-5" />
                    Stop Scanner
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Manual Entry */}
          {scanMode === "manual" && (
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
              <div className="space-y-6">
                <div className="flex items-center justify-center gap-3">
                  <Upload className="w-6 h-6 text-blue-400" />
                  <h2 className="text-2xl font-bold text-white">Manual Entry</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Enter QR Code Data or Borrow ID
                    </label>
                    <input
                      type="text"
                      placeholder="Paste QR code data or enter borrow ID..."
                      className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                      value={scannedData}
                      onChange={(e) => setScannedData(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleQRScan();
                        }
                      }}
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={handleQRScan}
                      disabled={!scannedData || loading}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-4 rounded-xl font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Shield className="w-5 h-5" />
                          Process Code
                        </>
                      )}
                    </button>
                    
                    {scannedData && (
                      <button
                        onClick={clearScan}
                        className="bg-white/10 text-white px-6 py-4 rounded-xl font-medium hover:bg-white/20 transition-all duration-300 border border-white/20"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Borrow Information Display */}
          {borrowInfo && (
            <div className="lg:col-span-2">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-4">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">Borrow Information</h2>
                  <p className="text-gray-300">Ready to process return</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Book Information */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <QrCode className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white">Book Details</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-400">Title</p>
                        <p className="text-lg font-semibold text-white">{borrowInfo.bookId?.title}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Author</p>
                        <p className="text-white">{borrowInfo.bookId?.author}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Borrow ID</p>
                        <p className="text-sm text-gray-300 font-mono">{borrowInfo._id}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Student Information */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white">Student Details</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-400">Name</p>
                        <p className="text-lg font-semibold text-white">{borrowInfo.userId?.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Email</p>
                        <p className="text-white">{borrowInfo.userId?.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Student ID</p>
                        <p className="text-sm text-gray-300 font-mono">{borrowInfo.userId?._id}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center">
                    <Clock className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-400 mb-1">Borrow Date</p>
                    <p className="text-lg font-bold text-white">
                      {new Date(borrowInfo.borrowDate).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center">
                    <AlertCircle className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-400 mb-1">Due Date</p>
                    <p className="text-lg font-bold text-white">
                      {new Date(borrowInfo.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center">
                    <CheckCircle className={`w-8 h-8 mx-auto mb-3 ${
                      borrowInfo.status === "borrowed" 
                        ? "text-green-400" 
                        : borrowInfo.status === "overdue"
                        ? "text-red-400"
                        : "text-blue-400"
                    }`} />
                    <p className="text-sm text-gray-400 mb-1">Status</p>
                    <p className={`text-lg font-bold ${
                      borrowInfo.status === "borrowed" 
                        ? "text-green-400" 
                        : borrowInfo.status === "overdue"
                        ? "text-red-400"
                        : "text-blue-400"
                    }`}>
                      {borrowInfo.status.charAt(0).toUpperCase() + borrowInfo.status.slice(1)}
                    </p>
                  </div>
                </div>
                
                {/* Overdue Warning */}
                {new Date(borrowInfo.dueDate) < new Date() && borrowInfo.status === "borrowed" && (
                  <div className="mb-8 p-6 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-400/30 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-6 h-6 text-red-400" />
                      <p className="text-red-200 font-medium text-lg">
                        ⚠️ This book is overdue! Fine will be calculated upon return.
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Return Button */}
                <div className="text-center">
                  <button
                    onClick={handleReturn}
                    disabled={processing || borrowInfo.status !== "borrowed"}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-12 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-3 mx-auto"
                  >
                    {processing ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        Processing Return...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-6 h-6" />
                        Process Return
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">How to Use</h3>
            <p className="text-gray-300">Follow these steps for seamless book return processing</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                <span className="text-white font-bold">1</span>
              </div>
              <h4 className="font-semibold text-white">Choose Mode</h4>
              <p className="text-sm text-gray-400">Select camera scan or manual entry</p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto">
                <span className="text-white font-bold">2</span>
              </div>
              <h4 className="font-semibold text-white">Scan QR Code</h4>
              <p className="text-sm text-gray-400">Use camera or enter QR data manually</p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-600 rounded-full flex items-center justify-center mx-auto">
                <span className="text-white font-bold">3</span>
              </div>
              <h4 className="font-semibold text-white">Review Info</h4>
              <p className="text-sm text-gray-400">Check book and student details</p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <span className="text-white font-bold">4</span>
              </div>
              <h4 className="font-semibold text-white">Process Return</h4>
              <p className="text-sm text-gray-400">Complete the return process</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
