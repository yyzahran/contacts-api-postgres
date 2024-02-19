// models/user.js
const { DataTypes } = require('sequelize');
const sequelize = require('../dbconfig');

const Users = sequelize.define('users', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, 
{
    freezeTableName: true,
    timestamps: false
},
);

module.exports = Users;


// sequelize.sync()
//   .then(() => {
//     console.log('Database synchronized successfully.');
//     // Now you can start your server or perform any other actions
//   })
//   .catch(error => {
//     console.error('Error synchronizing database:', error);
//   });