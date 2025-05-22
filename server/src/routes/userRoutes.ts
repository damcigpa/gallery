import express, { RequestHandler } from 'express';
import { createUser, getUser } from '../userModel';

const router = express.Router();

type User = {
  userId: string;
  name: string;
  passwordHash: string;
};

type UserRequestParams = {
  userId: string;
};

type UserRequestBody = Pick<User, 'userId' | 'name'> & {
  password: string;
};

type UserResponse =
  | Partial<UserRequestBody>  
  | { error: string }; 

const RegisterUser: RequestHandler<{}, UserResponse, UserRequestBody> = async (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) {
    res.status(400).json({ error: 'Name and password are required' });
    return;
  }
  try {
    const user = await createUser(name, password);
    res.status(201).json({
      name: user.name
    });
  } catch (error) {
    res.status(409).json({ error: 'User already exists' });
    return;
  }
}

router.post('/', RegisterUser);

const GetUser: RequestHandler<UserRequestParams, UserResponse> = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await getUser(userId);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      userId: user.userId,
      name: user.name,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get user' });
  }
};

router.get('/:userId', GetUser);

export default router