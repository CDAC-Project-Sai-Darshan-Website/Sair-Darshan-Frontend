# Sair-Darshan-Frontend

## श्री साईं बाबा मंदिर - Online Darshan Booking Portal

A beautiful and responsive React application for booking darshan at Shirdi Sai Baba Temple. This application provides a complete authentication system with login, signup, and dashboard functionality.

### Features

- **🙏 User Authentication**: Complete login and signup system
- **📅 Darshan Booking**: Book darshan slots with date and time selection
- **👤 User Profile**: Manage user profile and view booking history
- **📱 Responsive Design**: Beautiful UI with Tailwind CSS
- **💾 Local Storage**: Data persistence using browser localStorage
- **🎨 Sacred Theme**: Orange and red color scheme with Sanskrit text

### Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Storage**: Browser localStorage
- **Icons**: Emoji-based icons for better accessibility

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Sair-Darshan-Frontend/Sai_Darshan_Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Tailwind CSS dependencies**
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Usage

#### For New Users (Signup)
1. Click "Register for Darshan" on the login page
2. Fill in your details (Name, Email, Phone, Password)
3. Click "Register as Devotee"
4. You'll be automatically logged in

#### For Existing Users (Login)
1. Enter your email and password
2. Click "Enter Darshan Portal"
3. Access your dashboard

#### Dashboard Features
1. **Book Darshan**: Select date, time slot, and number of devotees
2. **My Bookings**: View all your confirmed bookings
3. **Profile**: View your account information

### Project Structure

```
src/
├── components/
│   ├── login.jsx          # Login component
│   ├── signup.jsx         # Signup component
│   └── dashboard.jsx      # Main dashboard
├── contexts/
│   └── AuthContext.jsx    # Authentication context
├── utils/
│   └── helpers.js         # Utility functions
├── App.jsx               # Main app component
├── main.jsx              # Entry point
└── index.css             # Tailwind CSS imports
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Data Storage

The application uses browser localStorage to store:
- **users**: Array of registered users
- **currentUser**: Currently logged-in user
- **bookings**: Array of all darshan bookings

### Styling

The application uses a sacred theme with:
- **Primary Colors**: Orange (#f97316) and Red (#dc2626)
- **Background**: Gradient from orange to red tones
- **Typography**: Mix of English and Devanagari (Sanskrit) text
- **Icons**: Emoji-based for universal compatibility

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### License

This project is created for educational purposes.

---

**🙏 ॐ साईं राम 🙏**

*"सबका मालिक एक" - Sabka Malik Ek*

May Sai Baba bless you with peace and prosperity.
