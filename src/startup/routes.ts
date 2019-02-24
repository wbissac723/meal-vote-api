

import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";

// Routes
import restaurants from "../routes/restaurants";
import users from "../routes/users";

module.exports = (app: any) => {
  app.use(helmet());
  app.use(bodyParser.urlencoded({
    extended: false
  }));
  app.use(bodyParser.json());
  app.use(cors());
  app.use("/api/restaurants", restaurants);
  app.use("/api/users", users);
};
