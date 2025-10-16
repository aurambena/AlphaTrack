import rateLimit from "express-rate-limit";

const limit = rateLimit({
    //how long the user can call the api, time ms
    windowMs: 15 * 60 * 1000, //15 minutes
    max: 100 //limit for IP 100 requests for windowMs
})

export default limit;