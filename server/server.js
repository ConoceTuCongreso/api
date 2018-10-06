const loopback = require('loopback');
const boot = require('loopback-boot');

const app = loopback();
module.exports = loopback();

app.start = function Str() {
  // start the web server 234576
  return app.listen(() => {
    app.emit('started');
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, (err) => {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module) {
    app.start();
  }
});
