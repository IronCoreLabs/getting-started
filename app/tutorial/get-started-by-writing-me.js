import message from "scaffold/message";
import Scaffold from "scaffold/scaffold";
import alertBox from "../scaffold/alertBox";

// These are the functions of the Starship Enterprise

/**
 * Encrypts data to the away-team group using the IronCore SDK
 *
 * @param {string} plaintext The text to be encrypted
 */
function encryptData(plaintext) {
    // TODO: Replace all of the lines below with your encryptData implementation
    alertBox.showAndOutputToConsole(message.stepOneTodo);
    return null;
}

/**
 * Decrypts data for the crewmember using the IronCore SDK
 *
 * @param {string} crewmemberID The crewmember decrypting the data
 * @param {string} documentID The id of the order to be decrypted
 * @param {string} ciphertext The ciphertext for the order
 */
function decryptData(crewmemberID, documentID, ciphertext) {
    // TODO: Replace all of the lines below with your encryptData implementation
    alertBox.showAndOutputToConsole(message.stepTwoTodo);
    return null;
}

/**
 * Add crewmembers to the away team using the IronCore SDK
 *
 * @param {Array<string>} crewmemberIds The ids of the crewmembers to be added
 */
function addAwayTeamMembers(crewmemberIds) {
    // TODO: Replace all of the lines below with your encryptData implementation
    alertBox.showAndOutputToConsole(message.stepThreeTodo);
    return null;
}

/**
 * Remove crewmembers from the away team using the IronCore SDK
 *
 * @param {Array<string>} crewmemberIds The ids of the crewmembers to be removed
 */
function removeAwayTeamMembers(crewmemberIds) {
    // TODO: Replace all of the lines below with your encryptData implementation
    alertBox.showAndOutputToConsole(message.stepFourTodo);
    return null;
}

// Engage

Scaffold.init(encryptData, decryptData, addAwayTeamMembers, removeAwayTeamMembers);
