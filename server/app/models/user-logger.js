'use strict';
module.exports = (sequelize, DataTypes) => {

	const baseModelHelper = require("./helpers/base-model-helper")(sequelize, DataTypes);

	const UserLogger = sequelize.define('UserLogger', {
		...baseModelHelper,
		action: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: "",
			field: "action"
		},
		header: {
			type: DataTypes.TEXT,
			allowNull: false,
			defaultValue: "",
			field: "header"
		}	
	}, {
		tableName: 'user_logger',
		timestamps: false,
		indexes: [
            { name: 'ix_user_logger_created_by_id', fields: ['created_by_id'] }
		]
	});

	return UserLogger;
};
