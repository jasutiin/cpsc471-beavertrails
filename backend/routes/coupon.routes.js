import { Router } from 'express';
import { getCouponByServiceId } from '../controllers/coupon.controller.js';

const couponRouter = Router();

couponRouter.get('/coupons/:servicetype_id', getCouponByServiceId);

export default couponRouter;
