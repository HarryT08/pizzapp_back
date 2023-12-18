import { Router } from 'express';
import { login, signup, pruebaToken } from '../controllers/auth-controller';
import { verifyToken } from '../libs/verifyToken';
import { auth }  from '../middleware/auth'
const router = Router();

router.route('/').post(signup);

router.route('/login').post(login);

router.get('/proof', verifyToken, pruebaToken);

export default router;
