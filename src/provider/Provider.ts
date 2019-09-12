import { IConnection } from 'vscode-languageserver';
import { OvDocuments } from '../data-model/ov-document/OvDocuments';
import { OvServer } from '../OvServer';

export abstract class Provider {
	protected ovDocuments: OvDocuments;
	protected connection: IConnection;
	protected server: OvServer;

	constructor(server: OvServer) {
		this.server = server;
		this.ovDocuments = server.ovDocuments;
		this.connection = server.connection;
	}
}