module.exports = {
    tags: ['getting-started-tutorial-test'],
    'Smoke test getting-started-tutorial' : function (client) {
      client
        .url('http://localhost:3000')
        .pause(1000);

      // Variables for max waiting times

      var apiCallTimeout = 10000;
      var alertBoxTimeout = 6000;

      // Checking that the page loaded

      client.expect.element('body').to.be.present;

      // Checking that the command logs are showing

      client.waitForElementVisible('span.log-string', apiCallTimeout);

      // Checking that the message input is showing

      client.expect.element('input#order').to.be.present;
   
      // Clicking 'Encrypt' w/o having the function added or a message inputted and checking that an alert-box appears

      client.click('button#encrypt-button');
      client.waitForElementVisible('div#alert-box', alertBoxTimeout);
      client.assert.containsText('div#alert-box', 'Please enter an order').pause;
      client.waitForElementNotVisible('div#alert-box', alertBoxTimeout);

      // Entering 'Set phasers to stun', clicking encrypt, and checking that an alert-box appears

      client.setValue('input#order', 'Set phasers to stun');
      client.click('button#encrypt-button');
      client.waitForElementVisible('div#alert-box', alertBoxTimeout);
      client.assert.containsText('div#alert-box', 'WRITE ME: Copy and paste encryptData into app/get-started-by-writing-me.js');
      client.waitForElementNotVisible('div#alert-box', alertBoxTimeout);

      // Check that the correct text appeared in the console after clicking encrypt button

      client.assert.containsText('#logger:last-child', 'WRITE ME: Copy and paste encryptData into app/get-started-by-writing-me.js');

      // Clicking 'Add' w/o having the function added and checking that an alert-box appears

      client.click('button#add-button');
      client.waitForElementVisible('div#alert-box', alertBoxTimeout);
      client.assert.containsText('div#alert-box', 'WRITE ME: Copy and paste addAwayTeamMembers into app/get-started-by-writing-me.js');
      client.waitForElementNotVisible('div#alert-box', alertBoxTimeout);
      
      // Check that the correct text appeared in the console after clicking add members button

      client.assert.containsText('#logger:last-child', 'WRITE ME: Copy and paste addAwayTeamMembers into app/get-started-by-writing-me.js');

      // Clicking 'Remove' w/o having the function added and checking that an alert-box appears

      client.click('button#remove-button');
      client.waitForElementVisible('div#alert-box', alertBoxTimeout);
      client.assert.containsText('div#alert-box', 'WRITE ME: Copy and paste removeAwayTeamMembers into app/get-started-by-writing-me.js');
      client.waitForElementNotVisible('div#alert-box', alertBoxTimeout);

      // Check that the correct text appeared in the console after clicking remove members button

      client.assert.containsText('#logger:last-child', 'WRITE ME: Copy and paste removeAwayTeamMembers into app/get-started-by-writing-me.js');

      // Checking that the log contains a message telling the user select a decryption order
      
      client.click('button#decrypt-button');
      client.waitForElementVisible('div#alert-box', alertBoxTimeout);
      client.assert.containsText('div#alert-box', 'Please enter an order id and an order to decrypt');
      client.waitForElementNotVisible('div#alert-box', alertBoxTimeout);

      client.end();
    }
  };
