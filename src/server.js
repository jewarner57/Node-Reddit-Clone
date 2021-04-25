import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import models from './models';
import routes from './routes';
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
  console.log("Checking authentication");
  if (typeof req.cookies.nToken === "undefined" || req.cookies.nToken === null) {
    req.user = null;
  } else {
    var token = req.cookies.nToken;
    var decodedToken = jwt.decode(token, { complete: true }) || {};
    req.user = decodedToken.payload;
  }

  next();
};
app.use(checkAuth);

// Add handlebars
const exphbs = require('express-handlebars');

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use('/', routes.main);
app.use('/posts', routes.posts);


app.listen(process.env.PORT, () =>
  console.log(`App listening on port ${process.env.PORT}`),
);

require('./controllers/posts.js')(app);
require('./controllers/comments.js')(app);
require('./controllers/auth.js')(app);

module.exports = app;
