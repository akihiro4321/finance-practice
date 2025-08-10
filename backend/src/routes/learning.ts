import { Router } from 'express';
import { LearningController } from '@/controllers/LearningController';
import { asyncHandler } from '@/middleware/errorHandler';

const router = Router();
const learningController = new LearningController();

router.get('/case-studies', asyncHandler(learningController.getCaseStudies.bind(learningController)));
router.get('/case-studies/:id', asyncHandler(learningController.getCaseStudyById.bind(learningController)));
router.post('/case-studies/:id/attempt', asyncHandler(learningController.startCaseStudyAttempt.bind(learningController)));
router.put('/case-studies/:id/attempt/:attemptId', asyncHandler(learningController.updateCaseStudyAttempt.bind(learningController)));

router.get('/exercises', asyncHandler(learningController.getExercises.bind(learningController)));
router.get('/exercises/:id', asyncHandler(learningController.getExerciseById.bind(learningController)));
router.post('/exercises/:id/attempt', asyncHandler(learningController.submitExerciseAttempt.bind(learningController)));

router.get('/progress', asyncHandler(learningController.getProgress.bind(learningController)));
router.get('/achievements', asyncHandler(learningController.getAchievements.bind(learningController)));

export { router as learningRouter };