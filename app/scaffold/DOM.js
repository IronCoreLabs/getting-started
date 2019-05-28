import * as IRON from "@ironcorelabs/ironweb";

export const addButton = document.getElementById("add-button");
export const alertBoxElement = document.getElementById("alert-box");
export const crewmemberElement = document.getElementById("crew-member");
export const decryptButton = document.getElementById("decrypt-button");
export const decryptedOrdersContainer = document.getElementById("decrypted-orders-container");
export const decryptedOrdersTable = document.getElementById("decrypted-orders");
export const encryptButton = document.getElementById("encrypt-button");
export const encryptedOrdersContainer = document.getElementById("encrypted-orders-container");
export const fromElement = document.getElementById("from-element");
export const orderCipherTextElement = document.getElementById("order-ciphertext");
export const orderIdToDecryptSelect = document.getElementById("order-id-to-decrypt");
export const orderListElement = document.getElementById("decrypted-orders");
export const orderPlainTextElement = document.getElementById("order");
export const removeButton = document.getElementById("remove-button");
export const toElement = document.getElementById("to-element");
export const encryptedOrdersTable = document.getElementById("encrypted-orders");
export const loggerElement = document.getElementById("logger");
export const loggedInUserHeadshot = document.getElementById("crew-member-headshot");
export const loadBar = document.getElementById("loadbar");

// Some simple DOM utilities to minimize dependencies

export function appendOrderId(selectElement, orderId) {
    // append to the orderIdToDecrypt select element

    const option = document.createElement("option");
    option.text = orderId;
    option.value = orderId;

    selectElement.appendChild(option);
}

/**
 * Appends an order to the ordersTable.
 *
 * @param {*} ordersTable The table to append to
 * @param {*} id The order id (IronCore document id)
 * @param {*} text The order text
 */
export function appendOrder(ordersTable, id, text) {
    // add document ID and text as cells
    const row = buildRow(2, "", ["orderId", "orderText"]);
    row.cells[0].appendChild(document.createTextNode(id));
    row.cells[1].appendChild(document.createTextNode(text));
    // append the row to the encrypted orders table
    ordersTable.appendChild(row);
    return row;
}

/**
 * build a table row
 *
 * @param {*} n number of cells to include in table
 * @param {*} rowClassName optional tr class name
 * @param {*} cellClassName optional td class name
 */
export function buildRow(n, rowClassName, cellClassNames) {
    const classNames = cellClassNames || [];
    const row = document.createElement("tr");
    if (rowClassName) {
        row.setAttribute("class", rowClassName);
    }

    for (let i = 0; i < n; i++) {
        const td = buildTableCell(classNames.length > i ? classNames[i] : undefined);
        row.appendChild(td);
    }
    return row;
}

/**
 * Return an li element with optional class attribute
 *
 * @param {*} className optional li class name
 */
export function buildListItem(className) {
    const li = document.createElement("li");
    if (className) {
        li.setAttribute("class", "decryptedOrder");
    }
    return li;
}

/**
 * Return a td element with optional class attribute
 *
 * @param {*} className optional td class name
 */
function buildTableCell(className) {
    const td = document.createElement("td");
    if (className) {
        td.setAttribute("class", className);
    }
    return td;
}

/**
 * Configures textbox to accelerate a button click on enter
 *
 * @param {*} textbox DOM text input element
 * @param {*} button  DOM button element
 */
export function configureClickOnEnter(textbox, button) {
    textbox.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            button.click();
        }
    });
}

/**
 * Replaces console.log with a version that writes to the page,
 * then chains to original
 *
 * @param {*} logger DOM element to receive log output
 */
export function configurePageLogger(logger) {
    if (!logger) {
        return;
    }

    // replace verbose Uint8Array with [...] in html log
    const replacer = (x, y) => {
        if (y instanceof Uint8Array) {
            return "[...]";
        }
        return y;
    };

    console.old = console.log;
    console.log = function(...args) {
        let output = "",
            arg,
            i;

        for (i = 0; i < args.length; i++) {
            arg = args[i];
            output += `<span class="log-${typeof arg}">`;

            if (typeof arg === "object" && typeof JSON === "object" && typeof JSON.stringify === "function") {
                output += JSON.stringify(arg, replacer, 4);
            } else {
                output += arg;
            }

            output += "</span>&nbsp;";
        }

        logger.innerHTML += output;
        if (logger.lastElementChild) {
            logger.lastElementChild.scrollIntoView(false);
        }
        console.old.apply(undefined, args);
    };
}

/**
 * Returns an array of multiple selected option values
 *
 * @param {*} select DOM select element
 */
export function getSelectedValues(select) {
    return [...select.options].filter((option) => option.selected).map((option) => option.value);
}

/**
 * Hides a DOM element
 *
 * @param {*} element
 */
export function hideElement(element) {
    element.style.display = "none";
}

/**
 * Moves items between a pair of select DOM elements
 *
 * @param {*} from DOM select element that is the source
 * @param {*} to DOM select elmeent that is the destination
 * @param {*} matchFn selection function, defaults to option.selected
 */
export function moveItemsBetweenSelects(from, to, matchFn) {
    const fn = matchFn || ((o) => o.selected);

    // Move options to target
    [...from.options].forEach((o) => {
        if (fn(o)) {
            to.options[to.options.length] = new Option(o.text, o.value);
        }
    });

    // Remove options from source (yes, it's imperative)
    for (let i = from.options.length - 1; i >= 0; i--) {
        if (fn(from.options[i])) {
            from.options[i] = null;
        }
    }
}

/**
 * Removes select options that pass filter function
 *
 * @param {*} select DOM select element
 * @param {*} fn filter function, return true to remove option
 */
export function removeOptions(select, fn) {
    for (let i = select.options.length - 1; i >= 0; i--) {
        if (fn(select.options[i])) {
            select.options[i] = null;
        }
    }
}

/**
 * Remove all options whose value matches an array value
 *
 * @param {*} select DOM select element
 * @param {*} values options with a value contained in this array will be removed
 */
export function removeOptionsByValue(select, values) {
    removeOptions(select, (option) => values.some(option.value));
}

export function scrollIntoViewIfNeeded(element) {
    if (!element || !element.scrollIntoView) {
        return;
    }

    const rect = element.getBoundingClientRect();
    if (rect.bottom > window.innerHeight) {
        element.scrollIntoView(false);
    }
    if (rect.top < 0) {
        element.scrollIntoView();
    }
}

/**
 * Selects option by value
 *
 * @param {Element} select DOM select element
 * @param {*} value value to match
 */
export function selectByValue(select, value) {
    [...select.options].forEach((option) => {
        option.selected = option.value === value;
    });
}

/**
 * Show a DOM element
 *
 * @param {*} element
 */
export function showElement(element) {
    element.style.display = "block";
}

// These would be in a component view class if we weren't using vanilla js

export function appendEncryptedOrder(id, bytes) {
    if (bytes) {
        const result = appendOrder(encryptedOrdersTable, id, IRON.codec.base64.fromBytes(bytes));
        appendOrderId(orderIdToDecryptSelect, id);
        showElement(encryptedOrdersContainer);
        return result;
    }
}

export function appendDecryptedOrder(id, text) {
    const result = appendOrder(decryptedOrdersTable, id, text);
    showElement(decryptedOrdersContainer);
    return result;
}

export function clearDecryptedOrders() {
    orderListElement.innerHTML = "";
    hideElement(decryptedOrdersContainer);
}

// Event Listeners and Configuration
// (UI related, listeners that call IronCore in index.js)

configureClickOnEnter(orderPlainTextElement, encryptButton);

fromElement.addEventListener("change", () => {
    addButton.disabled = false;
});

toElement.addEventListener("change", () => {
    removeButton.disabled = false;
});
