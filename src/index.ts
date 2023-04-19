import {
    Context,
    LoginData,
} from "@wireapp/api-client/lib/auth";
import { ClientType } from "@wireapp/api-client/lib/client";
import config from "./config";
import { APIClient } from "@wireapp/api-client";
import { LogService } from "matrix-bot-sdk";
import { FileEngine } from "@wireapp/store-engine-fs";
import * as path from "path";
import { Account } from "@wireapp/core";
import { PayloadBundleType } from "@wireapp/core/lib/conversation";

const credentials: LoginData = {
    clientType: ClientType.PERMANENT,
    email: config.wire.email,
    password: config.wire.password,
};

(async function () {
    const wirePath = path.join(config.bridge.storagePath, "wire");
    const wireStoreOpts = {fileExtension: ".json"};
    const wireStore = new FileEngine(wirePath, wireStoreOpts);
    await wireStore.init(wirePath, wireStoreOpts);

    LogService.info("index", `Logging in to Wire with ${credentials.email}`);
    // const wireApi = new APIClient();
    const wireAcc = new Account(undefined, {createStore: () => Promise.resolve(wireStore)});
    // wireApi.on(APIClient.TOPIC.ACCESS_TOKEN_REFRESH, async (accessToken: AccessTokenData) => {
    //     await wireStore.updateOrCreate(AUTH_TABLE_NAME, AUTH_ACCESS_TOKEN_KEY, accessToken);
    //     LogService.debug("index#wireOnTokenRefresh", "Access token saved");
    // });
    // wireApi.on(APIClient.TOPIC.COOKIE_REFRESH, async (cookie?: Cookie) => {
    //     if (!cookie) return;
    //     const entity = {expiration: cookie.expiration, zuid: cookie.zuid};
    //     await wireStore.updateOrCreate(AUTH_TABLE_NAME, AUTH_COOKIE_KEY, entity);
    //     LogService.debug("index#wireOnCookieRefresh", "Cookie saved");
    // });

    let context: Context;
    // try {
    //     const { expiration, zuid } = await wireStore.read<Cookie>(AUTH_TABLE_NAME, AUTH_COOKIE_KEY);
    //     const cookie = new Cookie(zuid, expiration);
    //     LogService.info("index", `Logging into Wire using cookie with zuid=${zuid}`);
    //     context = await wireAcc.init(credentials.clientType, {cookie});
    // } catch (e) {
    //     LogService.info("index", "Failed to log in to Wire with existing cookie (there might not be one)", e);
    //     LogService.info("index", "Logging into Wire using username/password");
    //     context = await wireAcc.login(credentials);
    // }

    context = await wireAcc.login(credentials);
    LogService.info("index", `Logged in to Wire as uid=${context.userId}`);

    // @ts-ignore
    wireAcc.on(PayloadBundleType.TEXT, (data) => {
        LogService.info("index#onText", data);
    });
    await wireAcc.listen();

    // const wsClient = await wireApi.connect();
    // wsClient.on(WebSocketClient.TOPIC.ON_MESSAGE, notification => {
    //     LogService.info("index#onMessage", notification);
    //     for (const payload of notification.payload) {
    //         if (payload.type === "conversation.otr-message-add") {
    //             console.log(payload.data);
    //         }
    //     }
    // });
})();
