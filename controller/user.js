const express = require('express');
const product = require('../models/product');
const router = express.Router();
const genPassword = require('../passportUtils/passportUtil').genPassword;
const User = require('../models/user');
const csrf = require('csurf');
const Cart = require('../models/Cart');
const passport = require('passport');
const order = require('../models/order');
const csrfProtection = csrf();
const isLogedIn = require('../AuthMiddlewares/authmiddlewares').isLogedIn;
router.use(csrfProtection);
var { check, validationResult } = require('express-validator');
const notLogedIn = require('../AuthMiddlewares/authmiddlewares').notLogedIn;

router.get("/profile", isLogedIn, async(req, res) => {
      
        let orders =await order.find({user:req.user});
        orders.forEach((order)=>{
            const cart = new Cart(order.cart);
            order.items=cart.genrateArray();
        })
        console.log(orders);
         res.render("user/profile",{orders:orders});       
   
   
    
    
})
router.get('/logout', isLogedIn, function (req, res) {
    req.session.cart = "";
    req.logout();
    res.redirect("/");
})


router.use("/", notLogedIn, (req, res, next) => {
    next();
})



router.get("/signup", (req, res) => {
    var msg = req.flash('error');
    console.log(msg);
    res.render("user/signup", { csrfToken: req.csrfToken(), msg: msg });
})



router.post("/singup", [check('email', "Please Enter valid email").isEmail(), check('password', "minimum 4 characters password required").isLength({ min: 4 })], async (req, res) => {


    const err = validationResult(req);
    let messege = [];
    err.errors.forEach((err) => {
        messege.push([err.msg]);
    })

    // err.errors.forEach((err)=>{
    //     messege.push(err);
    //     console.log(err.params);
    // })
    // console.log(err.err);

    if (err.errors.length === 0) {
        const chkUser = await User.findOne({ email: req.body.email });

        if (chkUser == null) {
            const newUser = new User();
            newUser.email = req.body.email;
            let saltHash = genPassword(req.body.password);
            newUser.salt = saltHash.salt;
            newUser.hash = saltHash.hash;
            let s = await newUser.save();
            console.log(req.session.oldurl)
            if (req.session.oldurl) {
                var ou = req.session.oldurl;
                res.redirect("/user/signin");
            } else {
                res.redirect("/user/profile")
                console.log("User Created");
            }


        } else {
            // req.flash('err',"Email Already Exist");
            let msg="email already exist";
            messege.push(msg);
            req.flash('error', messege);
            res.redirect("/user/signup");
        }

    } else {
        console.log(messege);
        req.flash('error', messege);
        res.redirect("/user/signup");

    }



})
//    res.render("index");
router.get("/signin", (req, res) => {
    var msg = req.flash('error');
  
     
    res.render("user/signin", { csrfToken: req.csrfToken(), msg: msg });
})

router.post("/signin", passport.authenticate('local.signin', {

    failureRedirect: "/user/signin",
    failureFlash: true
}), function (req, res, next) {
    if (req.session.oldurl) {
        var url = req.session.oldurl;
        req.session.oldurl = null;
        res.redirect(url);
    }
    else {
        res.redirect("profile");
        console.log("Normal singin")
    }
})

// router.use(function(req, res, next) {
//     res.status(404);
//     res.send('404: File Not Found');
// });
module.exports = router;

