import * as devOps from 'azure-devops-node-api';
// import * as CoreApi from 'azure-devops-node-api/CoreApi';
import * as WorkItemTrackingInterfaces from 'azure-devops-node-api/interfaces/WorkItemTrackingInterfaces';
import * as WorkItemTrackingApi from 'azure-devops-node-api/WorkItemTrackingApi';
import { Authentication } from './auth/autentication';
import { Config } from './config';
import { QueryUtils } from './queryDetails/queryUtils';

(async function execute() {
	const config: Config = require('../config.json'); //load settings from config.json
	const auth = new Authentication(config);
	const webApi: devOps.WebApi = await auth.getApi();
	const witApi: WorkItemTrackingApi.IWorkItemTrackingApi = await webApi.getWorkItemTrackingApi();
	// const queryList: WorkItemTrackingInterfaces.QueryHierarchyItem[] = await witApi.getQueries(
	// 	config.project,
	// 	WorkItemTrackingInterfaces.QueryExpand.None,
	// 	1
	// );
	// config.queryDetails.queryPath.split("/").forEach(
	// 	(pathElement) => {
	// 			let queryItem: WorkItemTrackingInterfaces.QueryHierarchyItem[] = queryList.filter(query=>{
	// 	query.name==config.queryDetails.
	// });
	// 	}
	// )
	// let queryItem: WorkItemTrackingInterfaces.QueryHierarchyItem[] = queryList.filter(query=>{
	// 	query.name==config.queryDetails.
	// });

	// const queryResult: WorkItemTrackingInterfaces.WorkItemQueryResult = await witApi.queryById(
	//   '7bb7d500-866f-451a-9d8c-f743e2239539'
	// );
	// console.log(JSON.stringify(queryResult));

	const queryUtils = new QueryUtils(config, webApi, witApi);
	let queryResult: WorkItemTrackingInterfaces.WorkItemQueryResult;
	queryUtils.getQueryId().then(async queryId => {
		queryResult = await queryUtils.getResultForQuery(queryId);
		let idArray = queryResult.workItems.map(element => element.id);
		let columnArray = queryResult.columns.map(column => column.referenceName);
		for (const id of idArray) {
			const wit = await witApi.getWorkItem(id, columnArray);
			console.log(wit);
		}
		console.log(idArray);
	});
})();
