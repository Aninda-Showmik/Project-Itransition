// models/Form.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User  from './User.js'; // Use default import

const Form = sequelize.define('Form', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'users', // You can also use string name here
      key: 'clerkUserId'
    }
  }
}, {
  tableName: 'Forms'
});

// Association
Form.belongsTo(User, {
  foreignKey: 'userId',
  targetKey: 'clerkUserId'
});

export {Form};
