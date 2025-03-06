# MoodTech Project Context

## Project Overview
MoodTech is a daily mood tracking app that correlates user mood with various health and lifestyle data points.

### Core Features
- Daily mood check-in (happy, neutral, sad)
- Note input with each mood selection
- Calendar view of historical moods
- Profile page with stats and settings

### Tech Stack
- **Frontend**: React Native with Expo and TypeScript
- **UI Components**: UI Kitten
- **Navigation**: React Navigation
- **State Management**: Zustand with AsyncStorage persistence
- **Data Fetching**: React Query with AsyncStorage
- **Backend**: NestJS with TypeScript
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Monorepo**: Using Turborepo

### Implementation Phases
1. Core workflow (mood selection, notes, calendar view) ✅
2. Authentication ✅
3. Basic profile page ✅
4. Later: Health data integrations (HealthKit, Google Fit)
5. Later: Analytics and AI-driven suggestions
6. Later: Subscription payments (Stripe)

### Project Structure
- **apps/mobile**: React Native mobile application
  - **/app**: Main routes and screens
  - **/store**: Zustand state management
  - **/theme**: UI Kitten theme customization
  - **/components**: Reusable UI components
- **apps/backend**: NestJS backend application
  - **/src/auth**: Authentication logic
  - **/src/users**: User management
  - **/src/moods**: Mood entries management
- **packages/shared**: Shared types and utilities

### Development Commands
```bash
# Root turbo commands
yarn dev        # Run both frontend and backend in development mode
yarn build      # Build all packages and apps
yarn lint       # Run linters across all packages and apps
yarn check-types # Run TypeScript checks across all packages and apps

# Mobile app
cd apps/mobile
yarn dev        # Start Expo development server
yarn ios        # Start Expo development server with iOS simulator
yarn android    # Start Expo development server with Android emulator

# Backend
cd apps/backend
docker-compose up -d        # Start PostgreSQL database
yarn start:dev              # Start NestJS in development mode with hot reload
yarn build                  # Build the backend for production
yarn test                   # Run backend tests

# Complete development workflow
cd /Users/thomascadle/MoodTech
# Start everything (database, backend and frontend) with a single command
yarn dev:with-db
```

### Code Style Preferences
- Use TypeScript for type safety
- Functional components with hooks for React Native
- Use UI Kitten components for consistent UI
- Leverage Zustand for simple state management