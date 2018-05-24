module.exports = {
    tags: ['getting-started-complete-test'],
    'Smoke test getting-started-complete' : function (client) {
      client
        .url('http://localhost:3000')
        .pause(1000);

      // Variables for max waiting times

      var apiCallTimeout = 10000;
      var alertBoxTimeout = 6000;
      var orderID;

      // Checking that the page loaded

      client.expect.element('body').to.be.present;

      // Checking that the command logs are showing

      client.waitForElementVisible('span.log-string', apiCallTimeout);

      // Checking that the message input is showing

      client.expect.element('input#order').to.be.present;

   
      // Clicking 'Encrypt' w/o having the function added or a message inputted and checking that an alert-box appears

      client.click('button#encrypt-button');
      client.waitForElementVisible('div#alert-box', alertBoxTimeout);
      client.assert.containsText('div#alert-box', 'Please enter an order');
      client.waitForElementNotVisible('div#alert-box', alertBoxTimeout);

      // Entering 'Set phasers to stun', clicking encrypt, and checking that a log message appears

      client.setValue('input#order', 'Set phasers to stun');
      client.click('button#encrypt-button');
      client.waitForElementVisible('td.orderId', apiCallTimeout);
      client.assert.containsText('#logger:last-child', `Encrypting plaintext 'Set phasers to stun'`);
      
      // Decryption Tests

      client.getText('td.orderId', function(result) {

        // Decrypting as 'Kirk'

        testDecrypt(client, result.value, 'kirk', apiCallTimeout, `Decrypting '${result.value}'`);

        // Decrypting as 'Spock' when he is not on the away-team

        testDecrypt(client, result.value, 'spock', apiCallTimeout, `Error decrypting '${result.value}'`);

        // Selecting and adding 'Spock' to the away-team

        selectAndAdd(client, 'spock', apiCallTimeout, `Crewmembers added to group 'away-team'`);

        // Decrypting as 'Spock' when he is on the away-team

        testDecrypt(client, result.value, 'spock', apiCallTimeout, `Decrypting '${result.value}'`);

        // Selecting and adding 'Red Shirt' to the away-team

        selectAndAdd(client, 'redshirt', apiCallTimeout, `Crewmembers added to group 'away-team'`);

        // Decrypting as 'Red Shirt' when he is on the away-team

        testDecrypt(client, result.value, 'redshirt', apiCallTimeout, `Decrypting '${result.value}'`);

        // Selecting and removing 'Red Shirt' from the away-team

        client.click(`select#to-element option[value='redshirt']`);
        client.click('button#remove-button');
        client.expect.element('#logger:last-child').text.to.contain(`Crewmembers removed from group 'away-team'`).before(apiCallTimeout);

        // Decrypting as 'Red Shirt' when he is not on the away-team

        testDecrypt(client, result.value, 'redshirt', apiCallTimeout, `Error decrypting '${result.value}'`);

      });

      client.end();
    }
  };

function testDecrypt(client, orderId, crewMember, apiCallTimeout, expectedText) {
  client.click(`select#crew-member option[value='${crewMember}']`);
  client.click(`select#order-id-to-decrypt option[value='${orderId}']`);
  client.click('button#decrypt-button');
  client.waitForElementVisible('table#decrypted-orders', apiCallTimeout);
  client.assert.containsText('#logger:last-child', expectedText);
}

function selectAndAdd(client, crewMember, apiCallTimeout, expectText) {
  client.click(`select#from-element option[value='${crewMember}']`);
  client.click('button#add-button');
  client.expect.element('#logger:last-child').text.to.contain(expectText).before(apiCallTimeout);
}
