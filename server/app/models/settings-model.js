'use strict';

module.exports = (sequelize, DataTypes) => {

	const baseModelHelper = require("./helpers/base-model-helper")(sequelize, DataTypes);

	const Settings = sequelize.define('Settings', {
		...baseModelHelper,
		settingKey: {
			type: DataTypes.STRING,
			allowNull: false,
			field: "setting_key"
		},
		settingValue: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: "setting_value"
		},
	}, {
		tableName: 'settings',
		timestamps: false,
		indexes: [
			{ name: 'ix_settings_setting_key', fields: ['setting_key'] }
		]
	});

	return Settings;
};