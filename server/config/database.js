'use strict';
require('dotenv').config();
const configData = require('./config-data.js');
const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');
const importModels = require('./setup/import-models.js');
const importFiles = require('./setup/import-files.js');

const sequelize = new Sequelize(
  configData.database,
  configData.username,
  configData.password,
  {
    host: configData.host,
    port: configData.port,
    dialect: configData.dialect,
    logging: configData.logging,
    pool: configData.pool,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false
      }
    }
  }
);

module.exports = {

	// Function to connect to the database
	openConnection: function (params) {
		try{
			if (configData.dialect === 'mysql') {
				return mysql.createConnection({
					host: params.host,
					port: params.port,
					user: params.user,
					password: params.password,
					ssl: { rejectUnauthorized: false }
				});
			} else if (configData.dialect === 'postgres') {
				throw new Error('Postgres not supported in this version');
			}
		} catch (err) {
			throw new Error(`Unsupported DB_DIALECT: ${configData.dialect}`);
		}	
	},

    connect: async function() {
		try {
			// create db if it doesn't already exist
			const connection = await this.openConnection({
				host: configData.host,
				port: configData.port,
				user: configData.username,
				password: configData.password
			});

			if (configData.dialect === 'mysql') {
				// Create the DB SCHEMA if it doesn't exist
				await connection.query(`CREATE DATABASE IF NOT EXISTS \`${configData.database}\` CHARACTER SET utf8 COLLATE utf8_general_ci;`);
			}

			// Otherwise test the connection
			await sequelize.authenticate();

			// Prints initialization
			console.log('****************************');
			console.log('*    Starting Server');
			console.log(`*    Port: ${configData.port}`);
			console.log(`*    NODE_ENV: ${configData.environment}`);
			console.log(`*    Database: ${configData.dialect}`);
			console.log(`*    DB Host: ${configData.host}:${configData.port}`);
			console.log(`*    DB Name: ${configData.database}`);
			console.log('*    DB Connection: OK');
			console.log('****************************\n');
			
			// Load models
			await importModels(sequelize);
			
			// Sync database (create tables if they don't exist)
			if (configData.environment === 'development') {
				 // Use alter in development only
				await sequelize.sync({ alter: true }).then(() => {
					console.log('All models were synchronized successfully.');
				});

				if (configData.autoseed === 'true') {
					await importFiles.beginImport(sequelize).then(() => {
						console.log('All models were seeded successfully.');
					});
				}
			} else {
				await sequelize.sync(); // Don't alter in production
			}

			return true;

		} catch (err) {
			console.log('****************************');
			console.log('*    Database Connection Error');
			console.log(`*    Error connecting to DB: ${err}`);
			console.log('****************************\n');

			return false;
		}
	}
};

// Export sequelize instance for use in models
module.exports.sequelize = sequelize;
