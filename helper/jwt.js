const expressJwt = require('express-jwt');
require('dotenv/config');
function authJwt() {
    const secret = process.env.secret;
    const api = process.env.API_URL;
    return expressJwt({
        secret,
        algorithms: ['HS256'],
       
    }).unless({
        path: [
            // { url: /\/public\/upload(.*)/, methods: ['GET', 'OPTIONS'] },
            // { url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },
            // { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
            // { url: /\/api\/v1\/orders(.*)/, methods: ['GET', 'OPTIONS', 'POST'] },
            // `${api}/users/login`,
            // `${api}/users/register`
        ] 
    })
}


 // isRevoked: isRevoked
async function isRevoked(req, payload, done) {
    if(!payload.isadmin) {
        done(null, true)
    }

    done();
}

module.exports = authJwt