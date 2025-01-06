import { getReadySessionProvider, getCredential } from "../../auth/azureAuth";
import { IActionContext } from "@microsoft/vscode-azext-utils";
import { failed } from "../utils/errorable";
import * as k8s from "vscode-kubernetes-tools-api";
import * as vscode from "vscode";
import { filterPodName, getAksClusterTreeNode, getKubernetesClusterInfo } from "../utils/clusters";
import { getExtension } from "../utils/host";
import { AutoDeployPanel, AutoDeployDataProvider } from "../../panels/AutoDeployPanel";
import { GitHubOAuthCallRequest, GitHubOAuthOptionalParams, DeveloperHubServiceClient } from "@azure/arm-devhub";

export default async function autoDeployments(_context: IActionContext, target: unknown): Promise<void> {
    console.log("Starting autoDeployments command");

    const cloudExplorer = await k8s.extension.cloudExplorer.v1;
    const clusterExplorer = await k8s.extension.clusterExplorer.v1;
    const sessionProvider = await getReadySessionProvider();
    if (failed(sessionProvider)) {
        vscode.window.showErrorMessage(sessionProvider.error);
        return;
    }

    if (!cloudExplorer.available) {
        vscode.window.showWarningMessage(`Cloud explorer is unavailable.`);
        return;
    }

    if (!clusterExplorer.available) {
        vscode.window.showWarningMessage(`Cluster explorer is unavailable.`);
        return;
    }

    const clusterNode = getAksClusterTreeNode(target, cloudExplorer);
    if (failed(clusterNode)) {
        vscode.window.showErrorMessage(clusterNode.error);
        return;
    }

    const clusterInfo = await getKubernetesClusterInfo(sessionProvider.result, target, cloudExplorer, clusterExplorer);
    if (failed(clusterInfo)) {
        vscode.window.showErrorMessage(clusterInfo.error);
        return;
    }

    const extension = getExtension();
    if (failed(extension)) {
        vscode.window.showErrorMessage(extension.error);
        return;
    }

    const clusterName = clusterNode.result.name;
    const armId = clusterNode.result.armId;
    const subscriptionId = clusterNode.result.subscriptionId;
    const resourceGroupName = clusterNode.result.resourceGroupName;

    //DevHub Client Creation

    const credential = getCredential(sessionProvider.result);

    const devHubClient = new DeveloperHubServiceClient(credential, subscriptionId);

    const dataProvider = new AutoDeployDataProvider(sessionProvider.result, subscriptionId);

    const panel = new AutoDeployPanel(extension.result.extensionUri);

    panel.show(dataProvider);

    console.log("Finished autoDeployments command");
}
