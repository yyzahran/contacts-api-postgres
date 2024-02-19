const { DataTypes } = require('sequelize');
const sequelize = require('../dbconfig');
const Users = require('./users');

const Contacts = sequelize.define('contacts', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    contactName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdBy: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Users,
            key: 'id'
        }
    }
},
    {
        freezeTableName: true,
        timestamps: false
    },
);

module.exports = Contacts

// sequelize.sync()
//   .then(() => {
//     console.log('Database synchronized successfully.');
//     // Now you can start your server or perform any other actions
//   })
//   .catch(error => {
//     console.error('Error synchronizing database:', error);
//   });