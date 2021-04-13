import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import models from './models';
import routes from './routes';

const app = express();
app.use(cors())

// Add handlebars
const exphbs = require('express-handlebars');

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use('/', routes.main);

app.listen(process.env.PORT, () =>
  console.log(`App listening on port ${process.env.PORT}`),
);