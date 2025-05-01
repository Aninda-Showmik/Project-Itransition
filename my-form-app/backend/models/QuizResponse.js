import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';  // Ensure the Sequelize instance is imported

// Define the QuizResponse model
const QuizResponse = sequelize.define('QuizResponse', {
    formId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Forms',  // The table name for Forms
            key: 'id'
        },
        allowNull: false
    },
    answers: {
        type: DataTypes.JSONB,
        allowNull: false
    },
    userId: {
        type: DataTypes.STRING, // Clerk userId is a string (UUID-style)
        allowNull: false
    }
});

export { QuizResponse };  // Named export for the QuizResponse model
