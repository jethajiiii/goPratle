import { Router } from 'express';
import asyncHandler from '../middleware/asyncHandler.js';
import validateRequirement from '../middleware/validateRequirement.js';
import {
  createRequirement,
  getRequirementById,
} from '../controllers/requirementController.js';

const router = Router();

// Validate input first, then hand off to the controller.
router.post('/', validateRequirement, asyncHandler(createRequirement));

router.get('/:id', asyncHandler(getRequirementById));

export default router;
