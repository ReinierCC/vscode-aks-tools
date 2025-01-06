import { WebviewDefinition } from "../webviewTypes";

// Define the initial state passed to the webview
export interface InitialState {
    message: string; // Message to display, e.g., "Hello World!"
}

// Define messages sent from the webview to the VS Code extension
export type ToVsCodeMsgDef = {
    getGitHubAuth: void;
};

// Define messages sent from the VS Code extension to the webview
export type ToWebViewMsgDef = {};

// Combine the definitions into a single WebviewDefinition
export type AutoDeploymentsDefinition = WebviewDefinition<InitialState, ToVsCodeMsgDef, ToWebViewMsgDef>;
