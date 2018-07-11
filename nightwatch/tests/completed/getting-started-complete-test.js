module.exports = {
    'tags': ['getting-started-complete-test'],
    'Smoke test getting-started-complete': (client) => {
        const Message = require('../../../app/scaffold/message');
        const Page = client.page.gettingStarted();

        Page.init();

        // Clicking 'Encrypt' w/o having the function added or a message inputted and checking that an alert-box appears
        Page.encryptButtonClick(Message.noOrder);

        // Entering 'Set phasers to stun', clicking encrypt, and checking that the Encrypt table and log message appears

        Page.encryptMessage('Set phasers to stun');
        Page.expectEncryptTable();

        // Decryption Tests
        client.getText(Page.elements.orderIDText.selector, (result) => {

            // Decrypting as 'Kirk'

            Page.expectDecryptOrder(result.value, 'kirk', `"documentID": "${result.value}"`);

            // Decrypting as 'Spock' when he is not on the away-team

            Page.expectDecryptOrder(result.value, 'spock', `"code": 301`);

            // Selecting and adding 'Spock' to the away-team

            Page.expectAddMember('spock');

            // Decrypting as 'Spock' when he is on the away-team

            Page.expectDecryptOrder(result.value, 'spock', `"documentID": "${result.value}"`);

            // Selecting and adding 'Red Shirt' to the away-team

            Page.expectAddMember('redshirt');

            // Decrypting as 'Red Shirt' when he is on the away-team

            Page.expectDecryptOrder(result.value, 'redshirt', `"documentID": "${result.value}"`);

            // Selecting and removing 'Red Shirt' from the away-team

            Page.expectRemoveMember('redshirt', `Crewmembers removed from group 'away-team'`);

            // Decrypting as 'Red Shirt' when he is not on the away-team

            Page.expectDecryptOrder(result.value, 'redshirt', `"code": 301`);

            client.end();
        });
    }
};
