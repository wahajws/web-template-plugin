'use strict';

module.exports = (sequelize, DataTypes) => {

	const baseModelHelper = require("./helpers/base-model-helper")(sequelize, DataTypes);

	const Address = sequelize.define('Address', {
		...baseModelHelper,
		KeyId: {
			type: DataTypes.STRING,
			allowNull: false,
			field: "key_id"
		},
		TypeId: {
			type: DataTypes.STRING,
			allowNull: false,
			field: "type_id"
		},
		Line1: {
			type: DataTypes.STRING,
			allowNull: false,
			field: "line_1"
		},
		Line2: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: "",
			field: "line_2"
		},
		Line3: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: "",
			field: "line_3"
		},
		City: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: "",
			field: "city"
		},
		State: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: "",
			field: "state"
		},		
		PostalCode: {
			type: DataTypes.STRING,
			allowNull: false,
			field: "postal_code"
		},	
		CountryId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
			field: "country_id"
		},
		Latitude: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: null,
			field: "latitude"
		},
		Longitude: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: null,
			field: "longitude"
		},
	}, {
		tableName: 'address',
		timestamps: false
	});

	return Address;
};
