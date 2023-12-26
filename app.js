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
const ItemRoute = require('./routes/Item')
const UserRoute = require('./routes/User')

const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')

const ConnectDB = require('./db/connect')

const checkAuthenticated = require('./middleware/Authenticated')
const notFoundMiddleware = require('./middleware/notFound')
const errorHandlerMiddlerware = require('./middleware/errorHandler')

app.use(express.json())

app.use(require('express-session')(
  {
    secret: process.env.GOOGLE_CLIENT_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
      sameSite: 'None',
      secure:true
    }
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
    callbackURL: process.env.GOOGLE_CALLBACK,
    passReqToCallback: true,
    // accessType: 'offline'
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
// app.use(cors({ origin: ['http://localhost:3000'], credentials: true }))
app.use(cors({ origin: true, credentials: true }))
app.use(xss())

const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs');
const swaggerDocs = YAML.load('./swagger.yaml')

app.get('/', (req, res) => {
  res.send('<h1>Deptor Api</h1><a href="/api-docs">Documentation</a>')
})

app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerDocs))

app.use('/api/v1/auth/google',GoogleAuth)

app.use('/api/v1/dept', checkAuthenticated, DeptRoute)
app.use('/api/v1/dept/:id/item', checkAuthenticated, ItemRoute)
app.use('/api/v1/user', checkAuthenticated,UserRoute)

app.use('/api/v1/auth', AuthRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddlerware)

const port = process.env.PORT || 3001

const start = async () => {
  try {
    await ConnectDB(process.env.MONGO_URI)
    app.listen(port,() => console.log(`Server listening on port ${port}`))
  }catch(error){
    console.error(error)
  }
}

start()