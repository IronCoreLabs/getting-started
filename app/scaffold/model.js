/**
 * As you build each step of the tutorial your browser will refresh,
 * clearing any input data you've provided.  Which turns out to be
 * quite annoying.
 *
 * This wrapper uses local (session) storage to save and restore
 * your input.
 *
 * Closing your browser tab and re-opening it will start a new session.
 */

const awayTeamGroupIdKey = "awayTeamGroupId";
const awayTeamMembersIdKey = "awayTeamMembersIdKey";
const currentUserIdKey = "currentUserId";
const ordersKey = "orders";

/**
 * # hasLocalStorage()
 *
 * returns `true` or `false` depending on whether localStorage is supported or not.
 * Beware that some browsers like Safari do not support localStorage in private mode.
 *
 * inspired by this cappuccino commit
 * https://github.com/cappuccino/cappuccino/commit/063b05d9643c35b303568a28809e4eb3224f71ec
 *
 * @returns {Boolean}
 */
function hasLocalStorage() {
    try {
        // we've to put this in here. I've seen Firefox throwing `Security error: 1000`
        // when cookies have been disabled
        if (typeof localStorage === "undefined") {
            return false;
        }

        // Just because localStorage exists does not mean it works. In particular
        // it might be disabled as it is when Safari's private browsing mode is
        // active.
        localStorage.setItem("Storage-Test", "1");

        // that should not happen ...
        if (localStorage.getItem("Storage-Test") !== "1") {
            return false;
        }

        // okay, let's clean up if we got here.
        localStorage.removeItem("Storage-Test");
    } catch (_error) {
        // in case of an error, like Safari's Private Mode, return false
        return false;
    }
    // we're good.
    return true;
}

class Model {
    constructor() {
        this.awayTeamGroupId = null;
        this.currentUserId = null;
        this.hasLocalStorage = hasLocalStorage();
        this.isNewSession = true;
        this.orders = [];
        this.awayTeamMemberIds = [];
    }

    addAwayTeamMembers(ids) {
        this.awayTeamMemberIds = this.awayTeamMemberIds.concat(ids);
        this.setObject(awayTeamMembersIdKey, this.awayTeamMemberIds);
    }

    appendOrder(id, bytes) {
        this.orders.push({
            id,
            bytes,
        });
        this.setObject(ordersKey, this.orders);
    }

    findOrder(id) {
        return this.orders
            .map((order) => {
                return order.id === id ? order.bytes : "";
            })
            .filter((element) => element.length > 0)[0];
    }

    removeAwayTeamMembers(ids) {
        const fn = (id) => !ids.some((memberId) => memberId === id);
        this.awayTeamMemberIds = this.awayTeamMemberIds.filter(fn);
        this.setObject(awayTeamMembersIdKey, this.awayTeamMemberIds);
    }

    restore() {
        if (this.hasLocalStorage) {
            this.awayTeamGroupId = sessionStorage.getItem(awayTeamGroupIdKey);
            this.currentUserId = sessionStorage.getItem(currentUserIdKey);
            this.orders = Model.getObject(ordersKey) || [];
            this.isNewSession = !this.awayTeamGroupId;

            // In a later tutorial, we'll remove this line and restore
            // the group by querying the IronCore SDK group endpoint
            // for members
            this.awayTeamMemberIds = Model.getObject(awayTeamMembersIdKey) || [];
        }
    }

    setAwayTeamGroupId(value) {
        this.awayTeamGroupId = value;
        this.setItem(awayTeamGroupIdKey, value);
    }

    setCurrentUserId(value) {
        this.currentUserId = value;
        this.setItem(currentUserIdKey, value);
    }

    setItem(key, value) {
        if (this.hasLocalStorage) {
            sessionStorage.setItem(key, value);
        }
    }

    static getObject(key) {
        try {
            return JSON.parse(sessionStorage.getItem(key));
        } catch (e) {
            console.log("Expected session storage to return a JSON object", e);
        }
    }

    setObject(key, value) {
        this.setItem(key, JSON.stringify(value));
    }
}

/**
 * Export the one and only Model
 */
export default new Model();
