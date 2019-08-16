import * as devOps from 'azure-devops-node-api';
import * as lim from 'azure-devops-node-api/interfaces/LocationsInterfaces';
import { Config } from '../config';

export class Authentication {
	private config: Config;

	constructor(config: Config) {
		this.config = config;
	}

	public async getApi(): Promise<devOps.WebApi> {
		return new Promise<devOps.WebApi>(async (resolve, reject) => {
			try {
				let authHandler = devOps.getPersonalAccessTokenHandler(
					this.config.authToken
				);
				let vsts: devOps.WebApi = new devOps.WebApi(
					this.config.api_url,
					authHandler,
					undefined
				);
				let conn: lim.ConnectionData = await vsts.connect();
				// if (conn.authenticatedUser) {
				console.log(`Hello ${conn.authenticatedUser.providerDisplayName}`);
				// } else {
				// console.log('Hello Nothign');
				// }
				resolve(vsts);
			} catch (err) {
				reject(err);
			}
		});
	}
}
