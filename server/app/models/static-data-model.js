'use strict';

module.exports = (sequelize, DataTypes) => {

	const baseModelHelper = require("./helpers/base-model-helper")(sequelize, DataTypes);

	const StaticData = sequelize.define('StaticData', {
		...baseModelHelper,
		dataKey: {
			type: DataTypes.STRING,
			allowNull: false,
			field: "data_key"
		},
		dataText: {
			type: DataTypes.STRING,
			allowNull: false,
			field: "data_text"
		},
		dataValue: {
			type: DataTypes.STRING,
			allowNull: false,
			field: "data_value"
		},
		isDefaultValue: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			field: "is_default_value",
			defaultValue: false
		}
	}, {
		tableName: 'static_data',
		timestamps: false,
		indexes: [
			{ name: 'ix_static_data_data_key', fields: ['data_key'] }
		]
	});

	return StaticData;
};