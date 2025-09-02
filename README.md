CSI Interview Task

# Library Management System

A full-stack web application for managing library operations with book borrowing, reservations, and user management capabilities.

## Architecture Overview

**Frontend**: React 18 with Material-UI and custom zinc theming  
**Backend**: Express.js with JWT authentication and Passport.js  
**Database**: MongoDB with Mongoose ODM  
**Authentication**: BCrypt password hashing with JWT tokens (12h expiry)

### Middleware Chain
```
Request → CORS → Body Parser → Session → Passport → DB Connection Check → JWT Verify → Route Handler
```

## Routes

### Authentication (Public)
```
POST /login          - User authentication
POST /register       - User registration
GET  /protected      - JWT validation test
```

### Books (Protected)
```
GET  /api/books/browse         - List all available books
GET  /api/books/search         - Search with query parameters  
GET  /api/books/read/:bookId   - Redirect to PDF URL
POST /api/books/add            - Add new book
```

### Users (Protected)
```
GET   /api/users/:id/dashboard  - User dashboard data
POST  /api/users/borrow         - Borrow book transaction
POST  /api/users/return         - Return book transaction
POST  /api/users/reserve        - Reserve book  
POST  /api/users/renew          - Renew loan
PATCH /api/users/:id/password   - Update password
```

## Database Schema

### Collections Structure
```javascript
// Users Collection
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (bcrypt hashed),
  borrowedBooks: [{
    book: ObjectId (ref: Book),
    borrowDate: Date,
    dueDate: Date
  }],
  reservations: [{
    book: ObjectId (ref: Book),
    reservationDate: Date
  }],
  finesHistory: [{
    amount: Number,
    reason: String,
    datePaid: Date
  }]
}

// Books Collection
{
  _id: ObjectId,
  title: String,
  author: String,
  category: String,
  availability: Boolean,
  bookFile: String, // PDF URL
  reservedBy: [ObjectId] (refs: User),
  borrowedBy: ObjectId (ref: User)
}

// Loans Collection
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  book: ObjectId (ref: Book),
  borrowDate: Date,
  dueDate: Date,
  returnDate: Date,
  status: Enum ['borrowed', 'returned', 'overdue'],
  fines: Number
}

// Reservations Collection
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  book: ObjectId (ref: Book),
  reservationDate: Date,
  status: Enum ['active', 'fulfilled', 'cancelled']
}
```

## Lending Rules

### Core Policy
- **Loan Duration**: 14 days from borrow date
- **Fine Rate**: ₹10 per day for overdue books  
- **Renewal**: Only allowed on exact due date
- **Reservations**: FIFO queue system

### Business Logic
1. **Borrowing**: Requires book availability, creates loan record, updates user's borrowedBooks
2. **Returning**: Calculates fines, processes reservation queue, auto-assigns to next user
3. **Reservations**: Only for unavailable books, prevents duplicate reservations
4. **Renewals**: Blocked if pending reservations exist

### Transaction Safety
All critical operations use MongoDB sessions with automatic rollback on failure.

## Seeding Approach

### Manual Data Entry
Books added through web interface "Add Book" functionality on Browse page.

### Initial Setup Process
1. Start MongoDB instance
2. Run server to auto-create collections
3. Register first user via `/register` endpoint
4. Add books through authenticated `/api/books/add` endpoint

### Sample Book Structure
```javascript
{
  title: "Book Title",
  author: "Author Name",
  category: "Fiction/Technical/etc", 
  availability: true,
  bookFile: "https://example.com/book.pdf" // Optional
}
```

## PDF Viewer Integration

### Implementation
- **Storage**: External PDF hosting (URLs in bookFile field)
- **Access**: `window.open(book.bookFile, "_blank")` opens in new tab
- **Rendering**: Browser's native PDF viewer
- **Security**: No server-side processing or authentication

### Usage Flow
1. "Read" button appears only if bookFile URL exists
2. Click opens PDF in new browser tab
3. Frontend auto-adds https:// protocol if missing

## Setup

### Environment Variables
```
DB_STRING=mongodb://...
JWT_SECRET_KEY=your-jwt-secret
PASSPORT_SECRET_KEY=your-passport-secret
BASEURL=http://localhost:3000
PORT=8000
```

### Installation
```bash
# Backend
cd server && npm install && npm start

# Frontend
cd client && npm install && npm start
```

## Production Deployment

**Backend**: Render deployment with environment variables for DB_STRING, JWT secrets  
**Frontend**: Static hosting with production build optimization  
**Database**: MongoDB Atlas with connection pooling