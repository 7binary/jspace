import express from 'express';
import { Cell } from '../models';
import { NotFoundError } from '../errors';

const router = express.Router();

router.get('/api/cells/:uuid',
  async (req: express.Request, res: express.Response) => {
    const { uuid } = req.params;
    const cell = await Cell.findOne({ where: { uuid } });

    if (!cell) {
      throw new NotFoundError();
    }

    res.status(200).send({ cell });
  });

export { router as showCellRoute };
