# My Amast Dashboard

A modern, production-ready React TypeScript dashboard application with a futuristic UI design. Built with Vite, React Router v6, Tailwind CSS, shadcn/ui, and Zustand for state management.

## 🚀 Features

- **Modern Authentication**: JWT-based login with automatic token management
- **User Management**: Full CRUD operations for user accounts
- **Analytics Dashboard**: Real-time charts and statistics
- **Responsive Design**: Mobile-first approach with dark/light mode
- **Type Safety**: Full TypeScript implementation with Zod validation
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **State Management**: Lightweight Zustand stores
- **Form Handling**: React Hook Form with validation
- **Charts**: Interactive charts using Recharts

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- Backend API running on `http://localhost:3000`

## 🚀 Quick Start

1. **Clone and Install**
   ```bash
   # Install dependencies
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

2. **Environment Setup**
   ```bash
   # Create environment file
   copy .env-sample .env
   ```
   
   Update `.env` with your API base URL:
   ```env
   VITE_API_BASE_URL=http://localhost:3000
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open Browser**
   Navigate to `http://localhost:5173`

## 🔐 Demo Credentials

The application comes with pre-filled demo credentials:
- **Email**: `npm run deAdmin@123.com`
- **Password**: `MyPassword`

## 📁 Project Structure

```
src/
├── app/                    # App configuration
│   ├── router.tsx         # Route definitions
│   └── providers.tsx      # App providers
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── charts/           # Chart components
│   ├── tables/           # Table components
│   ├── forms/            # Form components
│   ├── layout/           # Layout components
│   └── feedback/         # Feedback components
├── controllers/          # Business logic controllers
├── hooks/               # Custom React hooks
├── models/              # TypeScript types & Zod schemas
├── pages/               # Page components
│   ├── Login/
│   ├── Dashboard/
│   └── Users/
├── services/            # API services
├── state/               # Zustand stores
├── styles/              # Global styles
└── utils/                # Utility functions
```

## 🔌 API Integration

The application integrates with a backend API with the following endpoints:

### Authentication
- `POST /auth/login` - User login

### Users
- `GET /users` - List all users
- `GET /users/:id` - Get user details
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

## 🎨 UI Components

Built with shadcn/ui components:
- **Layout**: Card, Button, Input, Label
- **Forms**: Select, Switch, Form validation
- **Feedback**: Dialog, Toast, Skeleton, Badge
- **Navigation**: Dropdown Menu, Sidebar
- **Data Display**: Table, Charts

## 📊 Dashboard Features

- **Statistics Cards**: Total users, verified users, new users
- **Charts**: User verification status, gender distribution
- **Recent Users**: Latest registered users table
- **Real-time Updates**: Automatic data refresh

## 👥 User Management

- **User List**: Searchable, sortable, paginated table
- **User Creation**: Form with validation
- **User Editing**: Update user information
- **User Deletion**: Confirmation dialog
- **Filters**: By verification status, gender

## 🌙 Theme Support

- **Light/Dark Mode**: Toggle with persistence
- **Responsive Design**: Mobile-first approach
- **Custom Animations**: Smooth transitions

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Code Quality

- **ESLint**: Configured for React + TypeScript
- **Prettier**: Code formatting
- **TypeScript**: Strict mode enabled
- **Zod**: Runtime validation

## 🚀 Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting provider

3. **Update environment variables** for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the code comments
- Open an issue on GitHub

---

**My Amast Dashboard** - Built with ❤️ using modern React patterns
