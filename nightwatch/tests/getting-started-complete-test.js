module.exports = {
    'tags': ['getting-started-complete-test'],
    'Smoke test getting-started-complete': (client) => {
        const page = client.page.gettingStarted();

        page.init(client);

        // Clicking 'Encrypt' w/o having the function added or a message inputted and checking that an alert-box appears
        page.encryptButtonClick(client, 'Please enter an order');

        // Entering 'Set phasers to stun', clicking encrypt, and checking that the Encrypt table and log message appears

        page.encryptMessage(client, 'Set phasers to stun');
        page.expectEncryptTable(client);
        page.expectLog(client, `Encrypting plaintext 'Set phasers to stun'`);

        // Decryption Tests
        client.getText(page.elements.orderIDText.selector, (result) => {
            const addRemoveMemberMessage = 'Crewmembers added to group \'away-team\'';

            // Decrypting as 'Kirk'

            page.expectDecryptOrder(client, result.value, 'kirk', `Decrypting '${result.value}'`);

            // Decrypting as 'Spock' when he is not on the away-team

            page.expectDecryptOrder(client, result.value, 'spock', `Error decrypting '${result.value}'`);

            // Selecting and adding 'Spock' to the away-team

            page.expectAddMember(client, 'spock', addRemoveMemberMessage);

            // Decrypting as 'Spock' when he is on the away-team

            page.expectDecryptOrder(client, result.value, 'spock', `Decrypting '${result.value}'`);

            // Selecting and adding 'Red Shirt' to the away-team

            page.expectAddMember(client, 'redshirt', addRemoveMemberMessage);

            // Decrypting as 'Red Shirt' when he is on the away-team

            page.expectDecryptOrder(client, result.value, 'redshirt', `Decrypting '${result.value}'`);

            // Selecting and removing 'Red Shirt' from the away-team

            page.expectRemoveMember(client, 'redshirt', `Crewmembers removed from group 'away-team'`);

            // Decrypting as 'Red Shirt' when he is not on the away-team

            page.expectDecryptOrder(client, result.value, 'redshirt', `Error decrypting '${result.value}'`);

            client.end();
        });
    }
};
