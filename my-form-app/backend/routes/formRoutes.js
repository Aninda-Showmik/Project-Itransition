// routes/formRoutes.js
import express from 'express';
import requireClerkAuth from '../middlewares/requireClerkAuth.js';
import { createForm } from '../formController.js';

const router = express.Router();

router.post('/', requireClerkAuth, createForm);

export default router;
