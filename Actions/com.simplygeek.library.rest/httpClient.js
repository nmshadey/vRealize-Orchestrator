/**
 * Creates and returns an instance of the HttpClient object.
 * @author Gavin Stephens <gavin.stephens@simplygeek.co.uk>
 * @version 0.0.7
 * @function httpClient
 * @param {REST:RESTHost} restHost - The HTTP REST host.
 * @param {string} [acceptType] - The encoding to accept.
 * @returns {*} The HttpClient object.
 */

var logType = "Action";
var logName = "httpClient"; // This must be set to the name of the action
var Logger = System.getModule("com.simplygeek.library.util").logger(logType, logName);
var log = new Logger(logType, logName);
var reqResponse = ""; //REST API request response
var statusCode;

/**
 * Defines the HttpClient object.
 * @class
 * @param {REST:RESTHost} restHost - The HTTP REST host.
 * @param {string} [acceptType] - The encoding format to accept.
 * @returns {*} An instance of the HttpClient object.
 */

function HttpClient(restHost, acceptType) {
    this.restHost = restHost;

    if (acceptType) {
        this.acceptType = acceptType;
    } else {
        this.acceptType = "application/json";
    }

    /**
     * Defines the GET method.
     * @method
     * @param {string} restUri - The request uri.
     * @param {Properties} [headers] - A key/value set of headers to include in the request.
     * @param {number[]} [expectedResponseCodes] - A list of expected response codes.
     * @returns {*} The request response object.
     */

    this.get = function (restUri, headers, expectedResponseCodes) {
        reqResponse = this._executeRequest("GET", restUri, null, null,
                                           headers, expectedResponseCodes);

        return reqResponse;
    };

    /**
     * Defines the POST method.
     * @method
     * @param {string} restUri - The request uri.
     * @param {string} content - The request content.
     * @param {string} [contentType] - The encoding for content.
     * @param {Properties} [headers] - A key/value set of headers to include in the request.
     * @param {number[]} [expectedResponseCodes] - A list of expected response codes.
     * @returns {*} The request response object.
     */

    this.post = function (restUri, content, contentType,
                          headers, expectedResponseCodes) {
        if (!content) {
            content = "{}";
        }
        reqResponse = this._executeRequest("POST", restUri, content,
                                           contentType, headers,
                                           expectedResponseCodes);

        return reqResponse;
    };

    /**
     * Defines the PUT method.
     * @method
     * @param {string} restUri - The request uri.
     * @param {string} content - The request content.
     * @param {string} [contentType] - The encoding for content.
     * @param {Properties} [headers] - A key/value set of headers to include in the request.
     * @param {number[]} [expectedResponseCodes] - A list of expected response codes.
     * @returns {*} The request response object.
     */

    this.put = function (restUri, content, contentType,
                         headers, expectedResponseCodes) {
        reqResponse = this._executeRequest("PUT", restUri, content,
                                           contentType, headers,
                                           expectedResponseCodes);

        return reqResponse;
    };

    /**
     * Defines the DELETE method.
     * @method
     * @param {string} restUri - The request uri.
     * @param {string} content - The request content.
     * @param {string} [contentType] - The encoding for content.
     * @param {Properties} [headers] - A key/value set of headers to include in the request.
     * @param {number[]} [expectedResponseCodes] - A list of expected response codes.
     * @returns {*} The request response object.
     */

    this.delete = function (restUri, content, contentType,
                            headers, expectedResponseCodes) {
        reqResponse = this._executeRequest("DELETE", restUri, content,
                                           contentType, headers,
                                           expectedResponseCodes);

        return reqResponse;
    };

    /**
     * Defines the PATCH method.
     * @method
     * @param {string} restUri - The request uri.
     * @param {string} content - The request content.
     * @param {string} [contentType] - The encoding for content.
     * @param {Properties} [headers] - A key/value set of headers to include in the request.
     * @param {number[]} [expectedResponseCodes] - A list of expected response codes.
     * @returns {*} The request response object.
     */

    this.patch = function (restUri, content, contentType,
                           headers, expectedResponseCodes) {
        reqResponse = this._executeRequest("PATCH", restUri, content,
                                           contentType, headers,
                                           expectedResponseCodes);

        return reqResponse;
    };

    /**
     * A private method that executes the request.
     * @method
     * @private
     * @param {string} restMethod - The request method.
     * @param {string} restUri - The request uri.
     * @param {string} content - The request content.
     * @param {string} [contentType] - The encoding for content.
     * @param {Properties} [headers] - A key/value set of headers to include in the request.
     * @param {number[]} [expectedResponseCodes] - A list of expected response codes.
     * @returns {*} The request response object.
     */

    this._executeRequest = function (restMethod, restUri, content,
                                     contentType, headers,
                                     expectedResponseCodes) {
        var response;
        var maxAttempts = 5;
        var timeout = 5;
        var success = false;

        if (!expectedResponseCodes ||
            (Array.isArray(expectedResponseCodes) && expectedResponseCodes.length < 1)) {
            expectedResponseCodes = [200];
        }
        log.log("_executeRequest: " + this.restHost);
        this._createRequest(restMethod, restUri, content,
                            contentType, headers);

        log.log("Executing request...");
        log.log("URL: " + this.request.fullUrl);
        log.log("Method: " + restMethod);

        for (var i = 0; i < maxAttempts; i++) {
            try {
                response = this.request.execute();
                success = true;
                break;
            } catch (e) {
                System.sleep(timeout * 1000);
                log.warn("Connection failed: " + e + " retrying...");
                continue;
            }
        }

        if (!success) {
            log.error("Connection failed after " + maxAttempts + " attempts. Aborting.");
        }

        statusCode = response.statusCode;
        if (expectedResponseCodes.indexOf(statusCode) > -1) {
            log.log("Request executed successfully with status: " + statusCode);
        } else {
            log.error("Request failed, incorrect response code received: '" +
                      statusCode + "' expected one of: '" + expectedResponseCodes.join(",") +
                      "'\n" + response.contentAsString);
        }

        return response;
    };

    /**
     * A private method that creates the request.
     * @method
     * @private
     * @param {string} restMethod - The request method.
     * @param {string} restUri - The request uri.
     * @param {string} content - The request content.
     * @param {string} [contentType] - The encoding for content.
     * @param {Properties} [headers] - A key/value set of headers to include in the request.
     * @returns {*} The request response object.
     */

    this._createRequest = function (restMethod, restUri, content,
                                    contentType, headers) {
        var uri = encodeURI(restUri);

        log.log("Creating REST request...");
        if (restMethod === "GET") {
            this.request = this.restHost.createRequest(restMethod, uri);
        } else {
            if (!content) {
                this.request = this.restHost.createRequest(restMethod, uri);
            } else {
                if (!contentType) {
                    contentType = this.acceptType;
                }
                this.request = this.restHost.createRequest(restMethod, uri, content);
                this.request.contentType = contentType;
            }
        }

        log.log("Setting headers...");
        this._setHeaders(headers);
    };

    /**
     * A private method that sets the request headers.
     * @method
     * @private
     * @param {Properties} [headers] - A key/value set of headers to include in the request.
     */

    this._setHeaders = function (headers) {
        log.debug("Adding Header: Accept: " + this.acceptType);
        this.request.setHeader("Accept", this.acceptType);
        if (headers && (headers instanceof Properties)) {
            for (var headerKey in headers.keys) {
                var headerValue = headers.get(headerKey);
                // eslint-disable-next-line padding-line-between-statements
                log.debug("Adding Header: " + headerKey + ": " + headerValue);
                this.request.setHeader(headerKey, headerValue);
            }
        }
    };

}

return HttpClient;