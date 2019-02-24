"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const _ = __importStar(require("lodash"));
const request_promise_native_1 = __importDefault(require("request-promise-native"));
const router = express_1.default.Router();
const bearerToken = process.env.YELP_KEY;
if (!bearerToken) {
    // tslint:disable-next-line:quotemark
    // tslint:disable-next-line:no-console
    console.log("Yelp api key is not defined.");
    process.exit(1);
}
router.post("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
    const options = {
        headers: {
            Authorization: "Bearer " + bearerToken
        },
        uri: req.body.url,
    };
    // Sends GET request to the YELP api to retrieve list of restaurants
    request_promise_native_1.default(options)
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
}));
const transformResponse = (data) => {
    const jsonObj = JSON.parse(data);
    const transformedResponse = [];
    _.each(jsonObj.businesses, (value) => {
        transformedResponse.push(_.pick(value, [
            "name", "rating", "image_url", "is_closed",
            "location.display_address", "display_phone",
            "url"
        ]));
    });
    return transformedResponse;
};
module.exports = router;
//# sourceMappingURL=restaurants.js.map