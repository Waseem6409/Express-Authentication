require("dotenv").config();
const MongoURL = process.env.MONGO_URI;

module.exports = MongoURL;
