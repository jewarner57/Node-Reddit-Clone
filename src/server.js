import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import models from './models';
import routes from './routes';
import path from 'path'
var cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('./data/reddit-db');

const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

const app = express();
app.use(cors())

// Use body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
// Use cookie parser
app.use(cookieParser());
// Use express validator (after body parser)
app.use(expressValidator());

var checkAuth = (req, res, next) => {
  if (typeof req.cookies.nToken === "undefined" || req.cookies.nToken === null) {
    req.user = null;
  } else {
    var token = req.cookies.nToken;
    var decodedToken = jwt.decode(token, { complete: true }) || {};
    req.user = decodedToken.payload;
  }

  // set the local currentUser val for the template
  res.locals.currentUser = req.user;

  next();
};
app.use(checkAuth);

// Add handlebars
const exphbs = require('express-handlebars');

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use('/', routes.main);
app.use('/posts', routes.posts);
app.use(express.static(path.join(__dirname, '/public')));

app.listen(process.env.PORT, () =>
  console.log(`App listening on port ${process.env.PORT}`),
);

require('./controllers/posts.js')(app);
require('./controllers/comments.js')(app);
require('./controllers/auth.js')(app);
require('./controllers/replies.js')(app);

module.exports = app;
