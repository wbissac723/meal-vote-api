'use strict';

const express = require('express');
const request = require('request-promise-native')
const _ = require('lodash');

const router = express.Router();

const bearerToken = 'a63vBF5N-p5D2w05KaYF78UVcBV99NK1P6Z3tyVsWZLGHcSWays53-lnAOsm8e5cy8DtyiPf6q-OW2l6jD4uv7hQ4sDEELTgqXcTNBB7yyV_10WZtBwTE06FiOhWXHYx';


router.post('/', async (req, res) => {
  const options = {
    uri: req.body.url,
    headers: {
      'Authorization': 'Bearer ' + bearerToken
    }
  };

  // Sends GET request to the YELP api to retrieve list of restaurants
  request(options)
    .then((data) => {
      const response = transformResponse(data);

      res.status(200).send(response);
      console.log(`Successfully retrieved ${response.length} restaurants.`)
    })
    .catch((err) => {
      res.status(500).send('Internal server error occured.');
      console.log('Failed to retrieved restaurants. ' + err)
    });
});

 var transformResponse = (data) => {
    const jsonObj = JSON.parse(data);
    let transformedResponse  = [];

    _.each(jsonObj.businesses,(value) => {
      transformedResponse.push(
        _.pick(value,[
          'name','rating','image_url','is_closed',
          'location.display_address','display_phone',
          'url'
        ]));
    });

    return transformedResponse;
 }

module.exports = router;
