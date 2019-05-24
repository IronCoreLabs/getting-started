module.exports = {
    noAddMemberSelected: "Please select a crew member to add",
    noDecryptInfo: "Please enter an order id and an order to decrypt",
    noOrder: "Please enter an order",
    noRemoveMemberSelected: "Please select a crew member to remove",
    notInitialized: "You must call engage with your implementation functions",
    noBrowserSupport: {
        short: "Safari 11.1 has a bug that prevents this demo from working. Proceed with caution.",
        long: "Version 11.1 of Safari currently contains a bug which will prevent this demo from working. Proceed with caution.",
    },
    stepOneTodo: {
        short: "WRITE ME: Copy and paste encryptData into app/get-started-by-writing-me.js",
        long: `WRITE ME: Copy and paste encryptData into app/get-started-by-writing-me.js:

function encryptData(plaintext) {
    // Take the perspective of Kirk
    return Scaffold.asUser(User.kirk).then(() => {
        console.log(\`Encrypting plaintext '\${plaintext}'\`);
        // Kirk encrypts to a group so that he can decide later who is on the
        // away-team.
        const options = {
            accessList: {
                groups: [{
                    'id': model.awayTeamGroupId
                }]
            }
        };
        return IRON.document.encrypt(IRON.codec.utf8.toBytes(plaintext), options);
    });
}`,
    },
    stepTwoTodo: {
        short: "WRITE ME: Copy and paste decryptData into app/get-started-by-writing-me.js",
        long: `WRITE ME: Copy and paste decryptData into app/get-started-by-writing-me.js

function decryptData(crewmemberID, documentID, ciphertext) {
    // Take the perspective of the crew member
    return Scaffold.asUser(crewmemberID).then((iron) => {
        // Transform encrypted data from the away-team to the crewmember,
        // then decrypt data locally
        return IRON.document.decrypt(documentID, IRON.codec.base64.toBytes(ciphertext));
    });
}`,
    },
    stepThreeTodo: {
        short: "WRITE ME: Copy and paste addAwayTeamMembers into app/get-started-by-writing-me.js",
        long: `WRITE ME: Copy and paste addAwayTeamMembers into app/get-started-by-writing-me.js

function addAwayTeamMembers(crewmemberIds) {
    // Take the perspective of Kirk
    return Scaffold.asUser(User.kirk)
        .then(() => {
            // Kirk does not need to decide ahead of time who is on the
            // away team.  The decision to add new members does not require
            // modifications to the (away-team) encrypted data.
            return IRON.group.addMembers(model.awayTeamGroupId, crewmemberIds)
                .then((response) => {
                    console.log("Crewmembers added to group 'away-team'", response);
                    return response;
                })
        });
}`,
    },
    stepFourTodo: {
        short: "WRITE ME: Copy and paste removeAwayTeamMembers into app/get-started-by-writing-me.js",
        long: `WRITE ME: Copy and paste removeAwayTeamMembers into app/get-started-by-writing-me.js

function removeAwayTeamMembers(crewmemberIds) {
    // Initialize the SDK from the perspective of Kirk
    return Scaffold.asUser(User.kirk)
        .then(() => {
            // Kirk can remove away team members at any time.  The decision to
            // remove members does not require any modifications to the
            // (away-team) encrypted data.
            return IRON.group.removeMembers(model.awayTeamGroupId, crewmemberIds)
                .then((response) => {
                    console.log("Crewmembers removed from group 'away-team'", response);
                    return response;
                })
        });
}`,
    },
};
