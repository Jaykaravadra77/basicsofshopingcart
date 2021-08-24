const express = require('express');
const app = express();
const PORT = process.env.PORT | 8000;
const path = require('path');
const staticPath = path.join(__dirname, "../public");
const ehbs = require('express-handlebars');
const router = require("../controller/index");
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const userRouter = require('../controller/user');
const dbString = "mongodb://localhost:27017/shopping";
const MongoStore = require('connect-mongo');
const { json } = require('express');
 
 
 
 

// const conn = require('../db/conn').conn;

require("../db/conn");
require('../config/passwort');

let hbs = ehbs.create({
    defaultLayout: "layout", extname: ".hbs", runtimeOptions: { allowProtoPropertiesByDefault: true, allowProtoMethodsByDefault: true }, helpers: {
        test: function (arg1, arg2, options) {
            return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
        }
    }
})

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");


app.use(function (req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.use(express.static(staticPath));
app.use(flash());
// app.use(cookieParser);
// const Mstore= new MongoStore({mongooseConnection:conn,collection:"sessions"});
 

 
 

app.use(session(
    { secret: "jaykaravadra", 
     resave: false,
     saveUninitialized: true,
     store:MongoStore.create({mongoUrl:dbString}),
     cookie:{maxAge:180*60*1000}
    }))
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.login = req.isAuthenticated();
    res.locals.session=req.session;
    res.locals.user = JSON.stringify(req.user);
 
    next();
})

app.use("/", router);
app.use("/user", userRouter);


app.use(function(req, res, next) {
    res.status(404);
    res.send('<h1>404: Page Not Found </h1>');
});

app.listen(PORT, () => {
    console.log("App successfully listen on port " + PORT);
})