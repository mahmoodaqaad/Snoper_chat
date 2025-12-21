# Real Chat App v1.2

A modern, real-time chat application built with React, Node.js, Socket.io, and MySQL, featuring a stunning Space/Neon Glassmorphism design.

## 🚀 Version 1.2 - Latest Updates

### ✨ New Features

- **Mobile Bottom Navigation** - YouTube-style bottom nav bar for mobile devices
- **Message Status System** - WhatsApp-like read receipts (Sent → Delivered → Read)
- **Typing Indicators** - Smooth bouncing dot animation when users are typing
- **Auto-Read Receipts** - Messages automatically marked as read when opening chat
- **New Pages** - Dedicated pages for Friend Requests and Suggestions
- **Grid Layouts** - Modern card-based grid layouts for all user lists

### 🎨 UI/UX Improvements

- Modern gradient pill buttons
- Glass-card dropdown menus
- Beautiful placeholder styling with purple accents
- Responsive grid layouts (4 → 2 → 1 columns)
- Active state indicators on navigation
- Improved mobile chat input positioning

## 📋 Features

### Core Functionality
- Real-time messaging with Socket.io
- User authentication (Login/Register)
- Friend system (Add, Accept, Reject)
- Post creation with images/videos
- Comments and likes
- Notifications system
- User profiles
- Online status indicators

### Chat Features
- One-on-one messaging
- Message status indicators (Sent/Delivered/Read)
- Typing indicators
- Message deletion
- Chat history
- Auto-scroll to latest message

### Social Features
- Create posts with media
- Like and comment on posts
- Friend requests and suggestions
- User search
- Save posts

## 🛠️ Tech Stack

### Frontend
- **React** 18.x
- **React Router DOM** - Navigation
- **Socket.io-client** - Real-time communication
- **Axios** - HTTP requests
- **Bootstrap** 5.x - Base styling
- **FontAwesome** - Icons
- **Moment.js** - Date formatting
- **SweetAlert2** - Beautiful alerts

### Backend
- **Node.js** with Express
- **Socket.io** - WebSocket server
- **MySQL** - Database
- **JWT** - Authentication
- **Multer** - File uploads
- **Crypto** - UUID generation

## 📁 Project Structure

```
Real Chat App/
├── Client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── API/           # Axios configuration
│   │   ├── Components/    # Reusable components
│   │   │   ├── Footer/    # Bottom navigation (NEW v1.2)
│   │   │   ├── Header/
│   │   │   ├── Posts/
│   │   │   └── Sender/
│   │   ├── Context/       # React Context providers
│   │   ├── CSS/           # Stylesheets
│   │   │   ├── Footer.css           # NEW v1.2
│   │   │   └── typing-animation.css # NEW v1.2
│   │   ├── Page/          # Page components
│   │   │   ├── WebSite/
│   │   │   │   ├── Requests/        # NEW v1.2
│   │   │   │   └── Suggestions/     # NEW v1.2
│   │   │   └── Sender/
│   │   ├── tools/         # Utility components
│   │   ├── Utils/         # Helper functions
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.css
│   └── package.json
│
└── Server/                # Node.js backend
    ├── Controllers/       # Business logic
    ├── Middleware/        # Auth middleware
    ├── Routes/           # API routes
    ├── index.js          # Socket.io server (UPDATED v1.2)
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd "Real Chat app"
```

2. **Install dependencies**

Client:
```bash
cd Client
npm install
```

Server:
```bash
cd Server
npm install
```

3. **Database Setup**
- Create a MySQL database
- Import the database schema (if provided)
- Update database credentials in `Server/.env`

4. **Environment Variables**

Create `.env` file in Server directory:
```env
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=chat_app
JWT_SECRET=your_secret_key
PORT=5000
```

Create `.env` file in Client directory:
```env
REACT_APP_API_URL=http://localhost:5000
```

5. **Run the application**

Server (Terminal 1):
```bash
cd Server
npm start
```

Client (Terminal 2):
```bash
cd Client
npm start
```

The app will open at `http://localhost:3000`

## 📱 Responsive Design

- **Desktop** (>991px): Full sidebar navigation, wide layout
- **Tablet** (768px-991px): Responsive grid, bottom navigation
- **Mobile** (<768px): Single column, bottom navigation, optimized chat input

## 🎨 Design System

### Colors
- **Primary Background**: `#0f172a` (Deep Space)
- **Secondary Background**: `#1e293b`
- **Accent Color**: `#8b5cf6` (Violet)
- **Accent Secondary**: `#3b82f6` (Blue)
- **Text Primary**: `#f8fafc`
- **Text Secondary**: `#94a3b8`

### Effects
- Glassmorphism with backdrop blur
- Smooth transitions (0.2s-0.3s)
- Gradient buttons
- Box shadows with purple tint

## 🔄 Message Status System (v1.2)

### Status Flow
1. **Sent** (✓ gray) - Message created in database
2. **Delivered** (✓✓ light) - Message received by recipient's device
3. **Read** (✓✓ blue) - Recipient opened the chat

### Socket Events
- `sendMessage` - Send new message
- `getMessage` - Receive message
- `messageReceived` - Delivery receipt
- `messageReceivedStatus` - Update sender UI (delivered)
- `messageRead` - Read receipt
- `messageReadStatus` - Update sender UI (read)

## 📝 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Messages
- `GET /messages/allMessages/:chatId` - Get chat messages
- `POST /messages/sent` - Send message
- `PUT /messages/mark-as-read/:id` - Mark message as read
- `DELETE /messages/deleteMassage/:id` - Delete message

### Chats
- `POST /chats/create` - Create/get chat
- `DELETE /chats/deleteChat/:id` - Delete chat

### Users
- `GET /users/getNoification` - Get notifications
- (Additional user endpoints...)

## 🐛 Known Issues & Fixes (v1.2)

### Fixed in v1.2
- ✅ Message status not updating (type mismatch)
- ✅ Messages not marking as read on chat open
- ✅ Chat input overlapping bottom nav on mobile
- ✅ Placeholder text too dark to see
- ✅ Navigation links pointing to wrong routes

## 🔮 Future Enhancements

- [ ] Group chats
- [ ] Voice messages
- [ ] Video calls
- [ ] Message reactions
- [ ] Dark/Light theme toggle
- [ ] Message search
- [ ] File sharing
- [ ] User blocking
- [ ] Message forwarding
- [ ] Stories feature

## 📄 License

This project is licensed under the MIT License.

## 👥 Contributors

- Your Name - Initial work and v1.2 updates

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

**Version**: 1.2.0  
**Last Updated**: December 21, 2025  
**Status**: Active Development
