import { Router } from 'express';
import {
  getActivityById,
  incrementActivitySignup,
} from '../controllers/activity.controller.js';

const activityRouter = Router();

// get activity details
activityRouter.get('/activities/:servicetype_id', getActivityById);

// Book / register for activity (increments signup)
activityRouter.post('/activities/:servicetype_id/signup', incrementActivitySignup);

export default activityRouter;
