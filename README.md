# MoodTech - Daily Mood Tracking Platform

![MoodTech Logo](apps/mobile/assets/images/icon.png)

A comprehensive mood tracking platform designed to help users monitor their emotional wellbeing over time. Track your mood against actionable data. Built as a monorepo using Turborepo for optimal development workflow.

## ✨ Features

- **Daily Mood Check-ins**: Record your emotional state with customizable notes
- **Interactive Calendar**: View and analyze your mood history
- **Personal Analytics**: Track patterns and gain insights from your mood data
- **Secure Authentication**: Keep your personal data private and secure
- **Beautiful UI**: Calming, thoughtfully designed interfaces

## 🧰 Tech Stack

- **Frontend**: React Native with Expo, TypeScript, UI Kitten
- **Web Applications**: Next.js
- **Backend**: NestJS with TypeScript
- **Database**: PostgreSQL
- **State Management**: Zustand with AsyncStorage persistence
- **Data Fetching**: React Query
- **Monorepo Management**: Turborepo

## 📱 Applications

This monorepo contains the following applications:

- `mobile`: React Native mobile application (iOS/Android)
- `web`: Next.js web dashboard
- `backend`: NestJS API server
- `docs`: Next.js documentation site

## 🏗️ Project Structure

```
MoodTech/
├── apps/
│   ├── mobile/       # React Native mobile app
│   ├── web/          # Next.js web dashboard
│   ├── backend/      # NestJS API server
│   └── docs/         # Documentation site
├── packages/
│   ├── shared/       # Shared types and utilities
│   ├── ui/           # Shared UI components
│   ├── eslint-config/# ESLint configurations
│   └── typescript-config/ # TypeScript configurations
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- Yarn package manager
- Docker (for backend development)

### Installation

1. Clone the repository

    ```bash
    git clone https://github.com/Tcadle434/MoodTech.git
    cd MoodTech
    ```

2. Install dependencies

    ```bash
    yarn install
    ```

3. Start development servers

    ```bash
    # Run all applications
    yarn dev

    # Run with database (for full-stack development)
    yarn dev:with-db

    # Run specific applications
    yarn workspace mobile dev
    yarn workspace web dev
    yarn workspace backend dev
    ```

## 📱 Mobile Application

The mobile app provides a seamless experience for recording daily moods and viewing insights:

- **Daily Check-in**: Simple interface for recording your mood
- **Calendar View**: Interactive calendar showing your mood history
- **Profile**: Statistics and personalized insights

To run the mobile app independently:

```bash
cd apps/mobile
yarn dev
```

## 🛠️ Development Workflow

### Building

```bash
# Build all applications
yarn build

# Build specific application
yarn workspace mobile build
```

### Testing

```bash
# Run all tests
yarn test

# Test specific application
yarn workspace mobile test
```

### Linting

```bash
# Lint all code
yarn lint

# Lint specific application
yarn workspace mobile lint
```

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add some amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Turborepo](https://turbo.build/repo)
- UI Components from [UI Kitten](https://akveo.github.io/react-native-ui-kitten/)
- Mobile framework by [Expo](https://expo.dev)
