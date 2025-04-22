import { Router } from 'express';
import {
  getActivities,
  getActivityById,
  incrementActivitySignups, //  use this exact name from the controller
} from '../controllers/activity.controller.js';

const activityRouter = Router();

// Get activity details by ID
activityRouter.get('/activities/:servicetype_id', getActivityById);

// Increment signup count (for booking)
activityRouter.post(
  '/activities/:servicetype_id/signup',
  incrementActivitySignups
);

activityRouter.get('/activities', getActivities);

export default activityRouter;
