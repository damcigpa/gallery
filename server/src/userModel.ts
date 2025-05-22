import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import {
  DynamoDBClient,
} from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
} from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: 'eu-central-1' });
const ddb = DynamoDBDocumentClient.from(client);

const USERS_TABLE = 'Users';

export interface User {
  userId: string;
  name: string;
  passwordHash: string;
}

export async function createUser(
  name: string,
  password: string
): Promise<Omit<User, 'passwordHash'>> {
  const userId = uuidv4();
  const passwordHash = await bcrypt.hash(password, 10);

  const params = {
    TableName: USERS_TABLE,
    Item: {
      userId,
      name,
      passwordHash,
    },
  };

  await ddb.send(new PutCommand(params));

  return { userId, name };
}

export async function getUser(userId: string): Promise<User | null> {
  const params = {
    TableName: USERS_TABLE,
    Key: { userId },
  };

  const result = await ddb.send(new GetCommand(params));
  return (result.Item as User) || null;
}
