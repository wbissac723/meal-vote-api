import mongoose from "mongoose";

mongoose.Promise = global.Promise;

module.exports = () => {
  const db = process.env.MLAB_DB_CONNECT;

  if (!db) {
    // tslint:disable-next-line:no-console
    console.log("MongoDB private key is not defined.");
    process.exit(1);
  }

  // tslint:disable-next-line:no-console
  console.log("Connecting to database. ." + db);

  mongoose.connect(db, {
    useCreateIndex: true,
    useNewUrlParser: true
  });

  // tslint:disable-next-line:no-console
  mongoose.connection.on("connected", () => console.log("Successfully connected to database."));

  // tslint:disable-next-line:no-console
  mongoose.connection.on("error", (err) => console.log("MongoDB connection error: " + err));

  // tslint:disable-next-line:no-console
  mongoose.connection.on("disconnected", () => console.log("MongoDB connection disconnected."));

  process.on("SIGINT", () => {
    mongoose.connection.close(() => {
      // tslint:disable-next-line:no-console
      console.log("MongoDB connection disconnected through app termination.");
      process.exit(0);
    });
  });

};
