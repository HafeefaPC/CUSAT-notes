# 📚 CUSAT Notes - Study Material Repository

A comprehensive study material management system for CUSAT (Cochin University of Science and Technology) students, featuring Telegram integration, admin dashboard, and modern web technologies.

## 🌟 Features

### 🎯 Core Functionality
- **Study Material Repository**: Centralized platform for accessing and sharing study materials
- **Telegram Integration**: Automated file collection from Telegram groups
- **Admin Dashboard**: Content moderation and management system
- **Advanced Filtering**: Filter by department, semester, and subject
- **Search Functionality**: Real-time search across all materials
- **File Preview**: In-browser document preview capabilities
- **Responsive Design**: Mobile-first approach with modern UI/UX

### 🔐 Authentication & Security
- **JWT-based Authentication**: Secure admin login system
- **Middleware Protection**: Route-level security for admin pages
- **HTTP-only Cookies**: Secure token storage
- **Role-based Access Control**: Admin-only content management

### 📱 User Experience
- **Dark/Light Mode**: Theme switching with system preference detection
- **Pagination**: Efficient content loading with pagination
- **Loading States**: Smooth user experience with loading indicators
- **Toast Notifications**: Real-time feedback for user actions
- **Error Handling**: Comprehensive error management

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.1.6** - React framework with App Router
- **React 19.0.0** - Latest React with concurrent features
- **TypeScript 5.7.3** - Type-safe development
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **shadcn/ui** - Modern component library
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **next-themes** - Theme management

### Backend & Database
- **Supabase** - Backend-as-a-Service with PostgreSQL
- **JWT Authentication** - Secure token-based auth
- **Telegram Bot API** - File collection and management
- **Next.js API Routes** - Serverless backend functions

### Development Tools
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing
- **Turbopack** - Fast development builds

## 🏗️ Architecture

### Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes
│   │   ├── admin/         # Admin-specific APIs
│   │   ├── auth/          # Authentication APIs
│   │   ├── materials/     # Material management APIs
│   │   └── download/      # File download APIs
│   ├── login/             # Authentication pages
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── AdminDashboard.tsx # Admin interface
│   ├── MaterialsGrid.tsx  # Material display
│   └── ...               # Other components
├── lib/                   # Utility libraries
│   ├── auth.ts           # Authentication logic
│   ├── supabase.ts       # Database client
│   ├── telegram.ts       # Telegram integration
│   └── utils.ts          # Helper functions
├── types/                 # TypeScript definitions
└── middleware.ts          # Route protection
```

### Data Flow
1. **File Upload**: Users upload files to Telegram group
2. **Telegram Bot**: Bot collects files and metadata
3. **Database Sync**: Files are stored in Supabase
4. **Admin Review**: Admin moderates content via dashboard
5. **Public Access**: Approved materials are displayed to users

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Telegram Bot Token

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/HafeefaPC/CUSAT-notes.git
   cd CUSAT-notes
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file with the following variables:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   # Telegram Bot Configuration
   NEXT_PUBLIC_TELEGRAM_BOT_TOKEN=your_bot_token
   NEXT_PUBLIC_TELEGRAM_GROUP_ID=your_group_id

   # Authentication
   JWT_SECRET=your_jwt_secret
   ADMIN_USERNAME=your_admin_username
   ADMIN_PASSWORD=your_admin_password
   ```

4. **Database Setup**
   - Create a Supabase project
   - Set up the materials table with the following schema:
   ```sql
   CREATE TABLE materials (
     id SERIAL PRIMARY KEY,
     telegram_file_id TEXT UNIQUE NOT NULL,
     file_id TEXT,
     telegram_message_id TEXT,
     title TEXT NOT NULL,
     type TEXT CHECK (type IN ('notes', 'question_paper')),
     department TEXT NOT NULL,
     semester TEXT NOT NULL,
     subject TEXT NOT NULL,
     uploaded_by TEXT NOT NULL,
     upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     status TEXT CHECK (status IN ('pending', 'accepted', 'rejected', 'deleted')) DEFAULT 'pending',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### For Students
1. **Browse Materials**: Use the home page to browse available study materials
2. **Filter Content**: Use the filter section to find materials by department, semester, or subject
3. **Search**: Use the search bar to find specific materials
4. **Download**: Click on materials to download or preview them

### For Admins
1. **Login**: Access the admin dashboard at `/login`
2. **Review Materials**: View all uploaded materials in the admin dashboard
3. **Moderate Content**: Accept, reject, or delete materials as needed
4. **Preview Files**: Preview files before approving them

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/check` - Check authentication status

### Materials
- `GET /api/materials` - Get approved materials (public)
- `GET /api/admin/materials` - Get all materials (admin)
- `POST /api/admin/materials/[id]/accept` - Accept material
- `POST /api/admin/materials/[id]/reject` - Reject material
- `POST /api/admin/materials/[id]/delete` - Delete material

### File Management
- `GET /api/download` - Download file
- `GET /api/proxy/[...path]` - Proxy Telegram files

## 🎨 UI Components

### Custom Components
- **AdminDashboard**: Complete admin interface with material management
- **MaterialsGrid**: Responsive grid layout for materials
- **MaterialCard**: Individual material display component
- **FilterSection**: Advanced filtering interface
- **SearchBar**: Real-time search functionality
- **Navigation**: Responsive navigation component

### UI Library
Built with shadcn/ui components:
- Button, Card, Dialog, Input, Select
- Table, Badge, Toast, Dropdown Menu
- Theme Provider with dark/light mode support

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Route Protection**: Middleware-based route protection
- **HTTP-only Cookies**: Secure cookie storage
- **Input Validation**: Server-side validation for all inputs
- **Error Handling**: Comprehensive error management
- **CORS Protection**: Proper CORS configuration

## 📱 Responsive Design

- **Mobile-first**: Optimized for mobile devices
- **Breakpoints**: Responsive design across all screen sizes
- **Touch-friendly**: Optimized for touch interactions
- **Accessibility**: WCAG compliant components

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify**: Static site deployment
- **Railway**: Full-stack deployment
- **DigitalOcean**: VPS deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Hafeefa PC**
- GitHub: [@HafeefaPC](https://github.com/HafeefaPC)
- Project Link: [https://github.com/HafeefaPC/CUSAT-notes](https://github.com/HafeefaPC/CUSAT-notes)

## 🙏 Acknowledgments

- CUSAT students for their valuable feedback
- Supabase team for the excellent backend service
- Vercel for the deployment platform
- shadcn/ui for the beautiful component library

## 📊 Project Statistics

- **Lines of Code**: 2000+ lines
- **Components**: 15+ React components
- **API Routes**: 10+ endpoints
- **Database Tables**: 1 main table with comprehensive schema
- **Dependencies**: 20+ production dependencies

---

⭐ **Star this repository if you found it helpful!**
