const router = require("express").Router();
const User = require('../models/User.model')
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const mongoose = require('mongoose')
const { isLoggedIn } = require('../middlewares/auth.middleware')


//GET /signup renderizamos pagina de form

router.get("/signup", (req, res) => {
    res.render("auth/signup")
})

router.post('/signup', (req, res, next) => {
    const { username, password } = req.body;
    const saltRounds = 10

    if (!username) {
        res.redirect('/signup', {error: "field cant be empty"})
    }
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/
    if (!regex.test(password)) {
        return res.render("auth/signup", {error: "The password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one number, and one special character."})
    }

    User.findOne({username})
        .then(userFromDb => {
            if (userFromDb) {
                res.render('auth/signup', {error: "username cant be repetated"})
            }
        }
    )
    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(password, salt))
        .then(hashedPassword => {
            return User.create({
                username,
                password: hashedPassword
            })
        })
        .then(userFromDB => {
            res.render('auth/profile', userFromDB)
        })
        .catch(err => next(err))   
}
)

//GET /user-profile

router.get("/user-profile", isLoggedIn, (req, res, next) => 
    res.render('users/user-profile', {userInSession: req.session.currentUser})
)

//GET /login

router.get('/login', (req, res, next) => {
    res.render('auth/login')
})

router.post('/login', (req, res, next) => {
    console.log('SESSION ==>', req.session)
    const { username, password } = req.body;

    if ( username === '' || password === '') {
        res.render('auth/login', {error: 'Please enter both, email and password to login'           
        });
    }
   
    User.findOne({username})
        .then(user => {
            if (!user) {
                res.render('auth/login', {errorMessage: 'User is not register. Try other email'});
                return
            } else if (bcryptjs.compareSync(password, user.password)) 
            {      
                req.session.currentUser = user;
                res.redirect('/user-profile')
            } else {
                return res.redirect('auth/login', {errorMessage: 'Incorrect password'})
            }})
            .catch(err => next(err))
})

//RUTAS PROTEGIDAS con MIDDLEWARE isLoggedIn

router.get('/main', isLoggedIn, (req, res) =>
    res.render('iteration3/main', {user: req.session.currentUser})
)

router.get('/private', isLoggedIn, (req, res) => 
    res.render('iteration3/private', {user: req.session.currentUser} )
)
    


module.exports = router;
