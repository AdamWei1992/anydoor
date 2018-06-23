/**
 * 
 */

const http = require('http');
const chalk = require('chalk');
const path = require('path');

const conf = require('./config/defaultConfig.js');
const route = require('./helper/route.js');


const server = http.createServer((req, res) => {

    const url = req.url;
    const filePath = path.join(conf.root, url);
    route(req, res, filePath);

});

server.listen(conf.port, conf.hostname, () => {
    const addr = `http://${conf.hostname}:${conf.port}`;
    console.info(`server started at ${chalk.green(addr)}`);
});
