# User Management Backend

A comprehensive user management system similar to Airtable, specifically designed for managing backend user accounts for iOS/Android apps. Built with Node.js/Express backend and Vue.js frontend with Bootstrap styling.

## Features

### 🎯 Core Features
- **User Management**: Complete CRUD operations for user accounts
- **App Management**: Manage multiple iOS/Android apps from one dashboard
- **Analytics Dashboard**: Real-time insights and user analytics
- **API Endpoints**: RESTful API for your mobile apps
- **Airtable-like Interface**: Clean, modern UI with filtering and sorting

### 📱 Mobile App Integration
- User registration and authentication
- JWT token-based security
- Device information tracking
- Subscription management
- Custom fields support

### 📊 Analytics & Insights
- User growth tracking
- Retention analytics
- Platform distribution
- Subscription status breakdown
- Export capabilities (CSV, JSON)

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Express Validator** for data validation
- **Security**: Helmet, CORS, Rate Limiting

### Frontend
- **Vue.js 3** with Composition API
- **Bootstrap 5** for styling
- **Chart.js** for analytics visualization
- **Axios** for API communication
- **Vue Router** for navigation

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Environment Setup**
   ```bash
   # In backend directory
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Start Backend Server**
   ```bash
   # In backend directory
   npm run dev
   ```

6. **Start Frontend Development Server**
   ```bash
   # In root directory
   npm run serve
   ```

7. **Access the Application**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:3001

## API Integration Examples

### iOS Swift
```swift
// Register user
UserAPI.register(email: "user@example.com", username: "johndoe", 
                 password: "password", appId: "com.yourcompany.yourapp")
```

### Android Kotlin
```kotlin
// Login user
val response = userAPI.login(LoginRequest(email, password, appId))
```

Built with ❤️ for iOS and Android developers who need a robust user management backend.




## Features/Ideas
- Push token for notifications intergration with ability to send directly for testing through dashboard
- Email Newsletter
- Google/Apple/Facebook/Github login
- Welcome mails
- Docs
- More subscription levels
- Push/Email notifications for admin
- More languages
- Login/Register Page
- Home Page
- Host frontend on github pages ???
- MFA for users
- SDKs for iOS/Android/Web(JS,NODE)
- History of account status - helpful for moderation
- Roles for projects, so more users can have access to the same project