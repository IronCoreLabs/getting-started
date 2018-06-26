# Nightwatch/Browserstack tests:

### Getting your Browserstack info
1. Go to [Browserstack](www.browserstack.com/) and login
1. Click on **Account** and then choose **Settings**
1. Under **Automate** add your **Username** and **Access Key** to a .env file (follow the directions below)

### Create a '.env' file at the top of the project and add
```bash
    BROWSERSTACK_USERNAME='<username>'
    BROWSERSTACK_ACCESS_KEY='<key>'
```

### Run tutorial tests
```text
In a terminal, type 'npm run start' to start the local server.
In another terminal run
```
```bash
$ npm run testTutorial
```

### Run completed tests
```text
In a terminal, type 'npm run complete' to start the local server.
In another terminal run
```
```bash
$ npm run testCompleted
```