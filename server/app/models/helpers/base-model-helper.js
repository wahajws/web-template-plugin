'use strict';

const { RECORD_STATUS_OPTIONS } = require('../../../../constants/global.ts');

module.exports = (sequelize, DataTypes) => {

	// now add the TIMESTAMP type
	const TIMESTAMP = require('sequelize-mysql-timestamp')(sequelize);

	return {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		createdDate: {
			type: TIMESTAMP,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			field: "created_date",
			validate: {
				isDate: true
			}	
		},
		createdById: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1,
			field: "created_by_id"
		},
		updatedDate: {
			type: TIMESTAMP,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			field: "updated_date"
		},
		updatedById: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1,
			field: "updated_by_id"
		},
		recordStatusId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: RECORD_STATUS_OPTIONS.Public,
			field: "record_status"
		}
	}
}

