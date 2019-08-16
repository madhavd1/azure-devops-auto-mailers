import * as devOps from 'azure-devops-node-api';
// import * as CoreApi from 'azure-devops-node-api/CoreApi';
import * as WorkItemTrackingInterfaces from 'azure-devops-node-api/interfaces/WorkItemTrackingInterfaces';
import * as WorkItemTrackingApi from 'azure-devops-node-api/WorkItemTrackingApi';
import { Authentication } from './auth/autentication';
import { Config } from './config';

(async function execute() {
	const config: Config = require('../config.json'); //load settings from config.json
	const auth = new Authentication(config);
	const webApi: devOps.WebApi = await auth.getApi();
	const witApi: WorkItemTrackingApi.IWorkItemTrackingApi = await webApi.getWorkItemTrackingApi();
	const allQueries: WorkItemTrackingInterfaces.QueryHierarchyItem[] = await witApi.getQueries(
		config.project,
		WorkItemTrackingInterfaces.QueryExpand.None,
		1
	);
	// let queryItem: WorkItemTrackingInterfaces.QueryHierarchyItem = allQueries.filter(query => {query.name===config.query})[0];
	if (allQueries.length > 0) {
		allQueries.forEach(async obj => {
			console.log('Sample query:', obj);
		});
	}
	// const queryResult: WorkItemTrackingInterfaces.WorkItemQueryResult = await witApi.queryById(
	//   '7bb7d500-866f-451a-9d8c-f743e2239539'
	// );
	// console.log(JSON.stringify(queryResult));
})();
