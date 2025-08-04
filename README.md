# LMS Frontend

A modern Learning Management System (LMS) frontend built with React, TypeScript, and Tailwind CSS. This application provides a complete learning experience with user authentication, course management, and progress tracking.

## Features

### Authentication
- User registration and login
- JWT token management
- Protected routes
- Automatic token refresh

### Dashboard
- View enrolled courses
- Track course progress
- Quick access to continue learning

### Course Management
- Browse all available courses
- Enroll in courses
- View course details and modules
- Mark lessons as completed

### Profile Management
- View and edit user information
- See enrolled courses with progress
- Update personal details

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Backend API**: Django REST Framework (deployed at https://lms-backend-xpwc.onrender.com)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd lms-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`.

### Available Scripts

- `npm start` - Start the development server
- `npm run build` - Build the application for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App (not recommended)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout wrapper
│   ├── Navigation.tsx  # Navigation bar
│   └── ProtectedRoute.tsx # Authentication guard
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state management
├── pages/              # Page components
│   ├── Login.tsx       # Login page
│   ├── Signup.tsx      # Registration page
│   ├── Dashboard.tsx   # Dashboard page
│   ├── Courses.tsx     # Course listing page
│   ├── CourseDetails.tsx # Course detail page
│   └── Profile.tsx     # User profile page
├── services/           # API services
│   └── api.ts         # API client and endpoints
├── types/              # TypeScript type definitions
│   └── index.ts       # Application types
└── utils/              # Utility functions
```

## API Integration

The frontend communicates with the Django REST API backend deployed at:
`https://lms-backend-xpwc.onrender.com`

### Key API Endpoints

- **Authentication**: `/auth/login/`, `/auth/signup/`, `/auth/logout/`
- **User**: `/auth/user/`
- **Courses**: `/courses/`, `/courses/{id}/`, `/courses/enrolled/`
- **Lessons**: `/lessons/{id}/`, `/lessons/{id}/complete/`

## Features in Detail

### Authentication Flow
1. Users can register with email, username, and password
2. Login with email and password
3. JWT tokens are stored in localStorage
4. Automatic token refresh on API calls
5. Protected routes redirect to login if not authenticated

### Course Management
1. View all available courses on the Courses page
2. Enroll in courses with a single click
3. View course details with modules and lessons
4. Mark lessons as completed/incomplete
5. Track progress across all enrolled courses

### Dashboard
1. Personalized welcome message
2. Overview of enrolled courses
3. Progress tracking for each course
4. Quick access to continue learning

### Profile Management
1. View current user information
2. Edit personal details (name, email)
3. View enrolled courses with progress
4. Role-based information display

## Styling

The application uses Tailwind CSS for styling with custom utility classes:
- `.btn-primary` - Primary button styling
- `.btn-secondary` - Secondary button styling
- `.card` - Card container styling
- `.input-field` - Form input styling

## Error Handling

- Comprehensive error handling for API calls
- User-friendly error messages
- Loading states for better UX
- Graceful fallbacks for failed requests

## Security

- JWT token-based authentication
- Automatic token refresh
- Protected routes for authenticated content
- Secure API communication with HTTPS

## Deployment

To build the application for production:

```bash
npm run build
```

The built files will be in the `build/` directory, ready for deployment to any static hosting service.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
