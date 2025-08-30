import express from 'express';
import path from "node:path";
import { fileURLToPath } from 'node:url';
import cors from 'cors';
import session from 'express-session';
import passport from './config/passport.js';
import JWT from './utils/jwt.js';
import apicache from 'apicache';
import { connectToDB, checkDBConnection } from './db/dbConnect.js';

import loginRouter from './routes/login.js';
import registerRouter from './routes/register.js';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsPath = path.join(__dirname, "public");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(assetsPath)); // static assets in public folder
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(apicache.middleware('5 minutes')); // this will GET old data even after POST do "apicache.clear()" to reset GET or pass as middleware to a route "cache('10 minutes')"
app.use(session({
  secret: process.env.PASSPORT_SECRET_KEY,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// cors
const dynamicCorsOptions = function(req, callback) {
  let corsOptions;
  if (req.path.startsWith('/auth/connect/')) {
    corsOptions = {
      origin: 'http://mydomain.com', // Allow only a specific origin
      credentials: true,            // Enable cookies and credentials
    };
  } else {
    corsOptions = { origin: '*' };   // Allow all origins for other routes
  }
  callback(null, corsOptions);
};

app.use(cors(dynamicCorsOptions));

// set initial info
app.all('*splash', (req,res,next)=>{ 
    // req.something = something;
    next();
})

// Routes
// app.use('/', (req,res) => res.send("Add Routes"));
app.use('/login', checkDBConnection, loginRouter);
app.use('/register', checkDBConnection, registerRouter);
app.get('/protected', JWT.verifyJwtToken, (req,res)=>res.status(200).json({message:"Authorized"}));

// handle errors
app.all('*splash', (req,res,next) => next(new Error('404 Not Found'))); 
app.use((err,req,res,next) => {
    console.log(err);
    res.status((err.statusCode || 500)).json({message:err.message});
    res.end();
})

const PORT = process.env.PORT || 3000;
connectToDB().then(
  app.listen(PORT, ()=>{
      console.log(`Listening on PORT ${PORT}`);
  })
).catch(error => console.log(error));