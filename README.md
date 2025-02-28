# Nike Challenge

## Overview
The Nike Challenge is a web application that allows players to register, participate in challenges, and track their performance. The application saves player profiles and challenge results, and it can send this data via email. If there is no internet connection, the application queues the emails to be sent later when connectivity is restored.

## Project Structure
```
nike-challenge
├── src
│   ├── index.html          # Main HTML structure of the application
│   ├── css
│   │   └── styles.css      # Styles for the application
│   ├── js
│   │   ├── main.js         # Main JavaScript file for game logic
│   │   ├── storage.js      # Functions for local storage management
│   │   ├── emailQueue.js   # Manages the email queue
│   │   └── networkStatus.js # Monitors network connectivity
│   └── server
│       ├── api.js          # Server API endpoints
│       └── emailService.js  # Logic for sending emails
├── data
│   └── queue.json          # Storage for the email queue
├── package.json             # npm configuration file
├── .env                     # Environment variables
└── README.md                # Project documentation
```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd nike-challenge
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage
1. Start the server:
   ```
   npm start
   ```
2. Open `src/index.html` in your web browser to access the application.

## Features
- Player registration and profile management
- Challenge participation with time tracking
- Email notifications for challenge results
- Offline email queuing for later sending

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.