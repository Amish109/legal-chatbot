const rateLimit = require('express-rate-limit');

module.exports = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  message: { message: 'Too many requests, please slow down.' }
});



/**
 * 
//  Blovking entir network

 const rateLimit = require('express-rate-limit');

const networkLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 50,
  keyGenerator: (req) => {
    // Example: block all requests from a subnet
    const ip = req.ip; 
    return ip.split('.').slice(0, 3).join('.'); // first 3 octets of IPv4
  },
  message: { message: 'Too many requests from your network.' }
});

module.exports = networkLimiter;

 */


/*

blocking with cstom key
const rateLimit = require('express-rate-limit');

const userLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  keyGenerator: (req) => {
    // Example: block based on a user ID from headers or token
    return req.headers['x-user-id'] || req.ip;
  },
  message: { message: 'Too many requests from this user.' }
});

module.exports = userLimiter;


*/