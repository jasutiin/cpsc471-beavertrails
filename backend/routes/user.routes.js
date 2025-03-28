/* 
for all user related routes such as updating user data, getting users, getting a single user,
and deleting a user. only user related routes should go here. we can also get flights of
a specific user, but since the primary resource is flights then that route can be found in the
flights controller instead.
*/

import { Router } from 'express';
import {
  getUsers,
  getUser,
  deleteUser,
  updateUser,
} from '../controllers/user.controller.js';

const userRouter = Router();

userRouter
  .get('/users', getUsers)
  .get('/users/:user_id', getUser)
  .put('/users/:user_id', updateUser)
  .delete('/users/:user_id', deleteUser);

export default userRouter;
