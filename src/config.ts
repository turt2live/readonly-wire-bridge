import * as config from "config";

interface IConfig {
    matrix: {
        csUrl: string;
        asToken: string;
        hsToken: string;
        bindAddress: string;
        bindPort: string;
        inviteUserId: string;
    };
    bridge: {
        storagePath: string;
    };
    wire: {
        email: string;
        password: string;
    };
}

export default <IConfig>config;
