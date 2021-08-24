function isLogedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/");

}
function notLogedIn(req,res,next){
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect("/");

}

module.exports.isLogedIn = isLogedIn;
module.exports.notLogedIn = notLogedIn;