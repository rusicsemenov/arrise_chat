# Arrise

A real-time chat application built with React and Node.js, featuring WebSocket-based messaging, room management, and user authentication.

## 🚀 Features

- **Real-time Messaging**: WebSocket-based instant messaging with live updates
- **Chat Rooms**: Create, join, and manage multiple chat rooms
- **User Authentication**: Secure user registration and login with password hashing
- **Room Management**: Create and delete chat rooms with descriptions
- **User Management**: View and manage users in the system
- **System Messages**: Automatic notifications when users join rooms
- **Modern UI**: Responsive design with Rive animations and theme support
- **Type Safety**: Full TypeScript implementation for both frontend and backend

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **WebSocket** - Real-time communication
- **Sass** - Styling
- **Webpack** - Module bundling
- **Rive** - Animation library

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **WebSocket (ws)** - WebSocket server
- **LowDB** - JSON file-based database
- **bcrypt** - Password hashing
- **JWT** - Authentication tokens
- **TypeScript** - Type safety

## 📁 Project Structure

```
arrise/
├── front/                 # Frontend application
│   ├── src/
│   │   ├── componts/     # React components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── styles/       # SCSS stylesheets
│   │   └── routes.tsx    # Application routes
│   └── package.json
├── server/               # Backend application
│   ├── src/
│   │   └── index.ts      # Server entry point
│   ├── classes/          # Controller classes
│   ├── db/               # JSON database files
│   └── package.json
└── types/                # Shared TypeScript types
    ├── user.types.ts
    ├── room.types.ts
    ├── messages.types.ts
    └── socket.types.ts
```

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- pnpm (package manager)

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

4. **Install shared types dependencies** (if needed)
   ```bash
   cd ../types
   # Install any dependencies if required
   ```

## 🚀 Running the Project

### Development Mode

1. **Start the backend server**
   ```bash
   cd server
   pnpm dev
   ```
   The server will run on `http://localhost:3001` (or the PORT specified in environment variables)

2. **Start the frontend development server** (in a new terminal)
   ```bash
   cd front
   pnpm dev
   ```
   The frontend will be available at `http://localhost:8080` (or the port configured in webpack)

### Production Build

1. **Build the frontend**
   ```bash
   cd front
   pnpm build
   ```

2. **Build the backend**
   ```bash
   cd server
   pnpm build
   ```

3. **Start the production server**
   ```bash
   cd server
   pnpm start
   ```

## 🎯 Usage

1. **Welcome Page**: Start at the welcome page to authenticate
2. **Login/Register**: Enter your username and password (new users are automatically registered)
3. **Rooms**: Browse available chat rooms or create a new one
4. **Chat**: Join a room to start sending and receiving messages in real-time
5. **Manage**: Delete rooms and manage your chat experience

## 🔌 WebSocket Events

### Client → Server
- `HELLO` - Initial connection greeting
- `PING` - Keep-alive ping
- `LOGIN` - User authentication
- `GET_ROOMS` - Request list of all rooms
- `CREATE_ROOM` - Create a new chat room
- `DELETE_ROOMS` - Delete a chat room
- `JOIN_ROOM` - Join a specific room
- `NEW_MESSAGE` - Send a new message
- `GET_ROOM_DATA` - Request room messages and data
- `GET_USERS` - Request list of all users

### Server → Client
- `WELCOME` - Connection welcome message
- `PONG` - Response to ping
- `AUTH_RESULT` - Authentication result
- `GET_ROOMS` - List of rooms
- `ROOM_CREATED` - Room creation notification
- `ROOM_DELETED` - Room deletion notification
- `NEW_MESSAGE` - New message broadcast
- `ROOM_DATA` - Room data response
- `USERS_LIST` - List of users
- `ERROR` - Error messages

## 🗄️ Database

The application uses LowDB with JSON files for data persistence:
- `db_users.json` - User data
- `db_rooms.json` - Room data
- `db_messages.json` - Message data

## 🧩 Key Components

### Frontend
- **App** - Main application component
- **AuthProvider** - Authentication context
- **SocketProvider** - WebSocket connection management
- **Rooms** - Room listing page
- **Room** - Individual room chat page
- **Welcome** - Welcome/authentication page

### Backend
- **MessageController** - Message management
- **UsersCollector** - User management
- **WebSocket Server** - Real-time communication handler

## 🔒 Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- User input validation
- CORS configuration for secure API access

## 📝 Scripts

### Frontend
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm format` - Format code with Prettier

### Backend
- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Compile TypeScript to JavaScript
- `pnpm start` - Start production server

## 👤 Author

**Rusic**

## 📄 License

ISC

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Note**: This is a test chat project for learning and development purposes.

