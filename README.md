# Getting Started

IronCore is an SDK and cloud service that keeps application data private and
secure. Get started with IronCore to grant, monitor and revoke access to
sensitive data in just a few minutes.

### Clone, install, start

```bash
git clone https://github.com/IronCoreLabs/getting-started.git
cd quickstart
npm install
npm start
```

### Browse to the app

The project is configured to run a local dev server on [localhost:3000](http://localhost:3000).

### Your mission

Your mission is to develop an application for Captain James T. Kirk of the Starship Enterprise. When the Enterprise explores a new planet, Captain Kirk selects crewmembers to visit the planet surface. These crewmembers are called the `away-team`. Kirk needs to be able to give the `away-team` orders without having the commands be seen by adversaries.

```text
As the captain of the Starship Enterprise,
I want a way to securely share commands with my away team,
So that Romulans and Klingons do not intercept my commands and kill us.
```

When you load the application for the first time, it automatically logs in as Captain Kirk and creates an `away-team` group. You will see log output on the right side that lools similar to:

```json
As user id kirk
Away team group created {
    "groupID": "36e9a398f1f72a0696d5ba7ee096fbec",
    "groupName": "away-team",
    "isAdmin": true,
    "isMember": true,
    "groupAdmins": [
        "kirk"
    ],
    "groupMembers": [
        "kirk"
    ]
}
```

> Throughout this README, your log output will be similar, but not exactly the same as that shown.

### Encrypt

Before you can encrypt, you need to write some code. Open `app/tutorial/get-started-by-writing-me.js` and search on TODO to find the stub for `encryptData`. Then copy and paste the code below. [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) are used since encryption occurs locally in the browser and completes asynchronously.

```javascript
function encryptData(plaintext) {
    // Take the perspective of Kirk
    return Scaffold.asUser(User.kirk).then(() => {
        console.log(`Encrypting plaintext '${plaintext}'`);
        // Kirk encrypts to a group so that he can decide later who is on the
        // away-team.
        const options = {
            accessList: {
                groups: [{
                    id: model.awayTeamGroupId
                }]
            }
        };
        return IRON.document.encrypt(IRON.codec.utf8.toBytes(plaintext), options);
    });
}
```

You encrypt to the away team group. Kirk does not need to know who is on the away team when he is deciding on the commands for the mission. A core data control principle is that protecting data should be independent of deciding who has access to it. IronCore calls this orthogonal access control, and it's accomplished with cryptographic groups like the `away-team` in this example.

Try it out by typing `Set phasers to stun` and clicking **Encrypt**. You will see the encrypted command and an entry in the (captain's) log.

```json
Encrypting plaintext 'Set phasers to stun'
{
    "documentID": "2b544876c9ec9fa56c800c3a2235fdbd",
    "documentName": null,
    "document": "PnWvDFSSy7l8gsRMY5asZmfSipcJRictk/CPpFl8bVFakuF2ihxaeRZrtSv3M0M="
}
```

> Cryptographers use the terms plaintext and ciphertext. Plaintext is what you have before encryption, and ciphertext is the encrypted result.

The json property `document` is the ciphertext for _Set phasers to stun_.

Kirk's command can only be decrypted by crew members that are members of the away team group. Right now Kirk is the only member.

### Decrypt

Go back to the code and search on TODO and find the stub for `decryptData`. Then copy and paste the code below.

```javascript
function decryptData(crewmemberID, documentID, ciphertext) {
    // Take the perspective of the crew member
    return Scaffold.asUser(crewmemberID).then(() => {
        // Transform encrypted data from the away-team to the crewmember,
        // then decrypt data locally
        return IRON.document.decrypt(documentID, ciphertext);
    });
}
```

Select Kirk as crewmember, select an order id, and press **Decrypt**. You will see the decrypted order and log output similar to:

```json
Decrypting '945933d960a0a982cd585a4bf080fc81' {
    "documentID": "945933d960a0a982cd585a4bf080fc81",
    "documentName": null,
    "visibleTo": {
        "groups": [
            {
                "name": "away-team",
                "id": "dc3e00f71b151d6d09bf9869be1bb96f"
            }
        ],
        "users": [
            {
                "id": "kirk"
            }
        ]
    },
    "data": {
    },
    "association": "owner"
}
```

Try it again, this time select Spock as crewmember, select an order from the dropdown, and press **Decrypt**. This time you will see an error for the decrypted order and log output similar to:

```json
As user id spock
Error decrypting 2b544876c9ec9fa56c800c3a2235fdbd {
    "code": 301,
    "rawError": {}
}
```

Spock isn't a member of the away team and therefore cannot decrypt commands. Logical.

### Add Spock to the away team

Go back to the code and search on TODO and find the stub for `addAwayTeamMembers`. Then copy and paste the code below.

```javascript
function addAwayTeamMembers(crewmemberIds) {
    // Take the perspective of Kirk
    return Scaffold.asUser(User.kirk).then(() => {
        // Kirk does not need to decide ahead of time who is on the
        // away team.  The decision to add new members does not require
        // modifications to the (away-team) encrypted data.
        return IRON.group.addMembers(model.awayTeamGroupId, crewmemberIds).then((response) => {
            console.log("Crewmembers added to group 'away-team'", response);
            return response;
        })
    });
}
```

Add Spock to the away team.

```json
Crewmembers added to group 'away-team' {
    "succeeded": [
        "spock"
    ],
    "failed": []
}
```

You can now decrypt a command for Mr. Spock. Select an order id then click **Decrypt**.

```json
As user id spock
Decrypted 2b544876c9ec9fa56c800c3a2235fdbd  {
    "documentID": "2b544876c9ec9fa56c800c3a2235fdbd",
    "documentName": null,
    "visibleTo": {
        "groups": [
            {
                "name": "away-team",
                "id": "14a1bb4e1d303d02d879ed9c1fb2555e"
            }
        ],
        "users": [
            {
                "id": "kirk"
            }
        ]
    },
    "data": {
    },
    "association": "fromGroup"
}
```

Fascinating.

Without touching the underlying data (order), Mr. Spock is granted access to the encrypted command. Behind the scenes, IronCore is using \_**transform encryption**\_\_. Transform encryption allows a ciphertext encrypted to a group (e.g., the away team) to be transformed into ciphertext encrypted to a group member (e.g., Mr. Spock). The group member then locally decrypts data using their private key.

> Transform encryption is referred to as proxy-encryption (PRE) in the academic literature. IronCore is the first commercialization of proxy-encryption (PRE).

IronCore's implementation of transform encryption is unidirectional, non-interactive, non-transitive, multi-hop and collusion safe. IronCore automatically handles all key management. You can read more about transform encryption in the ACM paper [Cryptographically Enforced Orthogonal Access Control at Scale](https://ironcorelabs.com/acm-report/).

### Revoke access

Play around a bit:

1.  Add a few more commands
2.  Add Ensign Redshirt to the Away Team
3.  Convince yourself that he can decrypt

> For extra credit, try selecting an order and modifying the ciphertext before you click **Decrypt**

Now to continue our voyage.

Go back to the code and search on TODO and find the stub for `removeAwayTeamMembers`. Then copy and paste the code below.

```javascript
function removeAwayTeamMembers(crewmemberIds) {
    // Initialize the SDK from the perspective of Kirk
    return Scaffold.asUser(User.kirk).then(() => {
        // Kirk can remove away team members at any time.  The decision to
        // remove members does not require any modifications to the
        // (away-team) encrypted data.
        return IRON.group.removeMembers(model.awayTeamGroupId, crewmemberIds).then((response) => {
            console.log("Crewmembers removed from group 'away-team'", response);
            return response;
        })
    });
}
```

Unfortunately, Ensign Redshirt did not return from the latest away team mission. You'll have to, _ahem_, offboard him. Remove Redshirt from the away team by selecting his name under Away Team and clicking the Remove button. You will see log output similar to:

```json
Crewmembers removed from group 'away-team' {
    "succeeded": [
        "redshirt"
    ],
    "failed": []
}
```

Try to decrypt a command for Ensign Redshirt. Select an order id, then click **Decrypt**. You will see log output similar to:

```json
As user id redshirt
Error decrypting 2b544876c9ec9fa56c800c3a2235fdbd {
    "code": 301,
    "rawError": {}
}
```

Again, without touching the underlying data, you are able to revoke access to it. This operation is at the core of an implementation pattern for the GDPR Right to Forget. Without data control, a reliable implementation of Right to Forget is ~~nearly~~ impossible.

### The final frontier

That completes your first mission. In less than 100 lines of JavaScript (including a lot of comments), you've built an application that has better privacy and security than some of the most popular web applications on Earth.

Now it's time to explore integrating IronCore into your own application. To do so, sign up for your account at [http://admin.ironcorelabs.com/login](http://admin.ironcorelabs.com/login).

Live long and prosper.
