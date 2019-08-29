import { Config } from '../Config/Config';
import { MailConfig } from '../Config/MailConfig';

export class MailUtils {
	mailConfig: MailConfig;

	constructor(config: Config) {
		this.mailConfig = config.mailConfig;
	}

	async sendMail(mailBody: string) {
		const nodemailer = require('nodemailer');
		// create reusable transporter object using the default SMTP transport
		let transporter = nodemailer.createTransport({
			host: this.mailConfig.smtpHost,
			port: this.mailConfig.smtpPort,
		});

		// send mail with defined transport object
		let mail = await transporter.sendMail({
			from: this.mailConfig.MailFrom, // sender address
			to: 'madhav@mail.com', // list of receivers
			subject: 'yourSubjcet', // Subject line
			// text: 'Hello world?', // plain text body
			html: mailBody,
		});

		console.log('Message sent: %s', mail.messageId);
		// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

		// Preview only available when sending through an Ethereal account
		console.log('Preview URL: %s', nodemailer.getTestMessageUrl(mail));
		// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
	}
}
