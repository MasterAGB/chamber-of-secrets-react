# Chamber of Secrets

Chamber of Secrets is a secure vault manager built for mobile platforms using React Native. It allows users to create and manage their vaults with ease, providing a high level of security and user-friendly interface.

## Features

- **Secure Vault Creation**: Users can create a new secure vault with a unique login and password.
- **Vault Access**: Users can access their existing vault using their credentials.
- **Data Persistence**: Utilizes Immudb's immutable database to store user data securely.
- **Real-Time Synchronization**: Changes to the vault are synchronized with the database in real-time.
- **User Interface**: A clean and intuitive interface for managing vault entries.
- **Developer Friendly**: Includes a developer mode for quick access to the user password table.

## Installation

To run Chamber of Secrets on your local machine, you need to have Node.js, npm/yarn, and Expo CLI installed. Follow these steps to set up the environment:

```bash
# Clone the repository
git clone https://github.com/yourusername/chamber-of-secrets.git

# Go into the repository
cd chamber-of-secrets

# Install dependencies
npm install

# Start the development server
npx expo start --web
```

## Usage
After running the project, you can:

- Create a new vault by entering a new login and password.
- Access an existing vault by providing the corresponding credentials.
- Add, edit, or remove entries within the user password table.
- Synchronize changes with the database or reset to the last saved state.
- Sign out of the vault.

## Development Challenges

While working on the "Chamber of Secrets" app, several challenges were encountered which became key learning points in the development process. Here's a rundown of the challenges faced:

1. **Project Setup and Dependencies**: Initially, setting up the project without using online tools and linking it to a local folder on the computer was a hurdle.

2. **Environment Configuration**:
    - Downloading and setting up WebStorm.
    - Creating configurations for Android and Web Browser builds, which although time-consuming, eventually worked for the empty project.

3. **Repeated Installation Commands**: Encountered dependency issues which led to repeatedly executing the commands to delete `node_modules`, reset package lock files, and reinstall packages.

4. **'Crypto' Module Not Found**: Faced a significant issue with the random key generation due to the 'crypto' module being outdated and incompatible dependencies with `sjcl` and `react-native-randombytes`.

5. **Dependency Conflicts with Expo**:
    - After installing `react-native-get-random-values`, had to deal with incompatible dependencies between the installed version of Expo and other packages.
    - The resolution process involved using `expo doctor --fix-dependencies` and resorting to native implementations when necessary.

6. **Expo Modules and Updates**:
    - Added the Expo status bar and updated the Expo CLI following guidance from the Expo blog.
    - Encountered and resolved a Node.js error related to OpenSSL 3.0 compatibility by updating Node.js and using the `--openssl-legacy-provider`.

7. **Navigation and Developer Tools**:
    - Installed navigation dependencies with `@react-navigation/native`.
    - Added React Developer Tools for Chrome for better debugging support.

8. **File System and Sharing Features**: Integrated `expo-file-system` and `expo-sharing` for file management, including updating app permissions for file access.

9. **Asynchronous File Handling**: Tackled challenges related to asynchronous file handling in the app's logic.

10. **Auto-Fill Password Issues**: Dealt with Chrome's auto-fill interfering with password inputs and found a way to disable it.

11. **Visibility of Passwords**: Improved user experience by making passwords visible on demand, yet faced further issues with Chrome's auto-fill.

12. **Mobile Testing and SDK Updates**:
    - Required SDK update from 46 to 49 for mobile testing, which led to a major issue: "Unknown option 'watcher'" error. This resulted in reverting back to SDK 47 and upgrading other packages.

13. **App Icons and Favicon**: Configured the app icon, adaptive icon, and favicon for branding consistency.

14. **Cross-Platform Path Issues**: Resolved a file path issue due to differences in case sensitivity between Windows and Unix-like systems.

15. **Safe Area Handling**: Installed `react-native-safe-area-context` to handle device-specific safe area insets.

16. **Document Picker Variable**: Addressed a missing variable issue with the document picker by using `expo-document-picker`, which worked but required some fine-tuning.

17. **Building and Deployment**: After overcoming these challenges, the focus shifted to building and deploying the app, with the anticipation of potential new hurdles.

18. **Building the Application:**:
    - Initially used the command `npm install -g eas-cli` to install the Expo Application Services (EAS) CLI globally.
    - Created a build for Android using `eas build -p android` which generated an Android App Bundle (AAB) file.
    - Learned that to produce an APK file, the command needed was `eas build -p android --profile preview`.
     
19. **Expo Doctor Warnings:**:
    - Encountered a warning from `expo doctor` stating:
     > The package "expo-modules-core" should not be installed directly in your project. It is a dependency of other Expo packages, which will install it automatically as needed.
    - This warning indicated a misconfiguration in the `package.json`, where `expo-modules-core` was included as a direct dependency unnecessarily.


These challenges were instrumental in enhancing the problem-solving skills necessary for modern app development, particularly in a React Native environment.
