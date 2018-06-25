import * as DOM from './DOM';

export default {
    /**
     * Activates the alert box
     * @param {string} text
     * @param {number} timeout
     */
    show(text, timeout = 5000) {
        DOM.alertBoxElement.innerHTML = text;
        DOM.showElement(DOM.alertBoxElement);

        // Clears the previous timeout function, if any

        if(this.timer !== undefined) {
            clearTimeout(this.timer);
        }

        // Close the alert box after 'timeout' milliseconds

        this.timer = setTimeout(() => this.hide(), timeout);

        // Close the alert box on click of the element

        DOM.alertBoxElement.addEventListener('click', () => this.hide());
    },

    hide(){
        DOM.hideElement(DOM.alertBoxElement)
    },

    /**
     * Get an object that contains the short and long (string) versions of a message
     * The short one will shown as a alert box and the long one will be written to the console
     * @param {object} message
     */
    showAndOutputToConsole(message) {
        this.show(message.short);
        console.log(message.long);
    }

};