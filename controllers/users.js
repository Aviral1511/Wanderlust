const User = require("../models/user");

module.exports.signupFormRender = (req,res) => {
    res.render("users/signup.ejs");
};

module.exports.signupUser = async (req,res) => {
    try{
        let {username, password, email} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser,password);
        req.login(registeredUser, (err) => {
            if(err) {return next(err)}
            req.flash("success", "Welcome to WanderLust");
            res.redirect("/listings");
        });        
    } catch (err) {
        req.flash("error" , err.message);
        res.redirect("/signup");
    }  
};

module.exports.loginFormRender = (req,res) => {
    res.render("users/login.ejs");
};

module.exports.loginUser = async (req,res) => {
    req.flash("success","Welcome to WanderLust! You are Logged in");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res, next) => {
    req.logOut((err) => {
        if(err){
            return next(err);
        }
        req.flash("success", "You are Logged Out!");
        res.redirect("/listings");
    });
};