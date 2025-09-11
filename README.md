# Scratchbook - A Modern Note-Taking Application

![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)
![React](https://img.shields.io/badge/React-19.x-blue.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green.svg)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

A sleek, modern note-taking application built with a full-stack TypeScript approach. **Scratchbook** allows users to create and share notes with a clean, intuitive interface and robust backend.

## Features

- **User Authentication**: Secure registration and login with JWT-based authentication
- **Note Management**: Create and delete notes
- **Privacy Controls**: Set notes as private or public
- **User-Friendly Interface**: Clean UI built with _React_ and _Material-UI_
- **Real-time Updates**: Instant updates to your notes
- **Secure Storage**: Passwords hashed with _bcrypt_
- **Responsive Design**: Works seamlessly across devices

## Tech Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT
- **Logging**: Pino
- **Environment Variables**: Dotenv, envalid

### Frontend

- **Framework**: React
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI)
- **Routing**: React Router
- **Markdown**: React Markdown
- **Icons**: Material Icons

## Installation and Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/Toriality1/scratchbook.git
   cd scratchbook
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory and add the following:

   ```env
   PORT=5000
   CLIENT_URL=http://localhost:3000
   JWT_SECRET=your_jwt_secret_key
   ATLAS_URI=your_mongodb_connection_string
   NODE_ENV=development
   ```

4. **Run the application**

   ```bash
   # For development (runs both server and client)
   npm run dev

   # For production
   npm run build
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Environment Variables

| Variable     | Description                               | Required | Default       |
| ------------ | ----------------------------------------- | -------- | ------------- |
| `PORT`       | Port number for the server                | No       | `5000`        |
| `CLIENT_URL` | URL of the frontend application           | Yes      | -             |
| `JWT_SECRET` | Secret key for JWT signing                | Yes      | -             |
| `ATLAS_URI`  | MongoDB connection string                 | Yes      | -             |
| `NODE_ENV`   | Environment (development/production/test) | No       | `development` |

## API Endpoints

### Authentication

- `POST /api/users` - Register a new user
- `POST /api/users/auth` - Login a user
- `GET /api/users/auth` - Get current user
- `GET /api/users/logout` - Logout a user

### Notes

- `GET /api/notes` - Get all notes (public and user's private notes)
- `POST /api/notes` - Create a new note
- `GET /api/notes/:id` - Get a specific note
- `PATCH /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT

---

**Built with ❤️**
