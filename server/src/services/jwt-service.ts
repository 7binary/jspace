import jwt from 'jsonwebtoken';
import { User } from '../models/User';

export class JwtService {
  static generate(user: User) {
    return jwt.sign({
      id: user.id,
      email: user.email,
    }, process.env.JWT_KEY!);
  }
}
