import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validate-request';
import { BadRequestError } from '../errors/bad-request-error';
import { User } from '../models/User';
import { PasswordService } from '../services/password-service';
import { JwtService } from '../services/jwt-service';

const router = express.Router();

router.post('/api/signin', [
    body('email').isEmail().withMessage('Provide a valid email'),
    body('password').trim().notEmpty().withMessage('You must provide a password'),
  ],
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
