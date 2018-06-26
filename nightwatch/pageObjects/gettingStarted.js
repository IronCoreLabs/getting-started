/**
 * Actions and assertions for getting-started
 */
const constants = require('../tests/constants');

const gettingStartedActions = {
    waitForLoad() {
        this.waitForElementVisible(this.elements.logString.selector, constants.apiCallTimeout);
    },
    clickEncryptButton() {
        this.click(this.elements.encryptButton.selector);
    },
    clickDecryptButton() {
        this.click(this.elements.decryptButton.selector);
    },
    clickAddButton() {
        this.click(this.elements.addButton.selector);
    },
    clickRemoveButton() {
        this.click(this.elements.removeButton.selector);
    },
    encryptMessage(msg) {
        this.setValue(this.elements.encryptInput.selector, msg);
        this.clickEncryptButton();
    },
    expectEncryptTable() {
        this.waitForElementVisible(this.elements.orderIDText.selector, constants.apiCallTimeout);
    },
    expectDecryptOrder(orderId, crewMember, expectedText) {
        this.click(`${this.elements.decryptSelectMember.selector} option[value='${crewMember}']`);
        this.waitForElementVisible(this.elements.orderIDText.selector, constants.apiCallTimeout);
        this.click(`${this.elements.decryptSelectOrder.selector} option[value='${orderId}'`);
        this.clickDecryptButton();
        this.waitForElementVisible(this.elements.decryptTable.selector, constants.apiCallTimeout);
        this.expectLog(expectedText);
    },
    expectAddMember(crewMember) {
        this.click(`${this.elements.addSelectMember.selector} option[value='${crewMember}']`)
        this.clickAddButton();
        this.expect.element(this.elements.entireLog.selector).text.to.contain(`"${crewMember}"`).before(constants.apiCallTimeout);
    },
    expectRemoveMember(crewMember, expectedText) {
        this.click(`${this.elements.removeSelectMemeber.selector} option[value='${crewMember}']`);
        this.click(this.elements.removeButton.selector);
        this.expect.element(this.elements.entireLog.selector).text.to.contain(expectedText).before(constants.apiCallTimeout);
    },
    expectAlert(expectedText) {
        this.waitForElementVisible(this.elements.alertBox.selector, constants.alertBoxTimeout);
        this.expect.element(this.elements.alertBox.selector).text.to.contain(expectedText).before(constants.apiCallTimeout);
    },
    expectLog(expectedText) {
        this.assert.containsText(this.elements.lastLog.selector, expectedText);
    },
    init() {
        this.navigate(constants.url);
        this.waitForLoad();
        this.waitForElementNotVisible(this.elements.loadBar.selector, constants.apiCallTimeout);
    },
    encryptButtonClick(message){
        this.clickEncryptButton();
        this.expectAlert(message);
    },
    tutorialImplementFunctionMessage(message){
        this.expectAlert(message);
        this.expectLog(message);
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
    addButton: { selector: '#add-button' },
    removeButton: { selector: 'button#remove-button' },
    lastLog: { selector: '#logger > span:last-child' },
    entireLog: { selector: '#logger' },
    loadBar: { selector: '#loadbar' }
};

module.exports = {
    commands: [gettingStartedActions],
    elements: gettingStartedElements,
    selector: '.gettingStarted'
};