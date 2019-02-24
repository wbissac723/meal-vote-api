
import express from "express";
import * as _ from "lodash";
import request from "request-promise-native";

const router = express.Router();

const bearerToken = process.env.YELP_KEY;

if (!bearerToken) {
  // tslint:disable-next-line:quotemark
  // tslint:disable-next-line:no-console
  console.log("Yelp api key is not defined.");
  process.exit(1);
}

router.post("/", async (req, res) => {
  const options = {
    headers: {
      Authorization: "Bearer " + bearerToken
    },
    uri: req.body.url,
  };

  // Sends GET request to the YELP api to retrieve list of restaurants
  request(options)
    .then((data) => {
      const response = transformResponse(data);

      res.status(200).send(response);
      // tslint:disable-next-line:no-console
      console.log(`Successfully retrieved ${response.length} restaurants.`);
    })
    .catch((err) => {
      res.status(500).send("Internal server error occured.");
      // tslint:disable-next-line:no-console
      console.log("Failed to retrieved restaurants. " + err);
    });
});

const transformResponse = (data: string) => {
  const jsonObj = JSON.parse(data);
  const transformedResponse: any = [];

  _.each(jsonObj.businesses, (value) => {
    transformedResponse.push(
      _.pick(value, [
        "name", "rating", "image_url", "is_closed",
        "location.display_address", "display_phone",
        "url"
      ]));
  });

  return transformedResponse;
};

module.exports = router;
