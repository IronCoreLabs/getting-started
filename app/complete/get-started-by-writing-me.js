import * as IRON from "@ironcorelabs/ironweb";
import * as User from "scaffold/mock-users";
import Scaffold from "scaffold/scaffold";
import model from "scaffold/model";

// These are the functions of the Starship Enterprise

/**
 * Encrypts data to the away-team group using the IronCore SDK
 *
 * @param {string} plaintext The text to be encrypted
 */
function encryptData(plaintext) {
    // Take the perspective of Kirk
    return Scaffold.asUser(User.kirk).then(() => {
        console.log(`Encrypting plaintext '${plaintext}'`);
        // Kirk encrypts to a group so that he can decide later who is on the
        // away-team.
        const options = {
            accessList: {
                groups: [
                    {
                        id: model.awayTeamGroupId,
                    },
                ],
            },
        };
        return IRON.document.encrypt(IRON.codec.utf8.toBytes(plaintext), options);
    });
}

/**
 * Decrypts data for the crewmember using the IronCore SDK
 *
 * @param {string} crewmemberID The crewmember decrypting the data
 * @param {string} documentID The id of the order to be decrypted
 * @param {string} ciphertext The ciphertext for the order
 */
function decryptData(crewmemberID, documentID, ciphertext) {
    // Take the perspective of the crew member
    return Scaffold.asUser(crewmemberID).then(() => {
        // Transform encrypted data from the away-team to the crewmember,
        // then decrypt data locally
        return IRON.document.decrypt(documentID, IRON.codec.base64.toBytes(ciphertext));
    });
}

/**
 * Add crewmembers to the away team using the IronCore SDK
 *
 * @param {Array<string>} crewmemberIds The ids of the crewmembers to be added
 */
function addAwayTeamMembers(crewmemberIds) {
    // Take the perspective of Kirk
    return Scaffold.asUser(User.kirk).then(() => {
        // Kirk does not need to decide ahead of time who is on the
        // away team.  The decision to add new members does not require
        // modifications to the (away-team) encrypted data.
        return IRON.group.addMembers(model.awayTeamGroupId, crewmemberIds).then((response) => {
            console.log("Crewmembers added to group 'away-team'", response);
            return response;
        });
    });
}

/**
 * Remove crewmembers from the away team using the IronCore SDK
 *
 * @param {Array<string>} crewmemberIds The ids of the crewmembers to be removed
 */
function removeAwayTeamMembers(crewmemberIds) {
    // Initialize the SDK from the perspective of Kirk
    return Scaffold.asUser(User.kirk).then(() => {
        // Kirk can remove away team members at any time.  The decision to
        // remove members does not require any modifications to the
        // (away-team) encrypted data.
        return IRON.group.removeMembers(model.awayTeamGroupId, crewmemberIds).then((response) => {
            console.log("Crewmembers removed from group 'away-team'", response);
            return response;
        });
    });
}

// Engage

Scaffold.init(encryptData, decryptData, addAwayTeamMembers, removeAwayTeamMembers);
