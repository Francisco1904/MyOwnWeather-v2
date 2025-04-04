# MyOwnWeather v2 🌤️

![Status](https://img.shields.io/badge/Status-Work%20In%20Progress-yellow)
![Version](https://img.shields.io/badge/version-2.0-blue)
![Built with](https://img.shields.io/badge/built%20with-Next.js-black)

## 📌 Project Overview

**Project Name:** "MyOwnWeather v2 | Modern Weather App"

## 🌟 Preview

### Light Mode

![Weather App Light Theme](screenshots_preview/mockup_light.png)

### Dark Mode

![Weather App Home Dark Theme](screenshots_preview/mockup_dark.png)

## 🚀 Live Demo

[Coming Soon] - Experience the app in action!

## 🏗️ Project Role

This project was developed as a solo effort, combining my own design work with AI-assisted suggestions from v0.dev to create a polished, modern weather application.

## ✨ Description

**MyOwnWeather-v2** is a weather app that fetches and displays current weather data. In this version, I focused on improving the overall design, usability, and performance from [MyOwnWeather (v1)](https://github.com/Francisco1904/MyOwnWeather). By leveraging modern front-end practices and integrating AI suggestions via v0.dev, this app provides a clean and responsive interface.

## 🌟 Key Features

- **Intuitive UI/UX**: Clean navigation and user-friendly interface with clear visual hierarchy
- **Responsive Design**: Custom breakpoints for optimal viewing on mobile, tablet, and desktop devices
- **Real-time Weather Data**: Current conditions, hourly and daily forecasts from WeatherAPI
- **User Authentication**: Full-featured authentication system with Firebase
- **Favorites Management**: Save and manage multiple locations
- **Theme Switching**: Optimized light and dark themes with smooth transitions
- **Geolocation Support**: Get weather for your current location
- **Search Functionality**: Find weather for any location worldwide
- **Smooth Animations**: Enhanced UX with Framer Motion animations
- **Persistent Storage**: User preferences saved in Firestore
- **Mobile-First Design**: Perfect experience on phones and tablets
- **Accessibility Compliant**: Designed for all users with proper contrast and focus states

## 📑 Table of Contents

1. [Recent Improvements](#recent-improvements)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Getting Started](#getting-started)
5. [Project Structure](#project-structure)
6. [Future Improvements](#future-improvements)
7. [License](#license)
8. [Contact Information](#-contact-information)

---

## Recent Improvements

- **Enhanced Dark Mode**: Optimized dark theme with appropriate contrast and color schemes for all components
- **Consistent UI**: Unified styling across all pages including authentication screens
- **Improved Scrollbars**: Custom styled scrollbars that respect theme changes and don't interfere with navigation
- **Authentication Flow**: Streamlined login, signup, and password reset processes with consistent design
- **Visual Feedback**: Better loading states, animations, and user interaction responses
- **Accessibility**: Improved focus states and contrast for better usability

## Motivation

After building the original version of MyOwnWeather (v1) using VSCode, I recognized the need for a more polished UI and better user experience. I experimented with v0.dev to generate an improved interface, then iterated on the result by hand using tools like Cursor and VSCode. This project serves as a testament to my growth as a front-end developer and my commitment to continuously improving my work.

---

## Features

- Real-time weather data with WeatherAPI API
- Current weather conditions display
- Hourly and daily forecasts
- Location search functionality
- Geolocation support
- User accounts with favorites management
- Responsive design for all devices
- Dark/light mode theme support
- Smooth animations with Framer Motion
- Firebase authentication and data storage

---

## 🏗️ Tech Stack

### Frontend:

- **Next.js 14** (App Router)
- **TypeScript** for type safety
- **TailwindCSS** for styling
- **Framer Motion** for animations
- **shadcn/ui** components
- **Lucide React** icons
- **React Context API** for state management

### Backend & Services:

- **WeatherAPI** for weather data
- **Firebase** (Authentication, Firestore)
- **Google Cloud Platform** for location services

### Development & Deployment:

- **Vercel** for hosting and analytics
- **Git & GitHub** for version control
- **ESLint & Prettier** for code quality
- **Next.js App Router** for routing and SSR/CSR

---

## 🔧 Getting Started

### Prerequisites

- **Node.js** 18.17 or later
- **npm** or **pnpm** package manager
- WeatherAPI and Firebase accounts

### Setup Instructions

1. Clone the repository

   ```sh
   git clone https://github.com/your-username/weather-app.git
   cd weather-app
   ```

2. Install dependencies

   ```sh
   npm install
   # or
   pnpm install
   ```

3. Create a `.env.local` file in the root directory with your API keys:

   ```
   NEXT_PUBLIC_WEATHER_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
   ```

   You can get a free API key from [WeatherAPI](https://www.weatherapi.com/) and set up a Firebase project at [Firebase Console](https://console.firebase.google.com/)

4. Start the development server

   ```sh
   npm run dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the app

---

## 🏗️ Project Architecture

### Architecture Overview

The project follows a **component-based architecture** with clear separation of concerns:

- **Pages:** Container components that represent full pages in the application
- **Components:** Reusable UI elements that compose the pages
- **Context:** State management for user settings, authentication and weather data
- **Services:** API communication and data processing
- **Utils:** Helper functions for formatting and calculations

### Project Structure

```
weather-app/
├── app/                  # Next.js App Router
│   ├── auth/             # Authentication pages
│   │   ├── login/        # Login page
│   │   ├── signup/       # Signup page
│   │   └── reset-password/ # Password reset
│   ├── details/          # Detailed forecast page
│   ├── search/           # Location search page
│   ├── settings/         # User settings
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── weather/          # Weather-specific components
│   └── theme-provider.tsx # Theme provider component
├── lib/                  # Utility functions and services
│   ├── context/          # React context providers
│   ├── services/         # API services
│   └── utils.ts          # Helper functions
├── public/               # Static assets
├── screenshots_preview/  # Preview screenshots
└── .env.example          # Example environment variables
```

---

## 🎨 Styling Architecture

This project uses a combination of TailwindCSS and shadcn/ui for a consistent, maintainable styling system:

### Structure

- **Global Styles**: CSS variables for theming in `globals.css`
- **Component Styling**: Tailwind utility classes with consistent naming conventions
- **Dark Mode**: Next-themes for seamless theme switching
- **Custom Components**: Extended shadcn/ui components with app-specific styling
- **Animations**: Framer Motion for fluid transitions and interactions

### Benefits

- **Maintainability**: Easy to update and extend
- **Performance**: Minimal CSS output with utility-first approach
- **Consistency**: Design tokens ensure visual harmony
- **Developer Experience**: Intuitive class naming and organization

---

## 🔥 Challenges & Solutions

### Roadblocks Faced & Fixes:

1. **Issue: Inconsistent layout across device sizes**

   - ✅ **Solution:** Implemented responsive design with careful breakpoints and flexible layouts

2. **Issue: Authentication flow UX problems**

   - ✅ **Solution:** Redesigned login/signup process with clear error handling and feedback

3. **Issue: Dark mode implementation complexities**

   - ✅ **Solution:** Used CSS variables and next-themes for smooth transitions between themes

4. **Issue: Performance with large weather datasets**

   - ✅ **Solution:** Implemented data caching and optimistic UI updates

5. **Issue: Mobile navigation challenges**

   - ✅ **Solution:** Created a custom bottom navigation bar optimized for thumb reach

6. **Issue: iOS safe area complications**

   - ✅ **Solution:** Applied proper viewport settings and CSS variables for device notches

7. **Issue: Firestore data structuring for user favorites**

   - ✅ **Solution:** Designed efficient schema for storing and retrieving location data

8. **Issue: Weather API rate limiting**
   - ✅ **Solution:** Implemented proper caching and request throttling

---

## 📈 Future Improvements

- Log-in functionality ✅
- Multiple location saving ✅
- Weather alerts and notifications
- More detailed weather statistics and charts
- Offline support with PWA capabilities
- Location-based weather alerts
- Custom user themes
- Weather widget for embedding

---

## 📝 License

This project is licensed under the [MIT License](./LICENSE). Feel free to use, modify, and distribute this project as per the terms of the license.

---

## 📬 Contact Information

- **GitHub:** [Francisco1904](https://github.com/Francisco1904)
- **Email:** [franciscopontes94@gmail.com](mailto:franciscopontes94@gmail.com)

---
