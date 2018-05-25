/**
 * Actions and assertions for document list page view
 */
const constants = require('../tests/constants');

const gettingStartedActions = {
    waitForLoad(client) {
        client.waitForElementVisible(this.elements.logString.selector, constants.apiCallTimeout);
        return client.expect.element('body').to.be.present;
    },
    clickEncryptButton(client) {
        client.click(this.elements.encryptButton.selector);
    },
    clickDecryptButton(client) {
        client.click(this.elements.decryptButton.selector);
    },
    clickAddButton(client) {
        client.click(this.elements.addButton.selector);
    },
    clickRemoveButton(client) {
        client.click(this.elements.removeButton.selector);
    },
    encryptMessage(client, msg) {
        client.setValue(this.elements.encryptInput.selector, msg);
        this.clickEncryptButton(client);
    },
    expectEncryptTable(client) {
        client.waitForElementVisible(this.elements.orderIDText.selector, constants.apiCallTimeout);
    },
    expectDecryptOrder(client, orderId, crewMember, expectedText) {
        client.click(`${this.elements.decryptSelectMember.selector} option[value='${crewMember}']`);
        client.click(`${this.elements.decryptSelectOrder.selector} option[value='${orderId}'`);
        this.clickDecryptButton(client);
        client.waitForElementVisible(this.elements.decryptTable.selector, constants.apiCallTimeout);
        this.expectLog(client, expectedText);
    },
    expectAddMember(client, crewMember, expectedText) {
        client.click(`${this.elements.addSelectMember.selector} option[value='${crewMember}']`)
        this.clickAddButton(client);
        client.expect.element(this.elements.lastLog.selector).text.to.contain(expectedText).before(constants.apiCallTimeout);
    },
    expectRemoveMember(client, crewMember, expectedText) {
        client.click(`${this.elements.removeSelectMemeber.selector} option[value='${crewMember}']`);
        client.click(this.elements.removeButton.selector);
        client.expect.element(this.elements.lastLog.selector).text.to.contain(expectedText).before(constants.apiCallTimeout);
    },
    expectAlert(client, expectedText) {
        client.waitForElementVisible(this.elements.alertBox.selector, constants.alertBoxTimeout);
        client.assert.containsText(this.elements.alertBox.selector, expectedText);
    },
    expectLog(client, expectedText) {
        client.assert.containsText(this.elements.lastLog.selector, expectedText);
    },
    init(client){
        client.url(constants.url);
        this.waitForLoad(client);
    },
    encryptButtonClick(client, message){
        this.clickEncryptButton(client, message);
        this.expectAlert(client, message);
    },
    tutorialImplementFunctionMessage(client, message){
        this.expectAlert(client, message);
        this.expectLog(client, message);
    }
};

const gettingStartedElements = {
    logString: { selector: 'span.log-string' },
    encryptInput: { selector: 'input#order' },
    encryptButton: { selector: 'button#encrypt-button' },
    alertBox: { selector: 'div#alert-box' },
    orderIDText: { selector: 'td.orderId' },
    decryptButton: { selector: 'button#decrypt-button' },
    decryptTable: { selector: 'table#decrypted-orders' },
    decryptSelectMember: { selector: 'select#crew-member' },
    decryptSelectOrder: { selector: 'select#order-id-to-decrypt' },
    addSelectMember: { selector: 'select#from-element' },
    removeSelectMemeber: { selector: 'select#to-element' },
    addButton: { selector: 'button#add-button' },
    removeButton: { selector: 'button#remove-button' },
    lastLog: { selector: '#logger:last-child' }
};

module.exports = {
    commands: [gettingStartedActions],
    elements: gettingStartedElements,
    selector: '.gettingStarted'
};