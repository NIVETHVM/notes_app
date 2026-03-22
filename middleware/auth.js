const jwt = require("jsonwebtoken");



function auth(req,res,next){

    const authHeader = req.headers.authorization;
    if(!authHeader) {
        return res.status(401).json({error:"no token provided"});
    }
    //extract the token
    const token = authHeader.split(' ')[1];

    if(!token){
        return res.status(401).json({error: "invalid token format"});
    }

    try {
        const decoded = jwt.verify(token ,process.env.SECRET_KEY);

        req.user = decoded;
        next();
    }
    catch(err){
        return res.status(401).json({ error: 'invalid or expired token' });
    }
}
module.exports = auth;