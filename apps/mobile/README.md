# MoodTech Mobile App

![MoodTech](assets/images/icon.png)

A beautifully designed mood tracking application that helps users monitor their emotional wellbeing over time. Cross check your mood with actionable data.

## Features

- **Daily Mood Check-ins**: Record your mood with customizable notes
- **Interactive Calendar**: View your mood history with an intuitive calendar interface
- **Personal Analytics**: Track patterns and gain insights from your mood data
- **Secure Authentication**: Keep your personal data private and secure
- **Beautiful UI**: Enjoy a calming, thoughtfully designed interface

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **UI Components**: UI Kitten
- **Navigation**: React Navigation (file-based routing)
- **State Management**: Zustand with AsyncStorage persistence
- **API Integration**: React Query with fetch

## Getting Started

### Prerequisites

- Node.js (v16+)
- Yarn package manager
- iOS Simulator or Android Emulator (optional)

### Installation

1. Clone the repository

    ```bash
    git clone https://github.com/Tcadle434/MoodTech.git
    cd MoodTech/apps/mobile
    ```

2. Install dependencies

    ```bash
    yarn install
    ```

3. Start the development server
    ```bash
    yarn dev
    ```

### Running on Devices

- **iOS Simulator**:

    ```bash
    yarn ios
    ```

- **Android Emulator**:

    ```bash
    yarn android
    ```

- **Physical Device**: Scan the QR code with Expo Go app

## Project Structure

- `/app`: Main screens and routes (using file-based routing)
- `/components`: Reusable UI components
- `/contexts`: React contexts for global state
- `/api`: API service functions
- `/store`: Zustand store configurations
- `/theme`: UI theming and styling
- `/hooks`: Custom React hooks

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add some amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Expo](https://expo.dev)
- UI Components from [UI Kitten](https://akveo.github.io/react-native-ui-kitten/)
- Part of the MoodTech monorepo using Turborepo
