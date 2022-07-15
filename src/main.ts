import cors from 'cors';
import express from 'express';
import fileUpload from 'express-fileupload';
import Mongoose from 'mongoose';
import { setEnvs } from './libs/set-up.environment';
// eslint-disable-next-line import/extensions
import apiRouter from './routes/api.routes';
// Constants
const app = express();
setEnvs();

/***********************************************************************************
 *                                  Middlewares
 **********************************************************************************/
app.use(cors());
// Common middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// TODO NEED OT HANDLE THE LIMIT ON THIS
app.use(fileUpload());
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
    console.log(process.env.MONGO_URL);
    const port = process.env.PORT || 3030;
    await Mongoose.connect(process.env.MONGO_URL || '');
    await app.listen(port, () => console.log(`app is listening on port: ${port}`));
  } catch (e) {
    console.log(e);
  }
})();
