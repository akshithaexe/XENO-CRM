import { Router } from 'express';
import { createOrder, getOrdersByCustomer, bulkCreateOrders } from '../controllers/orders.controller';

const router = Router();

router.post('/', createOrder);
router.post('/bulk', bulkCreateOrders);
router.get('/:customerId', getOrdersByCustomer);

export default router;
