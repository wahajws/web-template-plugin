'use strict';

module.exports = (sequelize, DataTypes) => {

	const baseModelHelper = require("./helpers/base-model-helper")(sequelize, DataTypes);

	const NavigationMenuRole = sequelize.define('NavigationMenuRole', {
		...baseModelHelper,
        menuId: {
			type: DataTypes.INTEGER,
			allowNull: false,
            defaultValue: 0,
			field: "menu_id"
		},        
        roleId: {
			type: DataTypes.INTEGER,
			allowNull: false,
            defaultValue: 0,
			field: "role_id"
		},
	}, {
		tableName: 'navigation_menu_role',
		timestamps: false
	});

	return NavigationMenuRole;
};