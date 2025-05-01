import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; // Ensure the Sequelize instance is imported

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    validate: {
      isEmail: true,
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
  clerkUserId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
  },
  role: {
    type: DataTypes.STRING, // Storing role as a string
    allowNull: true,
  },
}, {
  tableName: 'users',
});

export default User;



