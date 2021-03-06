/*global System Properties vmProperties diskIndex*/

/**
 * Gets the disk size for the specified disk index.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.1.0
 * @function getDiskSizeFromCustomProperties
 * @param {Properties} vmProperties - The Custom Properties payload.
 * @param {number} diskIndex - The disk index.
 * @returns {number} Returns the disk size for the specified disk index.
 */

function checkParams(vmProperties, diskIndex) {
    var inputErrors = [];
    var errorMessage;
    if (!vmProperties || !(vmProperties instanceof Properties)) {
        inputErrors.push(" - vmProperties missing or not of type 'Properties'");
    }
    if (typeof diskIndex !== "number") {
        inputErrors.push(" - diskIndex missing or not of type 'number'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "getDiskSizeFromCustomProperties"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var customPropertyKey = "VirtualMachine.Disk##index##.Size";
var friendlyLabel = "Disk Size";
var customPropertyValue;

try {
    checkParams(vmProperties, diskIndex);
    log.log("Retrieving " + friendlyLabel + " from custom properties with key: " + customPropertyKey);
    customPropertyKey = customPropertyKey.replace("##index##", diskIndex.toString());
    customPropertyValue = System.getModule("com.simplygeek.library.vcac.vm.customproperties").getValueFromCustomProperty(vmProperties,
                                                                                                                         customPropertyKey);
    log.log("Found " + friendlyLabel + ": " + customPropertyValue);
} catch (e) {
    log.error("Action failed to retrieve " + friendlyLabel + " from custom properties.",e);
}

return customPropertyValue;