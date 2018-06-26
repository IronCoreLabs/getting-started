module.exports = {
    'tags': ['getting-started-tutorial-test'],
    'Smoke test getting-started-tutorial': (client) => {
        const Message = require('../../../app/scaffold/message');
        const Page = client.page.gettingStarted();

        Page.init();

        // Clicking 'Encrypt' w/o having the function added or a message inputted and checking that an alert-box appears

        Page.encryptButtonClick(Message.noOrder);

        // Entering 'Set phasers to stun', clicking encrypt, and checking that an alert-box/log message appears

        Page.encryptMessage('Set phasers to stun');
        Page.tutorialImplementFunctionMessage(Message.stepOneTodo.short);

        // Clicking 'Add' w/o having the function added and checking that an alert-box/log message appears

        Page.clickAddButton();
        Page.tutorialImplementFunctionMessage(Message.stepThreeTodo.short);

        // Clicking 'Remove' w/o having the function added and checking that an alert-box/log message appears

        Page.clickRemoveButton();
        Page.tutorialImplementFunctionMessage(Message.stepFourTodo.short);

        // Clicking 'Decrypt' and checking that the log contains a message telling the user select a decryption order

        Page.clickDecryptButton();
        Page.expectAlert(Message.noDecryptInfo);

        client.end();
    }
};
