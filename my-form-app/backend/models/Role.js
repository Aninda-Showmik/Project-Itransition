import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; // Import the Sequelize instance

// Define the User model
const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true, // Username can be optional if you want only Clerk ID and email
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true, // Validates that it's a proper email
    },
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true, // Allow null since Clerk manages authentication
  },
  clerkUserId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user', // Default role is 'user'
    validate: {
      isIn: [['user', 'admin']], // Optional: Only allow 'user' or 'admin'
    },
  },
}, {
  tableName: 'Users', // Explicit table name
  timestamps: true,   // Adds createdAt and updatedAt fields
});

export default User;
