import { IConnection } from 'vscode-languageserver';
import { OvDocuments } from '../data-model/ov-document/OvDocuments';
import { OvServer } from '../OvServer';

/**
 * Baseclass for all feature-provider, which contains all the necessary attributes
 *
 * @export
 * @abstract
 * @class Provider
 */
export abstract class Provider {
	protected ovDocuments: OvDocuments;
	protected connection: IConnection;
	protected server: OvServer;

    /**
     * Creates an instance of Provider.
     * @param {OvServer} server server we will connect to
     * @memberof RenameProvider
     */
	constructor(server: OvServer) {
		this.server = server;
		this.ovDocuments = server.ovDocuments;
		this.connection = server.connection;
	}
}
