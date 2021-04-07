import express from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middlewares';
import { Cell } from '../models';
import { NotFoundError } from '../errors';

const router = express.Router();

router.put('/api/cells/:uuid',
  body('content').notEmpty().isString().withMessage('Fill the content'),
  validateRequest,
  async (req: express.Request, res: express.Response) => {
    const { uuid } = req.params;
    const { content } = req.body;
    const cell = await Cell.findOne({ where: { uuid } });

    if (!cell) {
      throw new NotFoundError();
    }

    cell.content = content;
    await cell.save();

    res.status(200).send({ cell });
  });

export { router as updateCellRoute };
