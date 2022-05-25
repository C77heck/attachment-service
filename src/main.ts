import cors from 'cors';
import express from 'express';
import Mongoose from 'mongoose';
// eslint-disable-next-line import/extensions
import apiRouter from './routes/api.routes';

// Constants
const app = express();

/***********************************************************************************
 *                                  Middlewares
 **********************************************************************************/
app.use(cors());
// Common middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/***********************************************************************************
 *                         API routes and error handling
 **********************************************************************************/

// Add api router
app.use('/api', apiRouter);

/***********************************************************************************
 *                         Server initialisation
 **********************************************************************************/

(async () => {
  try {
    const port = process.env.PORT || 3030;
    await Mongoose.connect(process.env.MONGO_URL || '');
    await app.listen(port, () => console.log(`app is listening on port: ${port}`));
  } catch (e) {
    console.log(e);
  }
})();
