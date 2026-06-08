# AMAST - Boiler Template

## Project Structure

This repository contains:

- **Backend API** (`server/`): Node.js/Express API server
- **Frontend Web App** (`client/`): React-based web application
- **Database Schema**: MySQL database schema and configurations

## Features

- User authentication and authorization
- File upload and management
- Admin panel functionality

## Technology Stack

### Backend
- Node.js
- Express.js
- MySQL
- Postgres
- MongoDB (for certain features)
- Passport.js (Authentication)
- Multer (File uploads)
- PDF generation libraries

### Frontend
- React.js
- Redux (State management)
- Ant Design (UI components)
- Less/CSS for styling

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MySQL
- MongoDB (optional, for certain features)

### Backend Setup
1. Navigate to the API directory:
   ```bash
   cd server
   ```
2. Copy environment file:
   ```bash
   copy .env-sample .env
   ```
   
3. Install dependencies:
   ```bash
   npm install
   ```

4. Configure database connections in `config/` directory

5. Run database migrations:
   ```bash
   mysql -u your_username -p your_database < database-schema.sql
   ```

6. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Configuration

- Copy `env-sample` to `.env` and configure your environment variables
- Update database configurations in `config/mysql.js` and `config/mongo.js`
- Configure authentication settings in `config/passport.js`

## API Documentation

The API includes endpoints for:
- User management
- Authentication
- Service quotations
- Purchase orders
- Delivery orders
- Invoice management
- File uploads
- PDF generation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Support

For support and questions, please contact the development team.
