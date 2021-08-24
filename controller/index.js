const express = require('express');
var product = require('../models/product');
const router = express.Router();
const Cart = require('../models/Cart');
const User = require('../models/user');
const csrf = require('csurf');
const passport = require('passport');
const csrfProtection = csrf();
require('dotenv').config();
router.use(csrfProtection);
var { check, validationResult } = require('express-validator');
const order = require('../models/order');
const stripe = require("stripe")("sk_test_51JBXX2SFsk4nQIk5qNqjxntXOeFoVdswTUcwKk7AYbBGy6vyVooohWeW6DlCpw0g9t1tTLmfnkuflbqcaFlqeUvf00v7ISN9vK");
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;
// const stripe = require('stripe')(stripeSecretKey); 
router.get("/", async (req, res) => {
    try {
        let result = await product.find();

        let finalResult = [];
        let chunksize = 4;
        for (var i = 0; i <= result.length; i = i + chunksize) {
            finalResult.push(result.slice(i, i + chunksize));

        }

        res.render("shop/index", { finalResult });
    } catch (error) {
        res.send(error);
    }

});
router.get("/add-to-cart/:id", async (req, res) => {
    let productId = req.params.id;

    let cart = new Cart(req.session.cart ? req.session.cart : {});
    try {
        let ps = await product.findById(productId);
        if (ps) {
            cart.add(ps, ps._id);
        }
    } catch (error) {
        console.log(error);
    }
    req.session.cart = cart;
    // console.log(req.session.cart);

    res.redirect("/");



})
router.get('/reduce/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect('/cart');
});

router.get('/remove/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/cart');
});

router.get("/cart", (req, res) => {
    if (!req.session.cart) {
        res.render("shop/shoping-cart");
    }
    else {
        const cart = new Cart(req.session.cart);
        res.render("shop/shoping-cart", { items: cart.genrateArray(), qty: cart.totalPrice, length: cart.genrateArray().length,stripePublicKey: stripePublicKey ,csrf:req.csrfToken()})
    }

})
    
router.get("/checkout",isLogedIn,(req,res)=>{
    if (!req.session.cart) {
        res.render("shop/shoping-cart");
    }
    else {
        var cart = new Cart(req.session.cart);
         
    }
    res.render("shop/checkout",{csrf:req.csrfToken(),tprice:cart.totalPrice});
})

  
router.post("/create-payment-intent", async (req, res) => {
    if (!req.session.cart) {
         
    }
    else {
        var cart = new Cart(req.session.cart);
         var totalPrice = cart.totalPrice;
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount:totalPrice,
      currency: "inr"
    });
  
    res.send({
      clientSecret: paymentIntent.client_secret
    });
    
  });
 
router.post("/order-success",(req,res)=>{

    if (!req.session.cart) {
         
    }
    else {
        var cart = new Cart(req.session.cart);
         var totalPrice = cart.totalPrice;
    }
    var ord = new order({
        user: req.user,
        cart: cart,
        name:  req.body.name,
        contact_no:req.body.contact,
        address:req.body.address,
        paymentId:req.body.payment
    });

   
    try {
        
        ord.save().then(()=>{
            console.log("Order Placed Success fully");
            req.session.cart = null;
            req.session.save()
        }).catch((err)=>{
            console.log(err);
            res.status(500).send(err);
                })
    } catch (error) {
        res.status(500).send(error);
    }
 
})
 
function isLogedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.session.oldurl=req.url;
    res.redirect("user/signin");

}
// router.use(function(req, res, next) {
//     res.status(404);
//     res.send('404: File Not Found');
// });
module.exports = router;







// const mongoose = require('mongoose');
// const product = require('../models/product');
// require("../db/conn");
// const records = [

//     new product({
//        image:"https://en.wikipedia.org/wiki/Node.js#/media/File:Node.js_logo.svg",
//        title:"Node js book",
//        description:"This is all about node js programming for web devlopment",
//        "price":500
//     }),
//     new product({
//         image:"https://picsum.photos/200/150",
//         title:"React Js book",
//         description:"React for frontend devlopment required",
//         "price":550
//      })

// ]

// async function save() {

//      for(var i =0;i<records.length;i++){
//     //    let res = await records[i].save();
//     //    console.log(res);
//         await records[i].save();
//         console.log("saved sucessfully");
//      }

//  }

//  save();

