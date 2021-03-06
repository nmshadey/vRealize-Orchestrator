/*global vcacEntity*/

/**
 * Gets the keyString from the vCAC Entity object.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.0.0
 * @function getKeyString
 * @param {vCAC:Entity} vcacEntity - vCAC Entity.
 * @returns {string} Returns the keyString.
 */

function checkParams(vcacEntity) {
    var inputErrors = [];
    var errorMessage;

    if (!vcacEntity || System.getObjectType(vcacEntity) !== "vCAC:Entity") {
        inputErrors.push(" - vcacEntity missing or not of type 'vCAC:Entity'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "getKeyString"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var keyString;

try {
    checkParams(vcacEntity);
    log.log("Getting keyString from vCAC Entity.");
    keyString = vcacEntity.keyString;
    if (keyString) {
        log.log("Found keyString: " + keyString);
    } else {
        log.error("No keyString was found.");
    }
} catch (e) {
    log.error("Action failed to get keyString from vCAC Entity.",e);
}

return keyString;