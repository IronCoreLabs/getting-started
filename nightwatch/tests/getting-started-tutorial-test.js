module.exports = {
    'tags': ['getting-started-tutorial-test'],
    'Smoke test getting-started-tutorial': (client) => {
        const message = require('../../app/scaffold/message');
        const page = client.page.gettingStarted();

        page.init(client);

        // Clicking 'Encrypt' w/o having the function added or a message inputted and checking that an alert-box appears

        page.encryptButtonClick(client, 'Please enter an order');

        // Entering 'Set phasers to stun', clicking encrypt, and checking that an alert-box/log message appears

        page.encryptMessage(client, 'Set phasers to stun');
        page.tutorialImplementFunctionMessage(client, message.stepOneTodo.short);

        // Clicking 'Add' w/o having the function added and checking that an alert-box/log message appears

        page.clickAddButton(client);
        page.tutorialImplementFunctionMessage(client, message.stepThreeTodo.short);

        // Clicking 'Remove' w/o having the function added and checking that an alert-box/log message appears

        page.clickRemoveButton(client);
        page.tutorialImplementFunctionMessage(client, message.stepFourTodo.short);

        // Clicking 'Decrypt' and checking that the log contains a message telling the user select a decryption order

        page.clickDecryptButton(client);
        page.expectAlert(client, 'Please enter an order id and an order to decrypt');

        client.end();
    }
};
