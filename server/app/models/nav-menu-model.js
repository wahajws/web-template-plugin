'use strict';

module.exports = (sequelize, DataTypes) => {

	const baseModelHelper = require("./helpers/base-model-helper")(sequelize, DataTypes);

	const NavigationMenu = sequelize.define('NavigationMenu', {
		...baseModelHelper,
        parentId: {
			type: DataTypes.INTEGER,
			allowNull: false,
            defaultValue: 0,
			field: "parent_id"
		},
		menuText: {
			type: DataTypes.STRING,
			allowNull: false,
			field: "menu_text"
		},
		menuDescription: {
			type: DataTypes.STRING,
			allowNull: true,
            field: "menu_description"
		},
		url: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: '#',
            field: "url"   
		},
		icon: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: null,
			field: "icon"
		},
        orderIndex: {
			type: DataTypes.STRING,
			allowNull: false,
            defaultValue: '0',
			field: "order_index"
		},
	
	}, {
		tableName: 'navigation_menu',
		timestamps: false
	});

	return NavigationMenu;
};
