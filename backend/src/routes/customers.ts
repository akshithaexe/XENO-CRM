import { Router } from 'express';
import { getCustomers, getCustomerById, createCustomer, updateCustomer, bulkCreateCustomers } from '../controllers/customers.controller';

const router = Router();

router.get('/', getCustomers);
router.get('/:id', getCustomerById);
router.post('/', createCustomer);
router.post('/bulk', bulkCreateCustomers);
router.put('/:id', updateCustomer);

export default router;
