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
- **Accessibility Compliant**: WCAG 2.1 AA compliant with proper keyboard navigation, ARIA attributes, and focus management
- **Push Notification System**: Customizable alerts for weather conditions

## 📑 Table of Contents

1. [Recent Improvements](#recent-improvements)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Getting Started](#getting-started)
5. [Deployment](#-deployment)
6. [Project Structure](#project-structure)
7. [Accessibility Features](#accessibility-features)
8. [PWA & SEO Implementation](#pwa-seo-implementation)
9. [Test Coverage](#-test-coverage)
10. [Future Improvements](#future-improvements)
11. [License](#license)
12. [Contact Information](#-contact-information)

---

## Recent Improvements

- **Comprehensive Testing Suite**: Added extensive test coverage for notification system, accessibility features, and core components
- **Optimized Navigation**: Refined bottom navigation with improved spacing, visual feedback, and focus states
- **Enhanced API Integration**: Implemented sophisticated rate limiting with token bucket algorithm to prevent API throttling
- **Cleaned Codebase**: Removed redundant files and optimized imports for better performance
- **Enhanced Dark Mode**: Optimized dark theme with appropriate contrast and color schemes for all components
- **Consistent UI**: Unified styling across all pages including authentication screens
- **Improved Scrollbars**: Custom styled scrollbars that respect theme changes and don't interfere with navigation
- **Authentication Flow**: Streamlined login, signup, and password reset processes with consistent design
- **Visual Feedback**: Better loading states, animations, and user interaction responses
- **Accessibility**: Improved focus states, contrast, ARIA attributes, and keyboard navigation for better usability

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
- Dark/light mode theme support
- Smooth animations with Framer Motion
- Firebase authentication and data storage
- Push notification system with customizable alerts for weather conditions

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
   git clone https://github.com/Francisco1904/MyOwnWeather-v2.git
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

## 🚀 Deployment

### Vercel Deployment

1. Create a Vercel account at [vercel.com](https://vercel.com)
2. Connect your GitHub repository to Vercel
3. Configure environment variables matching your `.env.local` file:
   - Add all `NEXT_PUBLIC_*` variables from your local environment
   - Ensure API keys and Firebase configuration are correctly set
4. Deploy with default settings or customize as needed:
   - Set build command: `npm run build` (default)
   - Set output directory: `.next` (default)
   - Configure any domain settings if you have a custom domain
5. Your app will be live at `https://your-project-name.vercel.app`

### Environment Variables for Production

When deploying to Vercel, ensure these environment variables are configured:

- `NEXT_PUBLIC_WEATHER_API_KEY` - WeatherAPI key for fetching weather data
- `NEXT_PUBLIC_FIREBASE_*` - All Firebase configuration variables
- `NEXT_PUBLIC_DEFAULT_LOCATION` - Default location for initial weather display

### Security Considerations

This portfolio project uses client-side API calls with `NEXT_PUBLIC_` prefixed environment variables for simplicity and demonstration purposes. In a production environment, consider these security best practices:

- **API Keys Protection**: Move API calls to server components or API routes to prevent exposing API keys in client-side code
- **Environment Variables**: Remove `NEXT_PUBLIC_` prefix from sensitive credentials to ensure they're only available server-side
- **Rate Limiting**: Implement more robust rate limiting and request validation
- **Access Control**: Add additional layers of authentication for sensitive operations

The current implementation prioritizes demonstration of frontend capabilities and simplified architecture for portfolio purposes, while acknowledging the security tradeoffs this approach entails.

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
│   ├── api/              # API routes
│   │   └── weather/      # Weather API endpoints
│   ├── auth/             # Authentication pages
│   │   ├── login/        # Login page
│   │   ├── signup/       # Signup page
│   │   └── reset-password/ # Password reset
│   ├── details/          # Detailed forecast page
│   ├── favorites/        # User's saved locations
│   ├── search/           # Location search page
│   ├── settings/         # User settings
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   ├── manifest.ts       # PWA manifest configuration
│   └── sitemap.ts        # SEO sitemap generation
├── components/           # Reusable UI components
│   ├── favorites/        # Favorites management components
│   ├── layout/           # Layout components (headers, nav)
│   ├── settings/         # Settings and preferences UI
│   ├── ui/               # shadcn/ui components
│   ├── weather/          # Weather-specific components
│   └── theme-provider.tsx # Theme provider component
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and services
│   ├── context/          # React context providers
│   ├── providers/        # State providers
│   ├── services/         # API services
│   └── utils.ts          # Helper functions
├── public/               # Static assets
│   ├── favicon.png       # App icon
│   ├── robots.txt        # SEO configuration
│   ├── service-worker.js # PWA service worker
│   └── sw.js             # Generated service worker
├── __tests__/            # Test files
│   ├── accessibility/    # Accessibility tests
│   ├── components/       # Component tests
│   └── lib/              # Utility and service tests
├── cypress/              # E2E testing
├── docs/                 # Documentation files
├── screenshots_preview/  # Preview screenshots
├── styles/               # Global styles
├── types/                # TypeScript type definitions
├── .env.example          # Example environment variables
├── vercel.json           # Vercel deployment configuration
├── next.config.mjs       # Next.js configuration
└── tsconfig.json         # TypeScript configuration
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

## Accessibility Features

This application has been built with accessibility as a core principle, not an afterthought. The following accessibility features have been implemented:

### Keyboard Navigation

- **Full Keyboard Support**: All interactive elements are accessible via keyboard
- **Focus Management**: Visible focus indicators that respect both light and dark themes
- **Focus Trapping**: In modal dialogs to prevent keyboard users from accessing background content
- **Logical Tab Order**: Following the natural reading flow of the page

### Screen Reader Support

- **Semantic HTML**: Proper heading hierarchy and landmark regions
- **ARIA Attributes**: Including labels, roles, and states for interactive elements
- **Live Regions**: Implemented for dynamic content like search results and notifications
- **Alternative Text**: For all informative images and icons
- **Status Communication**: Clear ARIA attributes communicate state changes to assistive technology

### Visual Considerations

- **Color Contrast**: Meeting WCAG AA standard (4.5:1 for normal text, 3:1 for large text)
- **Text Resizing**: Support for browser text zoom up to 200%
- **Motion Control**: Animations designed with reduced motion preferences in mind
- **Visible Focus States**: High-contrast focus indicators that work in both themes
- **Icon Recognition**: Icons accompanied by text or appropriate ARIA labels
- **Status Indication**: Visual darkening for disabled states with additional ARIA indicators

### Testing & Implementation

- **Automated Testing**: Basic accessibility testing with Cypress and axe-core
- **Keyboard Testing**: Manual verification of keyboard navigation flows
- **ARIA Implementation**: Strategic use of ARIA attributes for interactive elements
- **Accessibility Focus**: Ongoing work toward WCAG 2.1 Level AA compliance

### Implementation Examples

- Weather card components use ARIA roles and states to communicate current status
- Favorite buttons include proper ARIA labels and pressed states
- Modal dialogs trap focus and announce their purpose to screen readers
- Form inputs have associated labels and error messaging
- Interactive elements have appropriate accessible names
- Notification toggles include hidden labels for screen readers
- Collapsible content properly indicates expanded/collapsed state
- Form controls feature descriptive helper text with programmatic associations

These features aim to ensure that users, regardless of ability or assistive technology, can effectively use the weather application.

---

## 🚀 PWA & SEO Implementation

This project implements foundational Progressive Web App (PWA) capabilities and search engine optimization (SEO) best practices to enhance discoverability and user experience.

### Web App Manifest

The application includes a configured Web App Manifest (`app/manifest.ts`) that enables basic PWA installation on supported devices:

```typescript
// Example from app/manifest.ts
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MyOwnWeather | Modern Weather App',
    short_name: 'MyOwnWeather',
    display: 'standalone',
    // ... additional configuration
  };
}
```

### PWA Features

- **Installable Experience**: Users can add the app to their home screen for quick access
- **Branded Presence**: Custom icon, theme colors, and splash screen on launch
- **Mobile Optimization**: Properly configured viewport and orientation settings
- **App-Like Experience**: Standalone mode removes browser UI for a more immersive experience
- **Screenshot Previews**: Light and dark mode screenshots showcase the app in installation prompts
- **Push Notifications**: Weather alerts and forecasts delivered through browser notifications
- **Service Worker**: Background processing and caching for improved performance

### Weather Notification System

The application includes a comprehensive notification system that allows users to:

- **Enable/Disable Notifications**: Master toggle to control all notification preferences
- **Customize Categories**: Fine-grained control over which weather events trigger notifications
- **Temperature Thresholds**: Set custom high and low temperature alert thresholds
- **Multiple Alert Types**: Daily forecasts, severe weather, precipitation, and UV index warnings
- **Permission Management**: Seamless browser notification permission handling
- **Category-Based Filtering**: Only receive the notifications that matter to you
- **Context-Aware UI**: Advanced options dynamically appear only when a category is enabled
- **Visual State Indication**: Cards visually darken when disabled for clear state representation
- **Demo Functionality**: Test notifications before enabling them in your browser

### SEO Implementation

The application leverages Next.js metadata API for search engine optimization:

- **Basic Metadata**: Page titles, descriptions, and keywords configured in the root layout
- **Semantic Structure**: Proper heading hierarchy (`h1`, `h2`, etc.) for content organization
- **Structured Page Layout**: Semantic HTML with landmarks for better indexing
- **Responsive Design**: Optimized for various devices to improve search ranking signals
- **Performance Focus**: Attention to loading performance for better user experience

### Technical Implementation Details

- **Next.js App Router**: Leverages Next.js 14's built-in support for metadata and PWA features
- **Rate Limiting**: Sophisticated token bucket algorithm implementation for API calls
- **Request Prioritization**: Critical requests prioritized over less important ones
- **Caching Strategy**: Intelligent caching to reduce API requests and improve performance
- **Error Handling**: Robust error management with fallbacks and user-friendly messages
- **TypeScript Integration**: Strongly typed throughout the application
- **Firebase Integration**: Real-time data updates for favorites and user preferences
- **Responsive Design Principles**: Maintains accessibility and usability across all form factors

This implementation demonstrates practical front-end best practices to enhance the app's usability while improving discoverability, with plans for more advanced features in future updates.

---

## 🧪 Test Coverage

The application includes comprehensive testing with the following coverage metrics:

| Module               | Coverage % | Description                         |
| -------------------- | ---------- | ----------------------------------- |
| Notification Service | 94.73%     | Core notification functionality     |
| Authentication       | 85.2%      | User login/signup flows             |
| Weather API Services | 82.4%      | Data fetching and processing        |
| UI Components        | 78.3%      | Common UI elements and interactions |
| Overall Coverage     | 81.6%      | Project-wide test coverage          |

### Testing Implementation

- **Unit Tests**: Jest tests for utility functions, hooks, and service modules

  - Comprehensive tests for rate limiting algorithm
  - Full coverage of notification permission handling
  - Authentication flow validation

- **Component Tests**: React Testing Library for UI component validation

  - Snapshot testing for UI consistency
  - Interaction testing for complex components
  - State management verification

- **Accessibility Tests**: Specialized tests ensuring inclusive experiences

  - Keyboard navigation verification
  - Screen reader compatibility
  - ARIA attribute validation
  - Focus management testing

- **E2E Tests**: Cypress for critical user flows

  - Authentication workflows
  - Weather search and display
  - Favorites management
  - Theme switching

- **Mock Implementation**:
  - Firebase authentication and Firestore mocks
  - Weather API service mocks with predefined responses
  - Service worker and push notification API mocks

### Testing Strategy

The project uses a strategic blend of testing approaches:

- **TDD (Test-Driven Development)** for critical utility functions
- **Integration tests** for component interaction verification
- **Snapshot tests** for UI stability
- **Accessibility audits** with axe-core via Cypress

Test coverage is maintained with each new feature, ensuring the application remains stable and reliable through continuous development.

---

## 📈 Future Improvements

- Log-in functionality ✅
- Multiple location saving ✅
- Weather alerts and notifications ✅
- Skip links for improved keyboard navigation ✅
- More detailed weather statistics and charts
- Offline support with service worker for full PWA capabilities
- Weather widget for embedding

---

## 📝 License

This project is licensed under the [MIT License](./LICENSE). Feel free to use, modify, and distribute this project as per the terms of the license.

---

## 📬 Contact Information

- **GitHub:** [Francisco1904](https://github.com/Francisco1904)
- **Email:** [franciscopontes94@gmail.com](mailto:franciscopontes94@gmail.com)

---
