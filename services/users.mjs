import {GetCommand, PutCommand} from "@aws-sdk/lib-dynamodb";
import { db} from './db.mjs';
import { hashPassword } from '../utils/bcrybt.mjs';
import { HttpError } from '../responses/errors.mjs';

const TABLE_NAME = process.env.USERS_TABLE;

export const getUser = async (username) => {
  const { Item } = await db.send(new GetCommand({ TableName: TABLE, Key: { username } }));
  return Item;
};

export const registerUser = async (username, password) => {
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

