import {BunqApiConfig} from "./BunqApiConfig";
const restify = require('restify');
const fs = require('fs');

// create certificates example in bunqSecrets directory
// openssl genrsa -out server.key 2048 && openssl req -new -key server.key -out server.csr && openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt

const config:BunqApiConfig=new BunqApiConfig();
const secretConfig:BunqApiConfig=new BunqApiConfig(config.json.secretsFile);

// Setup https server options
const https_options = {
    key: fs.readFileSync(secretConfig.json.notificationKeyFile),
    certificate: fs.readFileSync(secretConfig.json.notificationCertFile)
};

// Instantiate our two servers
//const server = restify.createServer();
const https_server = restify.createServer(https_options);

// Put any routing, response, etc. logic here. This allows us to define these functions
// only once, and it will be re-used on both the HTTP and HTTPs servers
const setup_server = function(server) {
    function getRespond(req, res) {
        console.log("get callback received: "+req);
        res.send('Your get callback was received!');
    }

    function postRespond(req, res) {
        console.log("post callback received: "+req);
        res.send('Your post callback was received!');
    }

    // Routes


    server.use(restify.bodyParser());
    server.post('/callback', postRespond);

    server.get('/callback', getRespond);

};

// Now, setup both servers in one step
// setup_server(server);
setup_server(https_server);

// Start our servers to listen on the appropriate ports
// server.listen(80, function() {
//     console.log('%s listening at %s', server.name, server.url);
// });

https_server.listen(44444, function() {
    console.log('%s listening on port 44444 at %s', https_server.name, https_server.url);
});

