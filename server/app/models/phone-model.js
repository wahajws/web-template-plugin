'use strict';

module.exports = (sequelize, DataTypes) => {

	const baseModelHelper = require("./helpers/base-model-helper")(sequelize, DataTypes);

	const Phone = sequelize.define('Phone', {
		...baseModelHelper,
		KeyId: {
			type: DataTypes.STRING,
			allowNull: false,
			field: "key_id"
		},
		TypeId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
			field: "type_id"
		},
		CountryId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
			field: "country_id"
		},
		Number: {
			type: DataTypes.STRING,
			allowNull: false,
			field: "number"
		},
		Extension: {
			type: DataTypes.STRING,
			allowNull: true,
			field: "extension"
		},	
	}, {
		tableName: 'phone',
		timestamps: false
	});

	return Phone;
};
