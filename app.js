require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()

const passport = require('passport')
const cookieParser = require('cookie-parser');

const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

const AuthRouter = require('./routes/Auth')
const GoogleAuth = require('./routes/Google')
const DeptRoute = require('./routes/Deptor')

const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')

const ConnectDB = require('./db/connect')

const checkAuthenticated = require('./middleware/Authenticated')

app.use(express.json())

app.use(require('express-session')(
  {
    secret: process.env.GOOGLE_CLIENT_SECRET,
    resave: true,
    saveUninitialized: true
  }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

const authUser = async (request, accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}

//Use "GoogleStrategy" as the Authentication Strategy
passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENTID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/api/v1/auth/google/callback",
    passReqToCallback   : true
}, authUser));
  
passport.serializeUser( (user, done) => { 
  done(null, user)
} )

passport.deserializeUser((user, done) => {
  done (null, user)
})

app.set('trust proxy',1)
app.use(rateLimiter({
  windows: 15 * 60 * 1000,
  max:100
}))
app.use(express.json())
app.use(helmet())
app.use(cors())
app.use(xss())

app.use('/api/v1/auth/google',GoogleAuth)

app.get('/api/v1/dashboard',checkAuthenticated, (req, res) => {
  res.status(200).json({user:req.user})
});

app.use('/api/v1/dept',checkAuthenticated,DeptRoute)

app.use('/api/v1/auth',AuthRouter)

app.get('/', (req, res) => {
  res.send('Hello deptors')
})


const port = process.env.PORT || 3000

const start = async () => {
  try {
    await ConnectDB(process.env.MONGO_URI)
    app.listen(port,() => console.log(`Server listening on port ${port}`))
  }catch(error){
    console.error(error)
  }
}

start()