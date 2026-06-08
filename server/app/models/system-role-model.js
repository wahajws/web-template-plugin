'use strict';

module.exports = (sequelize, DataTypes) => {

	const baseModelHelper = require("./helpers/base-model-helper")(sequelize, DataTypes);

	const SystemRole = sequelize.define('SystemRole', {
		...baseModelHelper,
		roleName: {
			type: DataTypes.STRING,
			allowNull: false,
			field: "role_name"
		},
		isAdministrator: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
            defaultValue: false,
			field: "is_administrator"
		},
	}, {
		tableName: 'system_role',
		timestamps: false
	});

	return SystemRole;
};