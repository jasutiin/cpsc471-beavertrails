/* 
for all user related routes such as finding all users, 
details of a specific user, etc.
*/

import { Router } from 'express';
import {
  getUsers,
  getUser,
  deleteUser,
  updateUser,
  loginUser,
  signupUser,
} from '../controllers/user.controller.js';

const userRouter = Router();

userRouter
  .get('/users', getUsers)
  .get('/users/:user_id', getUser)
  .put('/users/:user_id', updateUser)
  .post('/auth/user/login', loginUser)
  .post('/auth/user/signup', signupUser)
  .delete('/users/:user_id', deleteUser);

export default userRouter;
