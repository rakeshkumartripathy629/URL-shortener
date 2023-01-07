const redis = require("redis")
const { promisify } = require("util")
//-------------------------------------------Connect To Redis----------------------------------------------------//
const redisClient = redis.createClient(
    18154,
    "redis-18154.c8.us-east-1-2.ec2.cloud.redislabs.com",
    { no_ready_check: true }
);
redisClient.auth("GG9ERgMXfsynk52wTLJ9gTEthVy1T1ag", function (err) {
    if (err) throw err;
});

redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
});
const SET_ASYNC = promisify(redisClient.SETEX).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);

exports.GET_ASYNC = GET_ASYNC;
exports.SET_ASYNC = SET_ASYNC;