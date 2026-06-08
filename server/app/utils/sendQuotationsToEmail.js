const ejs = require('ejs');
const pdf = require('pdfkit');
const sgMail = require('@sendgrid/mail');
const { sgMailKey, emailFromSg } = require('./keys');
const fs = require('fs');
const moment = require('moment');
const { buildErrObject } = require('../middleware/utils');

const pfdConverter = (info, filepath) => {
	return new Promise((resolve, reject) => {
		var config = { format: 'A4', printBackground: true };
		pdf.create(info, config).toFile(`uploads/pdf/${filepath}.pdf`, function(err, res) {
			if (err) return reject(err);
			else resolve();
		});
	});
};

const sendToEmail = (sendTo, subject, type, filePath) => {
	return new Promise((resolve, reject) => {
		sgMail.setApiKey(sgMailKey);
		var attachment = fs.readFileSync(`uploads/pdf/${filePath}.pdf`).toString('base64');
		const msg = {
			to: sendTo,
			from: emailFromSg,
			subject: subject,
			text: subject,
			attachments: [
				{
					content: attachment,
					filename: `${type}.pdf`,
					type: 'application/pdf',
					disposition: 'attachment'
				}
			]
		};
		sgMail
			.send(msg)
			.then(() => {
				resolve();
			})
			.catch((err) => {
				console.log(err);
				resolve();
				// reject(buildErrObject(200, "Request processed but issue with"));
			});
		// await sgMail.send(msg);
	});
};

const readHtmlFile = (filePath, data) => {
	return new Promise((resolve, reject) => {
		ejs.renderFile(`views/${filePath}`, { quotation: data }, function(err, info) {
			if (err) {
				console.log(err);
				reject(buildErrObject(200, 'Request Processed but some issue with pdf generation.'));
			} else {
				resolve(info);
				// pfdConverter(info);
			}
		});
	});
};

const sendQuotationsToEmail = (type, htmlParams, emailsArray, emailSubject, pdfFilePath) => {
	return new Promise((resolve, reject) => {
		// let type = 'deliveryOrder';
		// const deviceQuotationRequestor = {
		// 	firstName: 'Afif',
		// 	lastName: 'Jazmin',
		// 	userEmail: 'jazmin@gmail.com',
		// 	userType: 'Driver Ambulance',
		// 	hospital: 'Ikram Hospital',
		// 	street: 'gulshan Colony street #03',
		// 	city: 'gujrat',
		// 	state: 'punjab',
		// 	postalCode: '50700',
		// 	country: 'pakistan',
		// 	phone: '98765456789',
		// 	serviceType: 'Breakdown Device',
		// 	quotationId: 'MYA/2021/QR01',
		// 	ref: 'MYA/SERV/21134-W',
		// 	supplier: 'Mnz Enterprise',
		// 	date: '21/09/2022',
		// 	problemList: [
		// 		{
		// 			id: 1,
		// 			desc: 'Sparetor replacement - Vantilator'
		// 		}
		// 	]
		// };

		// const quotation = {
		// 	firstName: 'Afif',
		// 	lastName: 'Jazmin',
		// 	userEmail: 'jazmin@gmail.com',
		// 	userType: 'Driver Ambulance',
		// 	hospital: 'Ikram Hospital',
		// 	street: 'gulshan Colony street #03',
		// 	city: 'gujrat',
		// 	state: 'punjab',
		// 	postalCode: '50700',
		// 	country: 'pakistan',
		// 	phone: '98765456789',
		// 	quotationId: 'MYA/2021/QR01',
		// 	ref: 'MYA/SERV/21134-W',
		// 	supplier: 'Mnz Enterprise',
		// 	date: '21/09/2022',
		// 	validity: '2 WEEKS',
		// 	deliveryTerm: 'D2D',
		// 	paymentTerm: 'PYMNT',
		// 	gross: 180.0,
		// 	discount: 0,
		// 	saleTax: 0,
		// 	totalRM: 180.0,
		// 	terms: '30DAYS',
		// 	doNumber: 'MYA/2021/D01',
		// 	problemList: [
		// 		{
		// 			id: 1,
		// 			desc: 'Sparetor replacement - Vantilator',
		// 			price: 180.0,
		// 			amount: 180.0
		// 		}
		// 	]
		// };

		// const onsiteQuotationRequestor = {
		// 	firstName: 'Afif',
		// 	lastName: 'Jazmin',
		// 	userEmail: 'jazmin@gmail.com',
		// 	userType: 'Driver Ambulance',
		// 	hospital: 'Ikram Hospital',
		// 	street: 'gulshan Colony street #03',
		// 	city: 'gujrat',
		// 	state: 'punjab',
		// 	postalCode: '50700',
		// 	country: 'pakistan',
		// 	phone: '98765456789',
		// 	serviceType: 'Breakdown Device',
		// 	quotationId: 'MYA/2021/QR01',
		// 	ref: 'MYA/SERV/21134-W',
		// 	supplier: 'Mnz Enterprise',
		// 	date: '21/09/2022',
		// 	problemList: [
		// 		{
		// 			id: 1,
		// 			desc: 'Sparetor replacement - Vantilator',
		// 			price: 229.0,
		// 			amount: 229.0
		// 		}
		// 	]
		// };
		var filePath = '';

		if (type === 'deviceQuotationRequest') {
			filePath = 'deviceQuotation.ejs';
		} else if (type === 'quotation') {
			filePath = 'quotation.ejs';
		} else if (type === 'purchaseOrder') {
			filePath = 'purchaseOrder.ejs';
		} else if (type === 'deliveryOrder') {
			filePath = 'deliveryOrder.ejs';
		} else if (type === 'invoice') {
			filePath = 'invoice.ejs';
		} else if (type === 'onsiteService') {
			filePath = 'onSiteQuotation.ejs';
		}

		readHtmlFile(filePath, htmlParams)
			.then((_htmlFile) => {
				return pfdConverter(_htmlFile, pdfFilePath);
			})
			.then(() => {
				return sendToEmail(emailsArray, emailSubject, type, pdfFilePath);
			})
			.then(() => {
				resolve(`uploads/pdf/${pdfFilePath}.pdf`);
			})
			.catch((err) => {
				console.log(err);
				reject(err);
			});
	});
};

module.exports = { sendQuotationsToEmail };
