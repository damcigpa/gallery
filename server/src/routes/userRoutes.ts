import express, { RequestHandler } from 'express';
import { createUser, getUser } from '../userModel';
import { z } from 'zod';
import validator from 'validator';

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

const registerSchema = z.object({
  userId: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const userIdParamSchema = z.object({
  userId: z.string().min(1, 'userId is required'),
});

const RegisterUser: RequestHandler<{}, UserResponse, any> = async (req, res) => {
  const parseResult = registerSchema.safeParse(req.body);

  if (!parseResult.success) {
    res.status(400).json({ error: parseResult.error.errors[0].message });
    return;
  }

  let { name, password } = parseResult.data;
  name = validator.trim(name);     
  name = validator.escape(name); 

  try {
    const user = await createUser(name, password);
    res.status(201).json({
      name: user.name,
    });
  } catch (error) {
    res.status(409).json({ error: 'User already exists' });
  }
};

router.post('/', RegisterUser);

const GetUser: RequestHandler<UserRequestParams, UserResponse> = async (req, res) => {
  const parseResult = userIdParamSchema.safeParse(req.params);

  if (!parseResult.success) {
    res.status(400).json({ error: parseResult.error.errors[0].message });
    return;
  }

  const { userId } = parseResult.data;

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

export default router;
