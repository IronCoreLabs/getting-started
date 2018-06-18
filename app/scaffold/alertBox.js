import * as DOM from './DOM';

export default {

    timer: undefined,

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
     * Activate both the alert box, and write a longer message to the console
     * @param {string} message
     */
    showAndOutputToConsole(message) {
        this.show(message.short);
        console.log(message.long);
    }

};