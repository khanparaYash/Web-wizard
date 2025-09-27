# 📚 MERN Library Management System

A comprehensive library management system built with the MERN stack, featuring modern UI/UX, gamification, QR code integration, and real-time notifications.

## ✨ Features

### 🔐 Authentication & Roles
- JWT-based authentication
- Role-based access control (Student/Admin)
- Secure password hashing with bcrypt

### 📖 Core Library Management
- **Books Management**: Add, edit, delete, and search books
- **Borrow/Return System**: Complete borrowing workflow with QR codes
- **Reservation System**: Waitlist for unavailable books
- **Reviews & Ratings**: Community-driven book reviews

### 🎮 Gamification
- **Points System**: Earn points for borrowing, returning, and reviewing
- **Badges**: Unlock achievements based on library activity
- **Leaderboard**: Competitive ranking system

### 📱 QR Code Integration
- **Borrow Slips**: PDF generation with QR codes
- **Return Process**: QR code scanning for quick returns
- **Digital Receipts**: Paperless transaction records

### 📧 Automated Notifications
- **Email Reminders**: Automated due date notifications
- **Renewal System**: Request and approve book renewals
- **Announcements**: Library-wide notifications

### 🎨 Modern UI/UX
- **Responsive Design**: Works on all devices
- **Dark/Light Mode**: Theme switching
- **Interactive Components**: Smooth animations and transitions
- **Real-time Updates**: Live data synchronization

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MERN-Library
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create .env file
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   
   # Seed the database with sample data
   npm run seed
   
   # Start the backend server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frotend
   npm install
   
   # Start the frontend development server
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4000

## 🔑 Default Login Credentials

### Admin Account
- **Email**: admin@library.com
- **Password**: admin123

### Student Accounts
- **Email**: john@student.com
- **Password**: student123
- **Email**: jane@student.com
- **Password**: student123
- **Email**: mike@student.com
- **Password**: student123

## 📁 Project Structure

```
MERN-Library/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Authentication & validation
│   ├── utils/           # Helper functions
│   ├── jobs/            # Scheduled tasks
│   └── seed.js          # Database seeding
├── frotend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context providers
│   │   ├── layout/      # Layout components
│   │   └── lib/         # Utility functions
│   └── public/          # Static assets
└── README.md
```

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **PDFKit** - PDF generation
- **QRCode** - QR code generation
- **node-cron** - Scheduled tasks
- **nodemailer** - Email notifications

### Frontend
- **React** - UI library
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Recharts** - Data visualization
- **React Hot Toast** - Notifications
- **Axios** - HTTP client
- **Framer Motion** - Animations

## 🔧 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login

### Books
- `GET /books` - Get all books (with search/filter)
- `POST /books` - Add new book (Admin only)
- `PUT /books/:id` - Update book (Admin only)
- `DELETE /books/:id` - Delete book (Admin only)
- `GET /books/:id` - Get book details with reviews

### Borrowing
- `POST /borrow/:bookId` - Borrow a book
- `GET /borrow/me` - Get user's borrow history
- `POST /borrow/return/:borrowId` - Return a book (Admin only)
- `POST /borrow/renew/:borrowId` - Request renewal

### Reviews
- `POST /reviews/:bookId` - Add book review
- `GET /reviews/:bookId` - Get book reviews

### Admin
- `GET /books/admin/stats` - Get library statistics
- `GET /renewals` - Get pending renewals
- `POST /renewals/:id/approve` - Approve renewal
- `POST /renewals/:id/decline` - Decline renewal

### Other
- `GET /leaderboard` - Get user rankings
- `GET /recommendations/:userId` - Get book recommendations
- `GET /announcements` - Get library announcements
- `POST /announcements` - Create announcement (Admin only)

## 🎯 Key Features Explained

### QR Code System
1. When a student borrows a book, a PDF slip is generated with a QR code
2. The QR code contains the borrow ID and book information
3. Admin can scan the QR code to quickly process returns
4. The system automatically updates book availability and user points

### Gamification System
- **Points**: Earned for borrowing (+10), on-time returns (+5), reviews (+3)
- **Penalties**: Late returns deduct points (-2 per day)
- **Badges**: Unlocked based on activity milestones
- **Leaderboard**: Real-time ranking of all users

### Email Notifications
- Automated daily checks for books due soon
- Email reminders sent 2 days before due date
- Configurable email templates and scheduling

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or local MongoDB
2. Configure environment variables
3. Deploy to platforms like Heroku, Railway, or DigitalOcean

### Frontend Deployment
1. Build the production bundle: `npm run build`
2. Deploy to platforms like Vercel, Netlify, or GitHub Pages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the existing issues
2. Create a new issue with detailed information
3. Contact the development team

---

**Happy Reading! 📚✨**
