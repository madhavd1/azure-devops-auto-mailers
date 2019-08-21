import { QueryConfig } from './QueryConfig';
import { MailConfig } from './MailConfig';

export class Config {
	api_url: string;
	authToken: string;
	project: string;
	queryDetails: QueryConfig;
	mailConfig: MailConfig;
}
