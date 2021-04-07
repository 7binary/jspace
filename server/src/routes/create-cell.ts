import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middlewares';
import { Cell } from '../models';
import { nanoid } from 'nanoid';

const router = Router();

router.post('/api/cells',
  body('content').notEmpty().isString().withMessage('Fill the content'),
  body('type').isIn(['code', 'text']).withMessage('Specify the type (code or text)'),
  validateRequest,
  async (req: Request, res: Response) => {
    const { content, type } = req.body;
    const cell = await Cell.create({
      content,
      type,
      ownerId: req.currentUser?.id,
      uuid: nanoid(7),
    });

    res.status(201).send({ cell });
  });

export { router as createCellRoute };
