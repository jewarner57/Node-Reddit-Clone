import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import models from './models';
import routes from './routes';

const app = express();
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Custom app level middleware
app.use((req, res, next) => {
  req.context = {
    models,
    me: models.users[1],
  };
  next();
});

app.use('/', routes.main);

app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}`),
);