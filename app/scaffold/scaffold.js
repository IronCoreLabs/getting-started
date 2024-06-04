import * as IRON from "@ironcorelabs/ironweb";
import alertBox from "./alertBox";
import * as DOM from "./DOM";
import Message from "./message";
import * as User from "./mock-users";
import model from "./model";
import * as Utils from "./utils";

class Scaffold {
    constructor() {
        // Implement these functions and call engage to complete the getting
        // started tutorial
        this.encryptDataFn = () => null;
        this.decryptDataFn = () => null;
        this.addAwayTeamMembersFn = () => null;
        this.removeAwayTeamMembersFn = () => null;

        this.IRON = null;
        this.currentUserId = null;
        this.wait = null;
    }

    /**
     * Switch the decryption perspective to the specified user
     *
     * @param {*} userId the user id who we should be decrypting to
     */
    asUser(userId) {
        if (this.wait === null) {
            alertBox.show(Message.notInitialized);
            return;
        }

        return this.wait.then(() => {
            // one user at a time
            this.wait = this._asUser(userId);
            return this.wait;
        });
    }

    /**
     * Initialize the scaffolding
     *
     * @param {Function} encryptDataFn Your implementation of encrypt
     * @param {Function} decryptDataFn Your implementation of decrypt
     * @param {Function} addAwayTeamMembersFn Your implementation of addAwayTeamMembers
     * @param {Function} removeAwayTeamMembersFn Your implementation of removeAwayTeamMembers
     */
    init(encryptDataFn, decryptDataFn, addAwayTeamMembersFn, removeAwayTeamMembersFn) {
        // Save the getting started functions

        this.encryptDataFn = encryptDataFn;
        this.decryptDataFn = decryptDataFn;
        this.addAwayTeamMembersFn = addAwayTeamMembersFn;
        this.removeAwayTeamMembersFn = removeAwayTeamMembersFn;

        // We keep track of the current state of the UI in sessionStorage

        model.restore();

        // Listen

        this.addListeners();

        // There is currently a bug in Safari 11.1 that causes this app to break. If a user is on Safari 11.1 display an error.

        Utils.checkBrowser(alertBox, Message.noBrowserSupport);

        // Every time there is a new session, create a new away-team.
        // This allows us to provide a getting started experience without
        // collisions or registration.

        if (model.isNewSession) {
            this.wait = this._asUser(User.kirk)
                .then((iron) => {
                    DOM.showElement(DOM.loadBar);
                    // create a new random away team on a new session
                    return Scaffold._createAwayTeam(iron);
                })
                .then(() => {
                    DOM.hideElement(DOM.loadBar);
                });
            return;
        }

        // We're restoring a session, so inflate the view

        console.log("Session restored\n(to start a new session, close tab and reopen)");

        DOM.selectByValue(DOM.crewmemberElement, model.currentUserId);
        DOM.loggedInUserHeadshot.src = `../../assets/${model.currentUserId}.jpg`;

        model.orders.forEach((order) => DOM.appendEncryptedOrder(order.id, order.bytes));
        DOM.moveItemsBetweenSelects(DOM.fromElement, DOM.toElement, (o) => model.awayTeamMemberIds.some((id) => id === o.value));

        // And restore our current crewmember perspective

        this.wait = this._asUser(model.currentUserId);
    }

    /**
     * Should be considered private.  Optimizes user switching.
     *
     * @param {string} userId
     */
    _asUser(userId) {
        // No need to switch
        if (this.currentUserId === userId) {
            return Promise.resolve(this.IRON);
        }

        DOM.showElement(DOM.loadBar);

        // IronCore integrates with your existing identity infrastructure
        // by accepting an asserted identity.  To make it easy to provide
        // a getting started tutorial, we sign the identity token with a local
        // server and password protect the key with a static passcode.
        //
        // This is not a secure approach, but it's useful for tutorial purposes.
        // In a later tutorial, we'll explain what we just said and why, and
        // we'll show you the proper way to do it.
        return IRON.initialize(() => Utils.requestJWT(userId), Utils.getUserPasscode).then(() => {
            console.log(`As user id ${userId}`);
            DOM.hideElement(DOM.loadBar);
            this.currentUserId = userId;
            model.setCurrentUserId(userId);
        });
    }

    /**
     * Create a random group to represent the away-team
     */
    static _createAwayTeam() {
        return IRON.group
            .create({
                groupName: "away-team",
            })
            .then((group) => {
                model.setAwayTeamGroupId(group.groupID);
                console.log("Away team group created", group);
                return group;
            });
    }

    /**
     * Add DOM listeners in an archaic way to avoid framework dependencies
     */
    addListeners() {
        // Call the add implementation and handle ux
        DOM.addButton.addEventListener("click", () => {
            const crewmemberIdsToAdd = DOM.getSelectedValues(DOM.fromElement);

            // if add has been implemented, reflect changes in model and view
            const addMembersPromise = this.addAwayTeamMembersFn(crewmemberIdsToAdd);
            if (!addMembersPromise) {
                return;
            }

            if (crewmemberIdsToAdd.length === 0) {
                alertBox.show(Message.noAddMemberSelected);
            } else {
                DOM.showElement(DOM.loadBar);
            }

            model.addAwayTeamMembers(crewmemberIdsToAdd);
            DOM.moveItemsBetweenSelects(DOM.fromElement, DOM.toElement);

            addMembersPromise.then(() => {
                DOM.hideElement(DOM.loadBar);
                console.log("Successfully added new members to away-team");
            });

            // clear decrypted orders if currently selected
            // crewmember is part of the operation

            if (crewmemberIdsToAdd.some((id) => id === DOM.crewmemberElement.value)) {
                DOM.clearDecryptedOrders();
            }
        });

        // Switch users
        DOM.crewmemberElement.addEventListener("change", () => {
            // Erase the decrypted orders on a change in user
            DOM.orderListElement.innerHTML = "";
            DOM.loggedInUserHeadshot.src = `../../assets/${DOM.crewmemberElement.value}.jpg`;
            DOM.hideElement(DOM.decryptedOrdersContainer);
            this.asUser(DOM.crewmemberElement.value);
        });

        // Call the decrypt function and handle ux
        DOM.decryptButton.addEventListener("click", () => {
            const crewmemberID = DOM.crewmemberElement.value;
            const orderId = DOM.orderIdToDecryptSelect.value;
            const orderCipherText = DOM.orderCipherTextElement.value;

            if (!orderId || !orderCipherText) {
                return alertBox.show(Message.noDecryptInfo);
            }

            // Short circuit if decryptData has not been written yet
            const promise = this.decryptDataFn(crewmemberID, orderId, orderCipherText);
            if (!promise) {
                return;
            }

            DOM.showElement(DOM.loadBar);

            promise
                .then((decrypted) => {
                    DOM.hideElement(DOM.loadBar);
                    console.log(`Decrypted '${orderId}'`, decrypted);
                    const plaintext = IRON.codec.utf8.fromBytes(decrypted.data);
                    const row = DOM.appendDecryptedOrder(orderId, plaintext);
                    DOM.scrollIntoViewIfNeeded(row, false);
                })
                .catch((error) => {
                    DOM.hideElement(DOM.loadBar);
                    console.log(`Error decrypting '${orderId}'`, error);
                    // add the error message to the table

                    let {message} = error;

                    if (error.code === 301) {
                        message = "Crew member not authorized";
                    } else if (error.code === 0) {
                        message = "Red alert, message has been tampered with";
                    }
                    const row = DOM.appendDecryptedOrder(orderId, message);
                    DOM.scrollIntoViewIfNeeded(row);
                });

            // clear the input
            DOM.orderIdToDecryptSelect.value = "";
            DOM.orderCipherTextElement.value = "";
        });

        // Call the encrypt implementation and handle ux
        DOM.encryptButton.addEventListener("click", () => {
            const order = DOM.orderPlainTextElement.value;
            // guard
            if (!order) {
                return alertBox.show(Message.noOrder);
            }

            // Short circuit if this hasn't been written yet
            const promise = this.encryptDataFn(order);
            if (!promise) {
                return;
            }

            DOM.showElement(DOM.loadBar);

            // clear the input field
            DOM.orderPlainTextElement.value = "";

            // encrypt, adding the result to the ui asynchronously
            promise.then((encrypted) => {
                DOM.hideElement(DOM.loadBar);
                console.log(encrypted);

                // Model / View
                model.appendOrder(encrypted.documentID, encrypted.document);
                DOM.appendEncryptedOrder(encrypted.documentID, encrypted.document);
            });
        });

        // Populate the ciphertext input on order selection
        DOM.orderIdToDecryptSelect.addEventListener("change", () => {
            const order = model.findOrder(DOM.orderIdToDecryptSelect.value);
            DOM.orderCipherTextElement.value = order ? IRON.codec.base64.fromBytes(order) : "";
        });

        // Call remove implementation and handle ux
        DOM.removeButton.addEventListener("click", () => {
            const crewmemberIdsToRemove = DOM.getSelectedValues(DOM.toElement);

            // if remove has been implemented, reflect changes in model and view
            const removeMembersPromise = this.removeAwayTeamMembersFn(crewmemberIdsToRemove);
            if (!removeMembersPromise) {
                return;
            }

            if (crewmemberIdsToRemove.length === 0) {
                alertBox.show(Message.noRemoveMemberSelected);
            } else {
                DOM.showElement(DOM.loadBar);
            }

            model.removeAwayTeamMembers(crewmemberIdsToRemove);
            DOM.moveItemsBetweenSelects(DOM.toElement, DOM.fromElement);

            removeMembersPromise.then(() => {
                DOM.hideElement(DOM.loadBar);
                console.log("Successfully removed new members to away team");
            });

            // clear decrypted orders if currently selected
            // crewmember is part of the operation

            if (crewmemberIdsToRemove.some((id) => id === DOM.crewmemberElement.value)) {
                DOM.clearDecryptedOrders();
            }
        });

        // Hook console.log so we see what's happening behind the scenes
        DOM.configurePageLogger(DOM.loggerElement);
    }
}

export default new Scaffold();
