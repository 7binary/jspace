import express, { Request, Response } from 'express';
import { currentUser } from '../middlewares';

const router = express.Router();

router.get('/api/me', currentUser, (req: Request, res: Response) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as meRoute };
