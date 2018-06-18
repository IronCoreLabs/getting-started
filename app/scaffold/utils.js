/**
 * Get user passcode, in a real-world situation, this should get a password entered by the user in your application's UI.
 */
export function getUserPasscode() {
    return new Promise((resolve) => {
        resolve('SAMPLE_PASSCODE');
    });
}

/**
 * Get valid JWT from server endpoint. This is used to validate your user.
 */
export function requestJWT(userID = '1') {
    return fetch(`/generateJWT/${userID}`)
        .then((response) => response.text())
        .catch(console.log);
}

/**
 * call a function at most one time once (copied from underscore)
*/
export function once(func) {
    let ran = false, memo;
    return function(...args) {
        if (ran) return memo;
        ran = true;
        memo = func.apply(this, args);
        // eslint-disable-next-line no-param-reassign
        func = null;
        return memo;
    };
}

/**
 * check if the current browser is Safari if so return true, if not return false.
*/
export function isSafari(){
    return window.safari !== undefined;
}

/**
 * Check browser compatibility. If on Safari 11.1 show error.
 */
export function checkBrowser(alertBox, message) {
    const unsupportedBrowserVersion = window.navigator.appVersion.indexOf("Version/11.1");
    if (isSafari() && unsupportedBrowserVersion !== -1) {
        alertBox.showAndOutputToConsole(message);
    }
}