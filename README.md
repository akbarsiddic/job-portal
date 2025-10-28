# Job Portal

A modern job portal application built with Next.js 16 App Router, enabling role-based job management and browsing.

## Project Overview

This is a client-side job portal prototype that provides distinct experiences for administrators and users:

- **Authentication**: Hardcoded credential validation (admin/user roles) stored in localStorage
- **Admin Panel**: Create, edit, and delete job postings through an intuitive modal form interface
- **User Portal**: Browse and view detailed job listings
- **Responsive Design**: Modern UI with Tailwind CSS 4 theming
- **Navigation**: Clean navbar with avatar dropdown for user actions

## Tech Stack Used

- **Framework**: [Next.js 16](https://nextjs.org) (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI primitives (Avatar, Dropdown, Dialog, Select, etc.)
- **Icons**: Lucide React
- **Utilities**: 
  - `class-variance-authority` for component variants
  - `clsx` and `tailwind-merge` for conditional styling
  - `date-fns` for date formatting
  - `react-day-picker` for date selection

## How to Run Locally

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd job-portal
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open the application**:
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser

5. **Login credentials**:
   - Admin: Use admin credentials to access job management features
   - User: Use user credentials to browse job listings

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
