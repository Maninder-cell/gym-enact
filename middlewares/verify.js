const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.verify = (req,res,next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]

    try{
        const decoded = jwt.verify(token, process.env.SECRET_CODE);
        req.user = decoded.user;
        next();
    }
    catch(e){
        return res.status(401).send('Unauthorized: Invalid token');
    }
}