import { Router } from 'express';
import { testEndpoint } from './controllers.js';

// this is where all the api endpoints are located

const router = Router();

router.get('/', testEndpoint); // using testEndpoint() in controllers.js whenever this api endpoint is hit

export default router;
