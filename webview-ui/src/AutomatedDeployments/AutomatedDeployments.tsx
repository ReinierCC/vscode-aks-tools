//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InitialState } from "../../../src/webview-contract/webviewDefinitions/autoDeployments";
import { VSCodeButton, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
//import { faFolder } from "@fortawesome/free-regular-svg-icons";

export function AutoDeploy(initialState: InitialState) {
    console.log("AutoDeploy Inital State:", initialState);

    const handleClick = () => {
        console.log("AutoDeploy Button Clicked!");
    };

    const handleSubmit = () => {
        console.log("TextBox Submited");
    };

    const handleInput = () => {
        console.log("TextBox Changed");
    };
    

    return (
        <>
            <h1>Launch Automated Deployments Using DevHub</h1>
            <VSCodeButton onClick={handleClick}>Click Me!</VSCodeButton>
            <br />
            <VSCodeTextField onChange={handleSubmit} onInput={handleInput} />
        </>
    );
}
