# Patrones Hermosos - Administrative Platform
<img width="1887" height="939" alt="image" src="https://github.com/user-attachments/assets/3e2ef8e8-e061-4d61-b168-67a45209d78a" />

A comprehensive web application for managing the Patrones Hermosos educational program, providing tools for coordinators to manage participants, mentors, collaborators, and program logistics.

## 🌟 Features

- **User Authentication & Authorization**: Role-based access control for different user types
- **Participant Management**: Complete registration and tracking system for program participants
- **Mentor & Collaborator Management**: Tools to assign and manage mentors and collaborators
- **Group Management**: Create and manage study groups with capacity controls
- **Diploma Generation**: Automated PDF diploma generation for program graduates
- **Data Visualization**: Interactive charts and statistics for program analytics
- **Multi-language Support**: English and Spanish group management
- **File Upload Management**: Secure PDF document handling for permissions and announcements

## 🚀 Tech Stack

### Frontend

- **React 18** with Vite
- **React Router** for navigation
- **React Hook Form** for form management
- **Recharts** for data visualization
- **Axios** for API communication
- **JWT** for authentication

### Backend

- **Node.js** with Express.js
- **PostgreSQL** database
- **JWT** authentication
- **Multer** for file uploads
- **PDF-lib** for diploma generation
- **Bcrypt** for password hashing

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/patronesHermososWebsite.git
cd patronesHermososWebsite
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database Configuration
DB_USER=postgres
DB_HOST=localhost
DB_NAME=patroneshermosos
DB_PASSWORD=your_password_here
DB_PORT=5432

# JWT Configuration
JWT_SECRET=your-very-secure-jwt-secret-key-here
JWT_EXPIRES_IN=1d

# Server Configuration
PORT=8000
NODE_ENV=development

# Email Configuration (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
```

### 3. Database Setup

1. Create a PostgreSQL database named `patroneshermosos`
2. Run the database schema(included in the `schema.sql`)

### 4. Backend Setup

```bash
cd server
npm install
npm start
```

The server will run on `http://localhost:8000`

### 5. Frontend Setup

```bash
cd client
npm install
npm run dev
```

The client will run on `http://localhost:5173`

## 🏗️ Project Structure

```
patronesHermososWebsite/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── context/        # React context providers
│   │   ├── styles/         # CSS stylesheets
│   │   └── utils/          # Utility functions
│   └── public/             # Static assets
├── server/                 # Express.js backend
│   ├── routes/             # API route handlers
│   ├── middleware/         # Custom middleware
│   ├── config/             # Configuration files
│   ├── diplomas/           # PDF templates for diplomas
│   └── uploads/            # File upload storage
└── README.md
```

## 🔐 User Roles

### Admin (Role 0)

- National-level coordinator
- Can view all sedes and manage the entire system
- Access to comprehensive analytics and reports
- Can generate diplomas for all sedes

### Sede Coordinator (Role 1)

- Regional coordinator for a specific sede
- Manages participants, mentors, and collaborators for their sede
- Can generate diplomas for their sede participants
- Access to sede-specific analytics

## 📊 Key Features Explained

### Participant Management

- Online registration with file upload for parental permissions
- Status tracking (Pending, Accepted, Rejected)
- Email notifications for status changes
- Group assignment and management

### Group Management

- Create groups by language (Spanish/English) and skill level
- Assign instructors, facilitators, and mentors
- Capacity management and waiting lists
- Real-time participant tracking

### Diploma Generation

- Automated PDF generation using custom templates
- Batch processing for multiple participants
- Customized with participant names, sede information, and dates
- ZIP file downloads for easy distribution

### Analytics Dashboard

- Interactive charts showing program statistics
- Role-based data filtering
- Export capabilities for reporting
- Real-time data updates

## 🛠️ API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Participants

- `GET /api/participantes/parents` - Get participants with guardian info
- `POST /api/participantes` - Register new participant
- `PUT /api/participantes/:id` - Update participant
- `DELETE /api/participantes/:id` - Delete participant

### Groups

- `GET /api/grupos` - Get all groups
- `POST /api/grupos` - Create new group
- `GET /api/grupos/:id/listado` - Get group members
- `POST /api/grupos/:id/participantes` - Add participant to group

### Diplomas

- `GET /api/diplomas/generate` - Generate diplomas (role-based)

## 🔒 Security Features

- JWT-based authentication
- Role-based access control
- Password hashing with bcrypt
- File upload validation
- SQL injection protection
- CORS configuration

## 🌐 Deployment

### Production Environment Variables

Ensure these are properly set in production:

```env
NODE_ENV=production
JWT_SECRET=your-production-jwt-secret
DB_PASSWORD=your-production-db-password
```

### Build Commands

```bash
# Build frontend
cd client
npm run build

# Start backend in production
cd server
npm start
```

