import { Router } from 'express';
import { ProjectController } from '@/controllers/ProjectController';
import { asyncHandler } from '@/middleware/errorHandler';

const router = Router();
const projectController = new ProjectController();

router.get('/', asyncHandler(projectController.getAll.bind(projectController)));
router.post('/', asyncHandler(projectController.create.bind(projectController)));
router.get('/stats', asyncHandler(projectController.getStats.bind(projectController)));
router.get('/:id', asyncHandler(projectController.getById.bind(projectController)));
router.put('/:id', asyncHandler(projectController.update.bind(projectController)));
router.delete('/:id', asyncHandler(projectController.delete.bind(projectController)));

router.get('/:id/financial-statements', asyncHandler(projectController.getFinancialStatements.bind(projectController)));
router.post('/:id/financial-statements', asyncHandler(projectController.createFinancialStatement.bind(projectController)));
router.get('/:id/budget-plans', asyncHandler(projectController.getBudgetPlans.bind(projectController)));
router.post('/:id/budget-plans', asyncHandler(projectController.createBudgetPlan.bind(projectController)));

export { router as projectRouter };