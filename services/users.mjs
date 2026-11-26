import {GetCommand, PutCommand} from "@aws-sdk/lib-dynamodb";
import { db} from './db.mjs';
import { hashPassword, comparePassword} from '../utils/bcrybt.mjs';
import { HttpError } from '../responses/index.mjs';
import { signToken } from '../utils/jwt.mjs';

const TABLE_NAME = process.env.USERS_TABLE;

export const getUser = async (username) => {
  const { Item } = await db.send(new GetCommand({ TableName: TABLE_NAME, Key: { username } }));
  return Item;
};

export const registerUser = async ({username, password}) => {
    const hashedPassword = await hashPassword(password);


    try {
        await db.send(new PutCommand({
            TableName: TABLE_NAME,
            Item: {
                username,
                password: hashedPassword,
                createdAt: new Date().toISOString()
            },
            ConditionExpression: 'attribute_not_exists(username)'
        }),
    );
    } catch (error) {
        if (error.name === 'ConditionalCheckFailedException') {
            throw new HttpError(409, 'Username already exists');
        }
        throw error;
    }

    return { username };
};

export const loginUser = async ({username, password}) => {
    const user = await getUser(username);
    // Same message whether the user doesn't exist or the password is wrong
    if (!user || !(await comparePassword(password, user.password))) {
        throw new HttpError(401, 'Invalid username or password');
    }

    const token = signToken({ username: user.username });
    return { token, username: user.username};
}
