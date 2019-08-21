export class MailConfig {
	smtpHost:string;
	smtpPort:number;
	MailFrom: string;
	primaryMailTo: string;
	groupby: string;
	complexFields: { fieldName: string; fieldDisplay: string }[];
	tableStyle: string;
	mailBody:string;
}
