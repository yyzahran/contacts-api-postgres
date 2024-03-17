const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.USER_NAME,
    null,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
    }
);

module.exports = sequelize;

async function setupDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        const [results, metadata] = await sequelize.query(
            `SELECT datname FROM pg_catalog.pg_database WHERE datname = '${process.env.DB_NAME}'`
        );

        if (results.length === 0) {
            console.log(
                `${process.env.DB_NAME} database not found, creating it.`
            );
            await sequelize.query(`CREATE DATABASE "${process.env.DB_NAME}";`);
            console.log(`Created database ${process.env.DB_NAME}.`);
        } else {
            console.log(`${process.env.DB_NAME} database already exists.`);
        }
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await sequelize.close();
    }
}

// setupDatabase();
