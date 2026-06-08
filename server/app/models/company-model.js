'use strict';

module.exports = (sequelize, DataTypes) => {

	const baseModelHelper = require("./helpers/base-model-helper")(sequelize, DataTypes);

	const Company = sequelize.define('Company', {
		...baseModelHelper,
		companyTypeId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 0,
			field: "company_type_id"
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		email: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: null,
			validate: {
				isEmail: true
			}
		},
		phone: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: null
		},
		websiteUrl: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: null,
			field: "website_url"
		},
		logo: {
			type: DataTypes.TEXT,
			allowNull: true,
			defaultValue: null
		},
		locationCords: {
			type: DataTypes.JSON,
			allowNull: true,
			defaultValue: null,
			comment: 'Array of coordinates [longitude, latitude]',
			field: "location_cords"
		},
		workingHours: {
			type: DataTypes.JSON,
			allowNull: true,
			defaultValue: null,
			comment: 'Array of working hours objects with day, opened, openedFrom, openedUntil, from, to',
			field: "working_hours"
		},
		providedServices: {
			type: DataTypes.JSON,
			allowNull: true,
			defaultValue: null,
			comment: 'Array of provided services',
			field: "provided_services"
		},
		bankName: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: null,
			field: "bank_name"
		},
		bankAccountName: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: null,
			field: "bank_account_name"
		},
		bankAccountNumber: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: null,
			field: "bank_account_number"
		},
		bankSortCode: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: null,
			field: "bank_sort_code"
		},
		bankAddress: {
			type: DataTypes.JSON,
			allowNull: true,
			defaultValue: null,
			comment: 'Array of bank address',
			field: "bank_address"
		},
	}, {
		tableName: 'company',
		timestamps: false,
		indexes: [
			{ name: 'ix_company_type_id', fields: ['company_type_id'] },
			{ name: 'ix_company_name', fields: ['name'], unique: true },
		]
	});

	return Company;
};