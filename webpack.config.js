// TO DISCUSS:
//
// With randomized IDs, we could have a single code labs project.
// Seems like a business decision around friction vs. name capture
// Also, could randomize segment if they can be lazy created

const ironCoreConfig = require('./ironcore-config.json');

const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const https = require('https');
const jwt = require('jsonwebtoken');

const privateKey = fs.readFileSync(path.join(__dirname, 'private.key'), 'utf8');

/**
 * Generate a JWT token using the current requesting users ID, your project ID (pid) and segment ID (sid). Return
 * the generated token back to the client.
 */
function serveJWT(req, res) {
    const {
        userID
    } = req.params;
    if (!userID) {
        res.status(404).end();
    } else {
        const token = jwt.sign({
            pid: ironCoreConfig.projectId,
            sid: ironCoreConfig.segmentId,
            kid: ironCoreConfig.serviceKeyId
        }, privateKey, {
            algorithm: 'ES256',
            expiresIn: '2m',
            subject: userID,
        });
        res.status(200).send(token);
    }
}

module.exports = (env) => {
    return {
        devServer: {
            port: 3000,
            before(app) {
                app.get('/generateJWT/:userID', serveJWT);
                app.get('/', (req, res) => res.sendFile('index.html', {
                    root: __dirname
                }));
            },
        },
        mode: "development",
        entry: [
            'whatwg-fetch',
            "babel-polyfill",
            `./app/${env.stage}/get-started-by-writing-me.js`
        ],
        output: {
            publicPath: 'http://localhost:3000/static/dist/',
            filename: '[name].js',
        },
        resolve: {
            modules: ["app", "node_modules"],
            extensions: [".js"]
        },
        devtool: 'cheap-module-source-map',
        module: {
            rules: [{
                test: /\.js$/,
                use: [{
                    loader: "babel-loader",
                    options: {
                        presets: ['env'],
                    },
                }],
                exclude: /node_modules/
            }]
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoEmitOnErrorsPlugin(),
        ]
    }
};
