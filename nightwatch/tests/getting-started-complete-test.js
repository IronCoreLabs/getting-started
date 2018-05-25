/* eslint-disable */

module.exports = {
    tags: ['getting-started-complete-test'],
    'Smoke test getting-started-complete' : function (client) {
      client
        .url('http://localhost:3000');

      // PageObject variable that contains page elements and functions
      var page = client.page.gettingStarted();

      // Variables for max waiting times

      var apiCallTimeout = 10000;
      var alertBoxTimeout = 6000;

      // Waiting for the page to finish loading and checking that the command logs are showing

      page.waitForLoad(client, apiCallTimeout);

      // Clicking 'Encrypt' w/o having the function added or a message inputted and checking that an alert-box appears

      page.clickEncryptButton(client);
      page.expectAlert(client, alertBoxTimeout, 'Please enter an order');

      // Entering 'Set phasers to stun', clicking encrypt, and checking that an alert-box appears

      page.encryptMessage(client, 'Set phasers to stun');
      page.expectEncryptTable(client, apiCallTimeout);
      page.expectLog(client, `Encrypting plaintext 'Set phasers to stun'`);
 
      // Decryption Tests

      client.getText(page.elements.orderIDText.selector, (result) => {

        // Decrypting as 'Kirk'

        page.expectDecryptOrder(client, result.value, 'kirk', apiCallTimeout, `Decrypting '${result.value}'`);

        // Decrypting as 'Spock' when he is not on the away-team

        page.expectDecryptOrder(client, result.value, 'spock', apiCallTimeout, `Error decrypting '${result.value}'`);

        // Selecting and adding 'Spock' to the away-team

        page.expectAddMember(client, 'spock', apiCallTimeout, `Crewmembers added to group 'away-team'`);

        // Decrypting as 'Spock' when he is on the away-team

        page.expectDecryptOrder(client, result.value, 'spock', apiCallTimeout, `Decrypting '${result.value}'`);

        // Selecting and adding 'Red Shirt' to the away-team

        page.expectAddMember(client, 'redshirt', apiCallTimeout, `Crewmembers added to group 'away-team'`);

        // Decrypting as 'Red Shirt' when he is on the away-team

        page.expectDecryptOrder(client, result.value, 'redshirt', apiCallTimeout, `Decrypting '${result.value}'`);

        // Selecting and removing 'Red Shirt' from the away-team

        client.click(`select#to-element option[value='redshirt']`);
        client.click('button#remove-button');
        client.expect.element('#logger:last-child').text.to.contain(`Crewmembers removed from group 'away-team'`).before(apiCallTimeout);

        // Decrypting as 'Red Shirt' when he is not on the away-team

        page.expectDecryptOrder(client, result.value, 'redshirt', apiCallTimeout, `Error decrypting '${result.value}'`);

        client.end();
      });
    }
  };

function selectAndAdd(client, crewMember, apiCallTimeout, expectText) {
  client.click(`select#from-element option[value='${crewMember}']`);
  client.click('button#add-button');
  client.expect.element('#logger:last-child').text.to.contain(expectText).before(apiCallTimeout);
}
