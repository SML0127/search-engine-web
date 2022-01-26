const proxy = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(proxy('/api/db/', { target: "" }));
    app.use(proxy('/api/driver/', { target: "" }));
}


