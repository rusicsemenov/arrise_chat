# Arrise

A real-time chat application built with React and Node.js, featuring WebSocket-based messaging, room management, and user authentication. This is a test project demonstrating modern web development practices with real-time communication.

## 🚀 Features

### Core Functionality

-   **Real-time Messaging**: WebSocket-based instant messaging with live updates and automatic message synchronization
-   **Chat Rooms**: Create, join, and manage multiple chat rooms with descriptions
-   **User Authentication**: Secure user registration and login with bcrypt password hashing
-   **Room Management**: Create and delete chat rooms with real-time updates across all clients
-   **User Management**: View and manage users in the system (Redux-based state management)
-   **System Messages**: Automatic notifications when users join rooms with celebration emoji (🎉)
-   **Message History**: Stores last 20 messages per room with automatic cleanup

### UI/UX Features

-   **Modern UI**: Responsive design with SCSS styling and flexbox layouts
-   **Theme Toggle**: Light/dark mode support with localStorage persistence
-   **Rive Animations**: Background animations that adapt to theme changes
-   **Confetti Effects**: JSConfetti animations triggered by celebration messages (🎉)
-   **User Avatars**: Color-coded user avatars based on username hash
-   **Message Display**:
    -   Date separators for multi-day conversations
    -   User info display with avatars
    -   Timestamp display
    -   Distinction between user and system messages
    -   Auto-scroll to bottom on new messages
-   **Toast Notifications**: User-friendly error and success messages
-   **Protected Routes**: Automatic redirection to welcome page if not authenticated
-   **Modal Dialogs**: Room creation modal with form validation
-   **Hamburger Menu**: Navigation menu with theme toggle and logout

### Technical Features

-   **Type Safety**: Full TypeScript implementation for both frontend and backend
-   **State Management**: Redux Toolkit with Redux Saga for side effects
-   **Automatic Reconnection**: WebSocket client with exponential backoff reconnection (max 10 attempts)
-   **Keep-Alive**: Automatic ping/pong mechanism (10 second intervals)
-   **Debounced Writes**: Database writes are debounced (5 second delay) to optimize performance
-   **Input Validation**:
    -   Username: minimum 3 characters, maximum 20 characters
    -   Password: minimum 6 characters
    -   Room name: maximum 20 characters
    -   Room description: maximum 200 characters
    -   Message: maximum 200 characters
-   **Code Quality**: ESLint, Prettier, and Husky for git hooks

## 🛠️ Tech Stack

### Frontend

-   **React 19** - UI library with latest features
-   **TypeScript** - Type safety and better developer experience
-   **Redux Toolkit** - State management
-   **Redux Saga** - Side effects management (async actions, WebSocket integration)
-   **React Router v7** - Client-side routing with lazy loading
-   **WebSocket (Native)** - Real-time communication
-   **Sass/SCSS** - Styling with variables and mixins
-   **Webpack 5** - Module bundling with dev server
-   **Rive** - Animation library for interactive backgrounds
-   **JSConfetti** - Confetti animation library
-   **React Toastify** - Toast notification system
-   **Babel** - JavaScript transpilation
-   **Husky** - Git hooks
-   **Lint-staged** - Pre-commit linting

### Backend

-   **Node.js** - Runtime environment
-   **Express 4** - Web framework
-   **WebSocket (ws)** - WebSocket server implementation
-   **LowDB** - JSON file-based database with lazy loading
-   **bcrypt** - Password hashing (10 salt rounds)
-   **UUID** - Unique identifier generation
-   **CORS** - Cross-origin resource sharing
-   **TypeScript** - Type safety
-   **ts-node-dev** - Development server with hot reload

### Shared

-   **TypeScript Types** - Shared type definitions between frontend and backend
-   **Path Aliases** - Type imports using `@types` alias

## 📁 Project Structure

```
arrise/
├── front/                        # Frontend application
│   ├── src/
│   │   ├── componts/            # React components
│   │   │   ├── App.tsx          # Main app component
│   │   │   ├── AuthProvider.tsx # Authentication context
│   │   │   ├── SocketProvider.tsx # WebSocket client wrapper
│   │   │   ├── HamburgerMenu.tsx # Navigation menu
│   │   │   ├── ThemeToggle.tsx  # Theme switcher
│   │   │   ├── AddRoom.tsx      # Room creation modal
│   │   │   └── RiveAnimation.tsx # Background animation
│   │   ├── pages/               # Page components (lazy loaded)
│   │   │   ├── Welcome.tsx      # Login/register page
│   │   │   ├── Rooms.tsx        # Room listing page
│   │   │   ├── Room.tsx         # Chat room page
│   │   │   ├── Users.tsx        # Users list page
│   │   │   └── NotFound.tsx     # 404 page
│   │   ├── store/               # Redux store
│   │   │   ├── store.ts         # Store configuration
│   │   │   ├── rootSaga.ts      # Root saga
│   │   │   └── users/           # Users slice and sagas
│   │   ├── styles/              # SCSS stylesheets
│   │   │   ├── main.scss        # Main stylesheet
│   │   │   ├── _variables.scss  # CSS variables
│   │   │   └── ...              # Component styles
│   │   ├── routes.tsx           # Application routes
│   │   └── index.tsx            # Application entry point
│   ├── public/                  # Static assets
│   │   └── animations/          # Rive animation files
│   ├── server.js                # Production Express server
│   ├── webpack.common.ts        # Webpack common config
│   ├── webpack.dev.ts           # Webpack dev config
│   ├── webpack.prod.ts          # Webpack prod config
│   └── package.json
│
├── server/                      # Backend application
│   ├── src/
│   │   └── index.ts             # Server entry point (Express + WebSocket)
│   ├── classes/                 # Controller classes
│   │   ├── messageController.ts # Message management
│   │   ├── usersColtroller.ts   # User management
│   │   └── wrightController.ts  # Debounced write controller
│   ├── db/                      # JSON database files
│   │   ├── db_users.json        # User data
│   │   ├── db_rooms.json        # Room data
│   │   └── db_messages.json     # Message data (per room)
│   └── package.json
│
└── types/                       # Shared TypeScript types
    ├── index.ts                 # Type exports
    ├── user.types.ts            # User type definitions
    ├── room.types.ts            # Room type definitions
    ├── messages.types.ts        # Message type definitions
    └── socket.types.ts          # WebSocket event types
```

## 📦 Installation

### Prerequisites

-   **Node.js** (v18 or higher)
-   **pnpm** (package manager) - Install via `npm install -g pnpm`

### Setup

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd arrise
    ```

2. **Install frontend dependencies**

    ```bash
    cd front
    pnpm install
    ```

3. **Install backend dependencies**

    ```bash
    cd ../server
    pnpm install
    ```

4. **Initialize database files** (if they don't exist)
   The database files will be created automatically on first run, but you can create them manually:
    ```bash
    cd server/db
    echo '{"users": []}' > db_users.json
    echo '{"rooms": []}' > db_rooms.json
    echo '{}' > db_messages.json
    ```

## 🚀 Running the Project

### Development Mode

1. **Start the backend server** (Terminal 1)

    ```bash
    cd server
    pnpm dev
    ```

    The server will run on `http://localhost:3001` (or the PORT specified in environment variables)

    - WebSocket server: `ws://localhost:3001`
    - Express server: `http://localhost:3001`

2. **Start the frontend development server** (Terminal 2)
    ```bash
    cd front
    pnpm dev
    ```
    The frontend will be available at `http://localhost:3000`
    - Hot module replacement enabled
    - Source maps for debugging
    - History API fallback for client-side routing

### Production Build

1. **Build the frontend**

    ```bash
    cd front
    pnpm build
    ```

    This creates an optimized production build in the `dist/` directory.

2. **Build the backend**

    ```bash
    cd server
    pnpm build
    ```

    This compiles TypeScript to JavaScript in the `dist/` directory.

3. **Start the production servers**

    **Backend:**

    ```bash
    cd server
    pnpm start
    ```

    **Frontend (serves built files):**

    ```bash
    cd front
    pnpm start
    ```

    The frontend production server runs on port 3000 (or PORT environment variable).

## 🎯 Usage

### Getting Started

1. **Start the application** (see Running the Project section)

2. **Welcome Page**:

    - Enter your username (minimum 3 characters)
    - Enter your password (minimum 6 characters)
    - Click "Login" to authenticate
    - New users are automatically registered on first login

3. **Rooms Page**:

    - View all available chat rooms
    - Click "Create New Room" to create a room
    - Enter room name (max 20 characters) and description (max 200 characters)
    - Click "Join now" to enter a room
    - Click "Delete" to remove a room (with confirmation)

4. **Chat Room**:

    - View room messages (last 20 messages)
    - Type your message (max 200 characters)
    - Click "Send" or press Enter to send
    - Click "add 🎉" button to add celebration emoji
    - Messages with 🎉 trigger confetti animation
    - Click "back to rooms" to return to room list

5. **Navigation**:
    - Click hamburger menu (☰) to access navigation
    - Toggle theme (light/dark mode)
    - Navigate to Users page
    - Logout from the application

### Authentication

-   Authentication state is stored in `sessionStorage`
-   User sessions persist until browser tab is closed
-   Protected routes automatically redirect to welcome page if not authenticated
-   User tokens are UUIDs (not JWT, despite JWT package being installed)

## 🔌 WebSocket Events

### Client → Server Events

| Event           | Description                    | Payload                                                                   |
| --------------- | ------------------------------ | ------------------------------------------------------------------------- |
| `HELLO`         | Initial connection greeting    | `{ client: string, user: string }`                                        |
| `PING`          | Keep-alive ping                | `{ ts: number }`                                                          |
| `MESSAGE`       | Wrapper for message events     | `{ type: string, ...payload }`                                            |
| `LOGIN`         | User authentication            | `{ name: string, password: string }`                                      |
| `GET_ROOMS`     | Request list of all rooms      | `{}`                                                                      |
| `CREATE_ROOM`   | Create a new chat room         | `{ payload: { name: string, description?: string } }`                     |
| `DELETE_ROOMS`  | Delete a chat room             | `{ roomId: string }`                                                      |
| `JOIN_ROOM`     | Join a specific room           | `{ roomId: string, userName: string }`                                    |
| `NEW_MESSAGE`   | Send a new message             | `{ roomId: string, senderId: string, userName: string, content: string }` |
| `GET_ROOM_DATA` | Request room messages and data | `{ roomId: string }`                                                      |
| `GET_USERS`     | Request list of all users      | `{}`                                                                      |
| `LOGOUT`        | User logout                    | `{}`                                                                      |

### Server → Client Events

| Event          | Description                | Payload                                                                       |
| -------------- | -------------------------- | ----------------------------------------------------------------------------- |
| `WELCOME`      | Connection welcome message | `{ msg: string }`                                                             |
| `PONG`         | Response to ping           | `{ ts: number }`                                                              |
| `AUTH_RESULT`  | Authentication result      | `{ userData: { id: string, name: string, token: string } }`                   |
| `GET_ROOMS`    | List of rooms              | `{ rooms: Room[] }`                                                           |
| `ROOM_CREATED` | Room creation notification | `{ room: Room }`                                                              |
| `ROOM_DELETED` | Room deletion notification | `{ roomId: string }`                                                          |
| `NEW_MESSAGE`  | New message broadcast      | `{ message: Message }`                                                        |
| `ROOM_DATA`    | Room data response         | `{ roomId: string, messages: Message[], name: string, description?: string }` |
| `USERS_LIST`   | List of users              | `{ users: User[] }`                                                           |
| `ERROR`        | Error messages             | `{ message: string }`                                                         |

## 🗄️ Database

The application uses **LowDB** with JSON files for data persistence. Database writes are debounced with a 5-second delay to optimize performance.

### Database Files

-   **`db_users.json`**: User data with hashed passwords

    ```json
    {
    	"users": [
    		{
    			"id": "uuid",
    			"name": "username",
    			"passwordHash": "bcrypt_hash",
    			"registeredAt": "timestamp"
    		}
    	]
    }
    ```

-   **`db_rooms.json`**: Room data

    ```json
    {
    	"rooms": [
    		{
    			"id": "uuid",
    			"name": "room_name",
    			"description": "room_description",
    			"createdAt": "timestamp",
    			"members": []
    		}
    	]
    }
    ```

-   **`db_messages.json`**: Message data (organized by roomId)
    ```json
    {
      "roomId1": [
        {
          "id": "uuid",
          "roomId": "roomId1",
          "senderId": "userId",
          "content": "message content",
          "sentAt": "timestamp",
          "userName": "username",
          "type": "USER" | "SYSTEM"
        }
      ],
      "roomId2": [...]
    }
    ```

### Database Features

-   **Message Limit**: Only last 20 messages per room are stored
-   **Debounced Writes**: Writes are batched with a 5-second delay
-   **Automatic Cleanup**: Old messages are automatically removed when limit is reached
-   **Lazy Loading**: Database files are loaded on server start

## 🧩 Key Components

### Frontend Components

#### Core Components

-   **`App.tsx`**: Main application component with layout structure
-   **`AuthProvider.tsx`**: Authentication context provider with sessionStorage persistence
-   **`SocketProvider.tsx`**: WebSocket client wrapper with automatic reconnection
-   **`HamburgerMenu.tsx`**: Navigation menu with theme toggle and logout
-   **`ThemeToggle.tsx`**: Light/dark mode toggle with localStorage persistence
-   **`AddRoom.tsx`**: Modal dialog for room creation with form validation
-   **`RiveAnimation.tsx`**: Background animation that adapts to theme changes

#### Page Components

-   **`Welcome.tsx`**: Login/registration page with input validation
-   **`Rooms.tsx`**: Room listing page with create/delete functionality
-   **`Room.tsx`**: Chat room page with message display and input
-   **`Users.tsx`**: Users list page (Redux-based)
-   **`NotFound.tsx`**: 404 error page

### Backend Components

#### Controllers

-   **`MessageController`**:
    -   Message storage and retrieval
    -   Message limit management (20 messages per room)
    -   Room-based message organization
-   **`UsersCollector`**:
    -   User registration and authentication
    -   Password hashing with bcrypt
    -   User lookup and verification
-   **`WrightController`**:
    -   Debounced database writes (5 second delay)
    -   Prevents excessive file I/O operations

#### Server

-   **`index.ts`**:
    -   Express server setup
    -   WebSocket server implementation
    -   Event handling and message routing
    -   Database initialization

## 🔒 Security

### Authentication

-   **Password Hashing**: Passwords are hashed using bcrypt with 10 salt rounds
-   **Session Storage**: User authentication state stored in sessionStorage (cleared on tab close)
-   **Token Generation**: UUID-based tokens (not JWT, despite JWT package being available)
-   **Protected Routes**: Automatic redirection to welcome page if not authenticated

### Input Validation

-   **Username**: 3-20 characters
-   **Password**: Minimum 6 characters
-   **Room Name**: Maximum 20 characters
-   **Room Description**: Maximum 200 characters
-   **Message Content**: Maximum 200 characters
-   **Sanitization**: Input trimming and validation before processing

### Network Security

-   **CORS**: Cross-origin resource sharing enabled on backend
-   **WebSocket Security**: Connection validation and error handling
-   **Error Handling**: Comprehensive error handling with user-friendly messages

## 📝 Scripts

### Frontend Scripts

| Script        | Description                                           |
| ------------- | ----------------------------------------------------- |
| `pnpm dev`    | Start webpack dev server on port 3000 with hot reload |
| `pnpm build`  | Build production bundle with optimizations            |
| `pnpm start`  | Start production Express server on port 3000          |
| `pnpm format` | Format code with Prettier                             |

### Backend Scripts

| Script       | Description                                              |
| ------------ | -------------------------------------------------------- |
| `pnpm dev`   | Start development server with ts-node-dev and hot reload |
| `pnpm build` | Compile TypeScript to JavaScript in `dist/` directory    |
| `pnpm start` | Start production server from `dist/index.js`             |

## 🎨 Styling

The application uses **SCSS** with a modular approach:

-   **`_variables.scss`**: CSS variables for colors, spacing, and themes
-   **`_base.scss`**: Base styles and resets
-   **`_layout.scss`**: Layout utilities and flexbox helpers
-   **`_components.scss`**: Component-specific styles
-   **`_pages.scss`**: Page-specific styles
-   **`_utilities.scss`**: Utility classes (gap, flex, etc.)
-   **`_modal.scss`**: Modal dialog styles
-   **`_messages.scss`**: Message display styles
-   **`_menu.scss`**: Navigation menu styles

### Theme System

-   Light and dark themes supported
-   Theme preference stored in localStorage
-   Rive animations adapt to theme changes
-   CSS variables for easy theme customization

## 🔧 Development Tools

### Code Quality

-   **ESLint**: Code linting with React and TypeScript rules
-   **Prettier**: Code formatting (version 3.6.2)
-   **Husky**: Git hooks for pre-commit checks
-   **Lint-staged**: Run linters on staged files

### Build Tools

-   **Webpack 5**: Module bundling
-   **Babel**: JavaScript/TypeScript transpilation
-   **Sass Loader**: SCSS compilation
-   **TypeScript**: Type checking and compilation

### Development Features

-   **Hot Module Replacement**: Instant updates during development
-   **Source Maps**: Debugging support in development
-   **TypeScript Path Aliases**: `@types` alias for shared types
-   **Lazy Loading**: Code splitting for page components

## 🐛 Known Issues / Limitations

-   Users page route is commented out in `routes.tsx` (component exists but not accessible)
-   JWT package is installed but not used (UUID tokens are used instead)
-   Message history is limited to last 20 messages per room
-   Database writes are debounced, so immediate consistency is not guaranteed
-   WebSocket reconnection has a maximum of 10 attempts
-   No message editing or deletion functionality
-   No file/image upload support
-   No private/direct messaging

## 🚧 Future Improvements

-   Implement JWT-based authentication
-   Add message editing and deletion
-   Add file/image upload support
-   Implement private/direct messaging
-   Add message pagination for older messages
-   Add user profiles and avatars
-   Add typing indicators
-   Add message reactions
-   Add room member management
-   Add message search functionality
-   Add notification system
-   Add database migration to PostgreSQL/MongoDB
-   Add unit and integration tests
-   Add CI/CD pipeline

## 👤 Author

**Rusic**

## 📄 License

ISC

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Contribution Guidelines

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `pnpm format` to format code
5. Ensure all tests pass (when available)
6. Submit a Pull Request

---

**Note**: This is a test chat project for learning and development purposes. It demonstrates real-time communication, state management, and modern web development practices.
