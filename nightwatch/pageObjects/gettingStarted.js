/* eslint-disable */
/**
 * Actions and assertions for document list page view
 */
const gettingStartedActions = {
    waitForLoad(client, apiCallTimeout) {
        client.expect.element('body').to.be.present;
        client.waitForElementVisible(this.elements.logString.selector, apiCallTimeout);
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
    expectEncryptTable(client, apiCallTimeout) {
        client.waitForElementVisible(this.elements.orderIDText.selector, apiCallTimeout);
    },
    expectDecryptOrder(client, orderId, crewMember, apiCallTimeout, expectedText) {
        client.click(`${this.elements.decryptSelectMember.selector} option[value='${crewMember}']`);
        client.click(`${this.elements.decryptSelectOrder.selector} option[value='${orderId}'`);
        this.clickDecryptButton(client);
        client.waitForElementVisible(this.elements.decryptTable.selector, apiCallTimeout);
        this.expectLog(client, expectedText);
    },
    expectAddMember(client, crewMember, apiCallTimeout, expectedText) {
        client.click(`${this.elements.addSelectMember.selector} option[value='${crewMember}']`)
        this.clickAddButton(client);
        client.expect.element('#logger:last-child').text.to.contain(expectedText).before(apiCallTimeout);
    },
    expectRemoveMember(client, crewMember, apiCallTimeout, expectedText) {
        client.click(`select#to-element option[value='redshirt']`);
        client.click('button#remove-button');
        client.expect.element('#logger:last-child').text.to.contain(`Crewmembers removed from group 'away-team'`).before(apiCallTimeout);
    },
    expectAlert(client, alertBoxTimeout, expectedText) {
        client.waitForElementVisible(this.elements.alertBox.selector, alertBoxTimeout);
        client.assert.containsText(this.elements.alertBox.selector, expectedText);
    },
    expectLog(client, expectedText) {
        client.assert.containsText(this.elements.lastLog.selector, expectedText);
    },
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
    addButton: { selector: 'button#add-button' },
    removeButton: { selector: 'button#remove-button' },
    lastLog: { selector: '#logger:last-child' },
};

module.exports = {
    commands: [gettingStartedActions],
    elements: gettingStartedElements,
    selector: '.gettingStarted',
};