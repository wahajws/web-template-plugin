'use strict';
const { IC_TYPE_OPTIONS, GENDER_OPTIONS } = require('../../../constants/global.ts');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

module.exports = (sequelize, DataTypes) => {

	const baseModelHelper = require("./helpers/base-model-helper")(sequelize, DataTypes);
	
	const User = sequelize.define('User', {
		...baseModelHelper,
		firstName: {
			type: DataTypes.STRING,
			allowNull: false,
			field: "first_name",
			validate: {
				notEmpty: { msg: "First name is required" },
				len: { args: [2, 100], msg: "First name must be between 2 and 100 characters" },
			},
		},
		lastName: {
			type: DataTypes.STRING,
			allowNull: false,
			field: "last_name",
			validate: {
				notEmpty: { msg: "Last name is required" },
				len: { args: [2, 100], msg: "Last name must be between 2 and 100 characters" },
			},
		},
		icNumber: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: "",
			field: "ic_number"
		},
		icTypeId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: IC_TYPE_OPTIONS.NRIC,
			field: "ic_type_id"
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: { msg: "Please provide a valid email" },
				notEmpty: { msg: "Email is required" },
			},
		},
		avatar: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		genderId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: GENDER_OPTIONS.Undisclosed,
			field: "gender_id"
		},
		phone: {
			type: DataTypes.STRING,
			allowNull: true,
			validate: {
				isNumeric: { msg: "Phone number must contain only numbers" },
			},
		},
		dateOfBirth: {
			type: DataTypes.DATEONLY,
			allowNull: false,
			field: "date_of_birth",
			validate: {
				isDate: { msg: "Please provide a valid date" },
				notEmpty: { msg: "Date of birth is required" },
				isPast(value) {
					if (new Date(value) >= new Date()) {
					throw new Error('Birthday cannot be in the future.');
					}
				},
				isRealistic(value) {
					const minDate = new Date();
					minDate.setFullYear(minDate.getFullYear() - 120); // 120 years max
					if (new Date(value) < minDate) {
					throw new Error('Please enter a realistic birthday.');
					}
				}
			},
		},
		address: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
            	len: { args: [6, 100], msg: "Password must be at least 6 characters" },
         	}
		},
		passwordToken: {
			type: DataTypes.TEXT,
			allowNull: true,
			defaultValue: null,
			field: "password_token"
		},
		passwordTokenExpires: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: null,
			field: "password_token_expires"
		},
		emailVerificationToken: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: null,
			field: "email_verification_token"
		},
		emailVerificationExpires: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: null,
			field: "email_verification_expires"
		},
		passwordChangedDate: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: null,
			field: "password_changed_date"
		},
		isEmailVerified: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false,
			field: "is_email_verified"
		},
		isLockedOut: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false,
			field: "is_locked_out"
		},	
		lastLoginDate: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: null,
			field: "last_login_date"
		},
		loginAttempts: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			field: "login_attempts"
		},
		lockedUntilDate: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: null,
			field: "locked_until_date"
		},

	},
	{
      hooks: {
         beforeCreate: async (user) => {
            if (user.password) {
               user.password = await bcrypt.hash(user.password, 6);
            }
         },
         beforeUpdate: async (user) => {
            if (user.changed("password")) {
               user.password = await bcrypt.hash(user.password, 6);
               user.passwordChangedDate = new Date();
            }
         },
      },
      defaultScope: {
         attributes: { exclude: ["password", "passwordResetToken", "emailVerificationToken"] },
      },
      scopes: {
         withPassword: {
            attributes: { include: ["password"] },
         },
      },
    },
	{
		tableName: 'user',
		timestamps: false,
  		createdAt: false,
  		updatedAt: false,
		indexes: [
			{ name: 'ix_user_id', fields: ['id'], unique: true,},
			{ name: 'ix_user_email', fields: ['email'], unique: true,},
			{ name: 'ix_user_ic_number', fields: ['ic_number'] }
		]
	});

	// Instance methods
	User.prototype.comparePassword = async function (candidatePassword) {
		return await bcrypt.compare(candidatePassword, this.password);
	};

	User.prototype.changedPasswordAfter = function (JWTTimestamp) {
	if (this.passwordChangedDate) {
		const changedTimestamp = parseInt(this.passwordChangedDate.getTime() / 1000, 10);
		return JWTTimestamp < changedTimestamp;
	}
	return false;
	};

	User.prototype.createPasswordResetToken = function () {
		const resetToken = crypto.randomBytes(32).toString("hex");
		this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
		this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
		return resetToken;
	};

	User.prototype.createEmailVerificationToken = function () {
		const verificationToken = crypto.randomBytes(32).toString("hex");
		this.emailVerificationToken = crypto.createHash("sha256").update(verificationToken).digest("hex");
		this.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
		return verificationToken;
	};

	return User;
};