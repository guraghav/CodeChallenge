var pg = require('pg');
var connectionString = process.env.POSTGRES_URL || "postgres://postgres:5432@localhost/referrer_tracking";

var client = new pg.Client(connectionString);
client.connect(function(err) {
  if(err) {
    return console.error('could not connect to postgres', err);
  }
   console.log('You are now connected to postgres..');
   client.end();
});

module.exports = client;