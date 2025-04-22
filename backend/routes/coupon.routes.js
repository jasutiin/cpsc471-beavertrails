import { Router } from 'express';
import { getCouponByServiceId } from '../controllers/coupon.controller.js';

const couponRouter = Router();

// works for flights, hotels, buses, activities, etc.
couponRouter.get('/coupons/:servicetype_id', getCouponByServiceId);

export default couponRouter;

