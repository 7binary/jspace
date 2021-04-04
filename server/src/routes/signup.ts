import express from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middlewares';
import { BadRequestError } from '../errors';
import { User } from '../models';
import { JwtService } from '../services';

const router = express.Router();

router.post('/api/signup', [
    body('email').isEmail().withMessage('Provide a valid email'),
    body('password').trim().isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters length'),
  ],
  validateRequest,
  async (req: express.Request, res: express.Response) => {

    const { email, password } = req.body;
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      throw new BadRequestError('Email is already in use');
    }

    // create and save user
    const user = await User.create({ email, password });
    console.log(user.id, user.email, user.name, user.password);

    // generate JWT
    req.session = { jwt: JwtService.generate(user) };

    res.status(201).send(user);
  });

export { router as signupRoute };
