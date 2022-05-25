import { Router } from 'express';
import attachmentRoutes from './attachment.routes';
// Export the base-router
const baseRouter = Router();
// Setup routers
baseRouter.use('/attachments', attachmentRoutes);

// Export default.
export default baseRouter;
