require('dotenv').config();

// Database configuration
const configData = {
	autoseed: process.env.AUTO_SEED || 'false',
    environment: process.env.NODE_ENV || 'development',
	host: process.env.DB_HOST || 'localhost',
	port: process.env.DB_PORT || 3306,
	database: process.env.DB_SCHEMA || 'myamast',
	username: process.env.DB_USER || 'root',
	password: process.env.DB_PASSWORD || '',
	dialect: process.env.DB_DIALECT || 'mysql',
	logging: process.env.NODE_ENV === 'development' ? console.log : false,
	pool: {
		max: 10,
		min: 0,
		acquire: 30000,
		idle: 10000
	},
	define: {
		timestamps: true,
		underscored: false,
		freezeTableName: true
	}
};

module.exports = configData;
