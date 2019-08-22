import { WorkItem } from 'azure-devops-node-api/interfaces/WorkItemTrackingInterfaces';
import { Config } from '../Config/Config';
import { MailConfig } from '../Config/MailConfig';

export class MailBuilder {
	private wiList: WorkItem[];
	private fieldsList: string[];
	private mailConfig: MailConfig;

	constructor(wiList: WorkItem[], fieldsList: string[], config: Config) {
		this.wiList = wiList;
		this.fieldsList = fieldsList;
		this.mailConfig = config.mailConfig;
	}

	public getGroupByClause() {
		const grpByCol = this.mailConfig.groupby;
		if (grpByCol) {
			// const onlyUnique = function(value, index, self) {
			// 	return self.indexOf(value) === index;
			// };
			return this.wiList.map(x => x.fields[grpByCol]).filter((value, index, self) => self.indexOf(value) === index);
		}
		return undefined;
	}

	public createMailBody() {
		let mailBody = `${this.mailConfig.tableStyle}<p>${this.mailConfig.mailBody}</p>` + this.getTablesToMail();
		console.log(mailBody);
		return mailBody;
	}

	public getTablesToMail() {
		const grpByColVals = this.getGroupByClause();
		let retVal = '';
		if (grpByColVals) {
			for (const value of grpByColVals) {
				retVal = retVal + `<br><br><h4>${value}</h4><table class="tg">`;
				retVal = retVal + '<tr>';
				for (const field of this.fieldsList) {
					retVal = retVal + ('<th>' + field.substring(field.indexOf('.') + 1, field.length) + '</th>');
				}
				retVal = retVal + '</tr>';
				let group = this.wiList.filter(x => x.fields[this.mailConfig.groupby] === value);
				for (const wit of group) {
					retVal = retVal + '<tr>' + this.createTableFromWorkItemFields(wit) + '</tr>';
				}
				retVal = retVal + '</table>';
			}
		} else {
			retVal = retVal + `<br><br><table class="tg">`;
			retVal = retVal + '<tr>';
			for (const field of this.fieldsList) {
				retVal = retVal + ('<th>' + field.substring(field.indexOf('.') + 1, field.length) + '</th>');
			}
			retVal = retVal + '</tr>';
			for (const wi of this.wiList) {
				retVal = retVal + '<tr>' + this.createTableFromWorkItemFields(wi) + '</tr>';
			}
			retVal = retVal + '</table>';
		}
		return retVal;
	}
	public createTableFromWorkItemFields(wi: WorkItem) {
		let retVal = '';
		for (const field of this.fieldsList) {
			const complexField: { fieldName: string; fieldDisplay: string } = this.mailConfig.complexFields.filter(
				x => x.fieldName === field
			)[0];
			const complexObj = wi.fields[field];
			if (complexField) {
				retVal =
					retVal + `<td>${complexObj[complexField.fieldDisplay] ? complexObj[complexField.fieldDisplay] : ''}</td>`;
			} else {
				retVal = retVal + `<td>${wi.fields[field] ? wi.fields[field] : ''}</td>`;
			}
		}
		return retVal;
	}
}
