import * as devOps from 'azure-devops-node-api';
// import * as CoreApi from 'azure-devops-node-api/CoreApi';
import * as WorkItemTrackingInterfaces from 'azure-devops-node-api/interfaces/WorkItemTrackingInterfaces';
import * as WorkItemTrackingApi from 'azure-devops-node-api/WorkItemTrackingApi';
import { Authentication } from './Auth/autentication';
import { Config } from './Config/Config';
import { QueryUtils } from './Utils/QueryUtils';
import { MailBuilder } from './Utils/MailBuilder';
import { MailUtils } from './Utils/MailUtils';

async function main() {
	const config: Config = require('../config.json'); //load settings from config.json
	const auth = new Authentication(config);
	const webApi: devOps.WebApi = await auth.getApi();
	const witApi: WorkItemTrackingApi.IWorkItemTrackingApi = await webApi.getWorkItemTrackingApi();
	const queryUtils = new QueryUtils(config, webApi, witApi);
	let queryResult: WorkItemTrackingInterfaces.WorkItemQueryResult;
	queryUtils.getQueryId().then(async queryId => {
		queryResult = await queryUtils.getResultForQuery(queryId);
		let idArray = queryResult.workItems.map(element => element.id);
		let fieldsArray = queryResult.columns.map(column => column.referenceName);
		let wiList: Array<WorkItemTrackingInterfaces.WorkItem> = new Array();
		for (const id of idArray) {
			const wit = await witApi.getWorkItem(id, fieldsArray);
			wiList.push(wit);
		}
		const wiUtils = new MailBuilder(wiList, fieldsArray, config);
		const mailBody = wiUtils.createMailBody();
		const mailUtils = new MailUtils(config);
		await mailUtils.sendMail(mailBody);
		console.log(idArray);
	});
}

main().catch(console.error);
