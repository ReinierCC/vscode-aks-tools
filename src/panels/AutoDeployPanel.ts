import * as vscode from "vscode";
import { BasePanel, PanelDataProvider } from "./BasePanel";
import {
    InitialState,
    TelemetryDefinition,
    ToVsCodeMsgDef,
    ToWebviewMessageSink,
} from "../webview-contract/webviewTypes";
import { MessageHandler } from "../webview-contract/messaging";
import { GitHubOAuthCallRequest, GitHubOAuthOptionalParams, DeveloperHubServiceClient } from "@azure/arm-devhub";
import { getReadySessionProvider, getCredential } from "../auth/azureAuth";
import { ReadyAzureSessionProvider } from "../auth/types";

export class AutoDeployPanel extends BasePanel<"autoDeploy"> {
    constructor(extensionUri: vscode.Uri) {
        // Call the BasePanel constructor with the required contentId and command keys
        super(extensionUri, "autoDeploy", {});
    }
}

export class AutoDeployDataProvider implements PanelDataProvider<"autoDeploy"> {
    private readonly _devHubClient: DeveloperHubServiceClient;
    constructor(
        readonly sessionProvider: ReadyAzureSessionProvider,
        readonly subscriptionId: string,
    ) {
        this._devHubClient = new DeveloperHubServiceClient(getCredential(sessionProvider), subscriptionId);
    }

    getTitle(): string {
        return `Auto Deployments with DevHub`;
    }

    getInitialState(): InitialState<"autoDeploy"> {
        return {
            message: "Hello World!",
        };
    }

    getTelemetryDefinition(): TelemetryDefinition<"autoDeploy"> {
        return {
            getGitHubAuth: false,
        }; // No telemetry required for Hello World
    }

    getMessageHandler(webview: ToWebviewMessageSink<"autoDeploy">): MessageHandler<ToVsCodeMsgDef<"autoDeploy">> {
        return {
            getGitHubAuth: async () => {
                //Command on the webview side would be getGitHubAuth
                console.log("getGitHubAuth message received");
            },
        }; // No message handling required for Hello World
    }
}
