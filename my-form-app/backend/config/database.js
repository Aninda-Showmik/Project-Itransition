import { Sequelize } from 'sequelize';  // Import Sequelize constructor
import dotenv from 'dotenv';  // Import dotenv for environment variable support

dotenv.config();  // Load environment variables

// Create a new Sequelize instance
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,  // Database host (e.g., localhost or your server)
  username: process.env.DB_USER,  // Database username
  password: process.env.DB_PASSWORD,  // Database password
  database: process.env.DB_NAME,  // Database name
  port: process.env.DB_PORT,  // Database port (default: 5432 for PostgreSQL)
  logging: false,  // Disable logging of SQL queries
});

// Test the connection inside an async function
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

// Call the test function
testConnection();

// Export the sequelize instance for use in other files
export default sequelize;
