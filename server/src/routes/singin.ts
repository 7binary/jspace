import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middlewares';
import { BadRequestError } from '../errors';
import { User } from '../models';
import { PasswordService, JwtService } from '../services';

const router = express.Router();

router.post('/api/signin',
  body('email').isEmail().withMessage('Provide a valid email'),
  body('password').trim().notEmpty().withMessage('You must provide a password'),
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (user) {
      const passwordsMatch = await PasswordService.verifyPassword(password, user.password);
      if (passwordsMatch) {
        // generate JWT
        req.session = { jwt: JwtService.generate(user) };
        res.send(user);
      }
    }

    throw new BadRequestError('Invalid credentials');
  });

export { router as signinRoute };
