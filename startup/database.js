require('dotenv').config();

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;


module.exports = function () {

  const db = process.env.MLAB_DB_CONNECT;

  if (!db) {
    console.log('Database private key is not defined.');
    process.exit(1);
  }

  console.log('Connecting to database.');

  mongoose.connect(db, {
    useCreateIndex: true,
    useNewUrlParser: true
  });

  mongoose.connection.on('connected', () => console.log('Successfully connected to database.'));

  mongoose.connection.on('error', (err) => console.log('MongoDB connection error: ' + err));

  mongoose.connection.on('disconnected', () => console.log('MongoDB connection disconnected.'));

  process.on('SIGINT', () => {
    mongoose.connection.close(function () {
      console.log('MongoDB connection disconnected through app termination.');
      process.exit(0);
    });
  });

};
