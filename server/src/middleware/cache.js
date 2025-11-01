const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 60 }); // Cache for 60 seconds

module.exports = (req, res, next) => {
    const key = req.originalUrl;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
        console.log(`Cache hit for ${key}`);
        return res.send(cachedResponse);
    }

    console.log(`Cache miss for ${key}`);
    res.originalSend = res.send;
    res.send = (body) => {
        cache.set(key, body);
        res.originalSend(body);
    };
    next();
};