const proxy = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(proxy('/api/db/', { target: "http://141.223.197.36:5000" }));
    app.use(proxy('/api/driver/', { target: "http://141.223.197.36:5001" }));
}


