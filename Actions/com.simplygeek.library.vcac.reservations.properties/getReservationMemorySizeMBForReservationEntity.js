/*global reservationEntity*/

/**
 * Retrieves the value of the 'ReservationMemorySizeMB' property for the provided vCAC reservation entity.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 1.0.0
 * @function getReservationMemorySizeMBForReservationEntity
 * @param {vCAC:Entity} reservationEntity - The vCAC reservation entity.
 * @returns {number} Returns the reservation memory size in MB.
 */

function checkParams(reservationEntity) {
    var inputErrors = [];
    var errorMessage;

    if (!reservationEntity || System.getObjectType(reservationEntity) !== "vCAC:Entity") {
        inputErrors.push(" - reservationEntity missing or not of type 'vCAC:Entity'");
    }
    if (inputErrors.length > 0) {
        errorMessage = "Mandatory parameters not satisfied:\n" + inputErrors.join("\n");
        log.error(errorMessage);
    }
}

var logType = "Action";
var logName = "getReservationMemorySizeMBForReservationEntity"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var propertyKey = "ReservationMemorySizeMB";
var propertyValue;

try {
    checkParams(reservationEntity);
    log.log("Retrieving property '" + propertyKey + "' from reservation entity.");
    try {
        propertyValue = System.getModule("com.simplygeek.library.vcac.entities").getPropertyValueFromVcacEntity(reservationEntity,
                                                                                                                propertyKey);
    } catch (e) {
        propertyValue = 0;
    }
    log.log("Found " + propertyKey + ": " + propertyValue);
} catch (e) {
    log.error("Action failed to get property from reservation entity.",e);
}

return propertyValue;