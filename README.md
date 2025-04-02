# MyOwnWeather v2 🌤️

![Status](https://img.shields.io/badge/Status-Work%20In%20Progress-yellow)

## 📌 Project Overview

**Project Name:** "MyOwnWeather v2"

## 🌟 Preview

![Weather App Home Screen](screenshots_preview/HOME-PAGE.png)
![Weather Forecast](screenshots_preview/DETAILS-PAGE.png)
![Location Search](screenshots_preview/SEARCH-PAGE.png)
![Settings](screenshots_preview/SETTINGS-PAGE.png)
![Log-In Page](screenshots_preview/LOGIN-PAGE.png)

**MyOwnWeather-v2** is a weather app that fetches and displays current weather data. In this version, I focused on improving the overall design, usability, and performance from MyOwnWeather (v1). By leveraging modern front-end practices and integrating AI suggestions via v0.dev, this app provides a clean and responsive interface.

## Motivation

After building the original version of MyOwnWeather (v1) using VSCode, I recognized the need for a more polished UI and better user experience. I experimented with v0.dev to generate an improved interface, then iterated on the result by hand using tools like Cursor and VSCode. This project as a testament to my growth as a front-end developer and my commitment to continuously improving my work.

---

## Features

- Real-time weather data with WeatherAPI API
- Current weather conditions display
- Hourly and daily forecasts
- Location search functionality
- Geolocation support
- Responsive design for all devices
- Dark/light mode theme support
- Smooth animations with Framer Motion

---

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Framer Motion for animations
- shadcn/ui components
- Lucide React icons
- WeatherAPI
- React Server Components
- Client-side and server-side rendering

---

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or pnpm package manager

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/your-username/weather-app.git
   cd weather-app
   ```

2. Install dependencies

   ```bash
   npm install
   # or
   pnpm install
   ```

3. Create a `.env.local` file in the root directory with your API key:

   ```
   NEXT_PUBLIC_WEATHER_API_KEY=your_api_key_here
   ```

   You can get a free API key from [WeatherAPI](https://www.weatherapi.com/)

4. Start the development server

   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the app

---

## Project Structure

```
weather-app/
├── app/                  # Next.js App Router
│   ├── details/          # Detailed forecast page
│   ├── search/           # Location search page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── weather/          # Weather-specific components
│   └── theme-provider.tsx # Theme provider component
├── hooks/                # Custom React hooks
│   └── useWeather.ts     # Weather data fetching hook
├── lib/                  # Utility functions and services
│   ├── services/         # API services
│   └── utils.ts          # Helper functions
├── public/               # Static assets
└── .env.example          # Example environment variables
```

---

## Future Improvements

- Log-in functionality
- Multiple location saving
- More detailed statistics
- Weather alerts and notifications
- Offline support with PWA capabilities

---

## License

This project is licensed under the [MIT License](./LICENSE). Feel free to use, modify, and distribute this project as per the terms of the license.

---

## 📬 Contact Information

- **GitHub:** [Francisco1904](https://github.com/Francisco1904)
- **Email:** [franciscopontes94@gmail.com](mailto:franciscopontes94@gmail.com)

---
