/* eslint-disable */

module.exports = {
    tags: ['getting-started-tutorial-test'],
    'Smoke test getting-started-tutorial' : function (client) {
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
      page.expectAlert(client, alertBoxTimeout, 'WRITE ME: Copy and paste encryptData into app/get-started-by-writing-me.js');

      // Check that the correct text appeared in the console after clicking encrypt button

      page.expectLog(client, 'WRITE ME: Copy and paste encryptData into app/get-started-by-writing-me.js');

      // Clicking 'Add' w/o having the function added and checking that an alert-box appears

      page.clickAddButton(client);
      page.expectAlert(client, alertBoxTimeout, 'WRITE ME: Copy and paste addAwayTeamMembers into app/get-started-by-writing-me.js');

      // Check that the correct text appeared in the console after clicking add members button

      page.expectLog(client, 'WRITE ME: Copy and paste addAwayTeamMembers into app/get-started-by-writing-me.js');

      // Clicking 'Remove' w/o having the function added and checking that an alert-box appears

      page.clickRemoveButton(client);
      page.expectAlert(client, alertBoxTimeout, 'WRITE ME: Copy and paste removeAwayTeamMembers into app/get-started-by-writing-me.js');

      // Check that the correct text appeared in the console after clicking remove members button

      page.expectLog(client, 'WRITE ME: Copy and paste removeAwayTeamMembers into app/get-started-by-writing-me.js');

      // Checking that the log contains a message telling the user select a decryption order
      
      page.clickDecryptButton(client);
      page.expectAlert(client, alertBoxTimeout, 'Please enter an order id and an order to decrypt');

      client.end();
    }
  };
