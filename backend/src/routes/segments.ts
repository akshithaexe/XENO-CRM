import { Router } from 'express';
import {
  getSegments,
  getSegmentById,
  createSegment,
  updateSegment,
  deleteSegment,
  previewSegment,
} from '../controllers/segments.controller';

const router = Router();

router.get('/', getSegments);
router.get('/:id', getSegmentById);
router.post('/', createSegment);
router.put('/:id', updateSegment);
router.delete('/:id', deleteSegment);
router.post('/:id/preview', previewSegment);

export default router;
