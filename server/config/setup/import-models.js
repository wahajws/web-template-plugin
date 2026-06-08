'use strict';

const fs = require('fs');
const path = require('path');
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	
	const db = {};
	var modelsPath = path.join(__dirname, '../..', 'app', 'models');
	if(sequelize){ console.log('Importing model files...', modelsPath); }
	
	// Import all model files
	try {
	fs.readdirSync(modelsPath)
		.filter(file => {
			return (
				file.indexOf('.') !== 0 &&
				file !== 'index.js' &&
				file.slice(-3) === '.js'
			);
		})
		.forEach(file => {
			const model = require(path.join(modelsPath, file))(sequelize, DataTypes);
			console.log(`- Model loaded: ${model.name}`);
			db[model.name] = model
		});
    } catch (err) {
        // Handle specific error codes
        if (err.code === 'ENOENT') {
            console.error('Directory does not exist');
        } else if (err.code === 'EACCES') {
            console.error('Permission denied');
        } else {
            console.error('An unexpected error occurred:', err.message);
        }
    }
	
	// Setup associations
	Object.keys(db).forEach(modelName => {
		if (db[modelName].associate) {
			db[modelName].associate(db);
		}
	});

	db.sequelize = sequelize;
	db.DataTypes = DataTypes;
	
	return db;
};
