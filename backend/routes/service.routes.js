/* 
for all service related routes such as flights bookings, flight details, bus details, activities, and more. 
only service related routes should go here.
*/

import { Router } from 'express';
import { getFlightsOfUser } from '../controllers/service.controller.js';

const serviceRouter = Router();

serviceRouter.get('/users/:user_id/flights', getFlightsOfUser); // although this starts with users, it gets flights which is why it is here

export default serviceRouter;
