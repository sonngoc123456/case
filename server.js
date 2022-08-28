const http = require('http');
const fs = require('fs');
const url = require('url')
const CustomerController = require('./src/controller/customer.controller');
const customerController = new CustomerController();
const port = 8080;

let mimeTypes = {
    'jpg': 'images/jpg',
    'png': 'images/png',
    'js': 'text/javascript',
    'css': 'text/css',
    'svg': 'image/svg+xml',
    'ttf': 'font/ttf',
    'woff': 'font/woff',
    'woff2': 'font/woff2',
    'eot': 'application/vnd.ms-fontobject'
}

const server = http.createServer((req, res) => {
    let urlParse = url.parse(req.url);
    let pathUrl = urlParse.pathname;
    let filesDefences = pathUrl.match(/\.js|\.css|\.png|\.svg|\.jpg|\.ttf|\.woff|\.woff2|\.eot/);
    if (filesDefences) {
        let extension = mimeTypes[filesDefences[0].toString().split('.')[1]];
        res.writeHead(200, {'Content-Type': extension});
        fs.createReadStream(__dirname + req.url).pipe(res);
    } else {
        switch (pathUrl) {
            case '/':
                customerController.showList(req, res).catch(err => console.log(err.message));
                break;
            case '/customers/search':
                customerController.searchCustomer(req, res).catch(err => console.log(err.message));
                break;
            case '/login':
                customerController.Login(req, res)
                break;
            case '/login/success':
                customerController.LoginSuccess(req, res);
                break;
        }
    }

})

server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}/login`);
})
