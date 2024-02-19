const Sequelize = require('sequelize');

const db_name = "contacts-express";
const db_host = "localhost";
const db_port = 5432;

const sequelize = new Sequelize('contacts-express', 'youssef.zahran', null, {
    host: db_host,
    port: db_port,
    dialect: 'postgres'
});

module.exports = sequelize;

async function setupDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        const [results, metadata] = await sequelize.query(`SELECT datname FROM pg_catalog.pg_database WHERE datname = '${db_name}'`);

        if (results.length === 0) {
            console.log(`${db_name} database not found, creating it.`);
            await sequelize.query(`CREATE DATABASE "${db_name}";`);
            console.log(`Created database ${db_name}.`);
        } else {
            console.log(`${db_name} database already exists.`);
        }

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await sequelize.close();
    }
}

// setupDatabase();
