import { Config } from '../Config/Config';
// import { Authentication } from '../auth/autentication';
import * as devOps from 'azure-devops-node-api';
import * as WorkItemTrackingInterfaces from 'azure-devops-node-api/interfaces/WorkItemTrackingInterfaces';
import * as WorkItemTrackingApi from 'azure-devops-node-api/WorkItemTrackingApi';

export class QueryUtils {
	config: Config;
	webApi: devOps.WebApi;
	witApi: WorkItemTrackingApi.IWorkItemTrackingApi;

	constructor(config: Config, webApi: devOps.WebApi, witApi: WorkItemTrackingApi.IWorkItemTrackingApi) {
		this.config = config;
		this.webApi = webApi;
		this.witApi = witApi;
	}

	public async getResultForQuery(queryId: string) {
		return this.witApi.queryById(queryId);
	}

	public async getQueryId(queryPath?: string, queryName?: string): Promise<string> {
		queryPath = queryPath ? queryPath : this.config.queryDetails.queryPath;
		queryName = queryName ? queryName : this.config.queryDetails.queryName;
		const queryList: WorkItemTrackingInterfaces.QueryHierarchyItem[] = await this.witApi.getQueries(
			this.config.project,
			0,
			1
		);
		const query: Array<WorkItemTrackingInterfaces.QueryHierarchyItem | undefined> = this.getQuery(
			queryPath,
			queryName,
			queryList
		);
		return query[0].id;
	}

	private getQuery(
		queryPath: string,
		queryName: string,
		queryList: WorkItemTrackingInterfaces.QueryHierarchyItem[]
	): Array<WorkItemTrackingInterfaces.QueryHierarchyItem | undefined> {
		let retVal: Array<WorkItemTrackingInterfaces.QueryHierarchyItem | undefined>;
		let pathElements: string[] | string;
		let queryItems: WorkItemTrackingInterfaces.QueryHierarchyItem[];
		if (queryPath) {
			pathElements = queryPath.split('/') ? queryPath.split('/') : queryPath;
			queryPath = queryPath.substring(0, queryPath.indexOf('/'));
			queryItems = queryList.filter(queryItem => {
				return queryItem.name === pathElements[0] ? queryItem.children : '';
			});
			if (queryItems) {
				retVal = this.getQuery(queryPath, queryName, queryItems);
			} else {
				throw new Error('Folder ' + pathElements[0] + ' could not be found');
			}
		} else {
			retVal = queryList[0].children.filter(queryItem => {
				return queryItem.name === queryName ? queryItem : '';
			});
		}
		return retVal;
	}
}
