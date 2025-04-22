import { Router } from 'express';
import { getActivityById } from '../controllers/activity.controller.js';

const activityRouter = Router();

activityRouter.get('/activities/:servicetype_id', getActivityById);

export default activityRouter;
