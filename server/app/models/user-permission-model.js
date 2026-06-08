'use strict';
module.exports = (sequelize, DataTypes) => {

	const baseModelHelper = require("./helpers/base-model-helper")(sequelize, DataTypes);

	const UserPermission = sequelize.define('UserPermission', {
		...baseModelHelper,
		roleId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
			field: "role_id"
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
			field: "user_id"
		},

	}, {
		tableName: 'user_permission',
		timestamps: false,
		indexes: [
            { name: 'ix_user_permission_user_role_id', fields: ['role_id'] }
		]
	});

	return UserPermission;
};