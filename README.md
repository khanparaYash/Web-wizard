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

## 🚀 Developers

Veer Bhalodia - Frontend

Tirth Gondaliya - Frontend

Yash Khanpara - Backend

Kunj Meghpara - Backend

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

## Screenshots

## Students pages
![WhatsApp Image 2025-09-27 at 16 50 12_63bc9184](https://github.com/user-attachments/assets/86c3cfa8-8552-40ef-858b-ef95b578a6ed)
This Student Dashboard is the user's personal hub, showcasing active borrows, real-time announcements (like "java book coming"), and personalized book recommendations. Its dark-mode UI/UX prioritizes user engagement and quick access to essential library information.

![WhatsApp Image 2025-09-27 at 16 50 26_5ecb94a1](https://github.com/user-attachments/assets/4e0b93b1-667d-428d-a8ed-c9872bee9fee)
This page displays the Book Details for To Kill a Mockingbird, showing the author, category, and a clear "Not Available" status due to 0 available copies. It integrates user features like Rating (currently 0.0) and uses the same modern dark-mode UI as the dashboard.

![WhatsApp Image 2025-09-27 at 16 50 44_cf0c53ce](https://github.com/user-attachments/assets/699ae423-9050-4924-85c3-5ddf6adddcac)
This Book Catalog/Menu displays the library's available books in a grid, showing the title, author, and genre for each. Users can quickly see the real-time availability and choose to "View Details" or "Borrow" directly, with the "Borrow" button grayed out for unavailable books.

![WhatsApp Image 2025-09-27 at 16 50 58_f7d54c68](https://github.com/user-attachments/assets/45adef7e-e628-468a-af15-4ba1630e72c7)
This image showcases the Digital Borrow Slip, a PDF generated instantly after a successful book transaction. It clearly details the book (Pride and Prejudice), the borrower's name/email, the Borrow Date, and the crucial Due Date (10/4/2025). The QR code embedded in the slip streamlines the return process for the admin, making it paperless and efficient.

![WhatsApp Image 2025-09-27 at 16 51 41_cb1dd3b1](https://github.com/user-attachments/assets/83555a41-fb2b-405c-bbbc-1ffbb3c3e8ef)
This describes the Gamification Points System, which rewards or penalizes users based on their activity to encourage good library habits. Students earn +10 points for borrowing a book, +5 points for returning it on time, and face a -2 point deduction per day for late returns.

![WhatsApp Image 2025-09-27 at 16 52 01_8072935e](https://github.com/user-attachments/assets/503ee02a-5e1a-4af7-850a-20c77f7af304)
This page is the Book Donation Module, allowing students to "Share your books with the library community" by filling out a simple form. This feature promotes community engagement, and after admin approval, the donor is rewarded with bonus points as part of the gamification system.

## Admin Pages

![WhatsApp Image 2025-09-27 at 16 53 11_45dffee3](https://github.com/user-attachments/assets/7e235fc0-b0eb-4cd6-b01d-2601a46571d6)
This Admin Dashboard is the central control panel, providing an overview of library operations and key metrics. It displays critical stats like Total Books, Active Borrows, and Overdue Books, alongside an action card for Pending Renewals that allows for immediate approval or decline of requests.

![WhatsApp Image 2025-09-27 at 16 53 43_eab90b09](https://github.com/user-attachments/assets/77e81013-ae16-4038-8710-d13eb1da1c30)
This page is the Admin Announcement Creation interface, where administrators can easily publish library-wide notifications. The screenshot shows the admin composing a new announcement with the title "python" and a message "coming soon in 3," which will be instantly pushed to all student dashboards.

![WhatsApp Image 2025-09-27 at 16 54 31_b0cc2005](https://github.com/user-attachments/assets/9a730e7b-9149-4590-b742-730ef8e1d0d5)
This page features the Smart QR Scanner, the dedicated interface for administrators to perform seamless book return processing. The system offers an "Advanced QR code scanning technology" where the admin can choose between a "Camera Scan" (using a webcam/scanner) or "Manual Entry" to quickly retrieve the borrow record from the student's digital slip, mark the book as returned, and apply any necessary gamification points.

![WhatsApp Image 2025-09-27 at 16 54 46_d4299de1](https://github.com/user-attachments/assets/e731c9db-eb6a-41e8-afde-81bd4fe0f772)
This screenshot displays the Borrow Record Details page, which appears after an admin scans a book's QR code. It instantly retrieves and presents all essential information: Book Details (Pride and Prejudice), Student Details (name, email), the original Borrow Date, the crucial Due Date, and the current Status ("Borrowed"). The central "Process Return" button allows the admin to finalize the transaction with a single click.
