import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import models from './models';
import routes from './routes';
require('./data/reddit-db');

const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

const app = express();
app.use(cors())

// Use body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

// Use express validator (after body parser)
app.use(expressValidator());

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