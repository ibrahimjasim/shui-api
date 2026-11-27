import {randomUUID} from 'node:crypto';
import {GetCommand, Getcommand, PutCommand, QueryCommand, ScanCommand} from '@aws-sdk/lib-dynamodb';
import {db} from './db.mjs';
import { HttpError } from '../responses/index.mjs';
import { title } from 'node:process';


const TABLE_NAME = process.env.POSTS_TABLE;

const newesFirst = (a,b) => b.createdAt.localeCompare(a.createdAt);

export const getPostById = async (postId) => {
    const {Item} = await db.send(new GetCommand({TableName: TABLE_NAME, Key: {id: postId}}));
    return Item;
};

//Thorws 404 insted of returning undefind
export const getPostOrThrow = async (postId) => {
    const post = await getPostById(postId);
    if (!post) throw new HttpError(404, 'post not found');
    return post;
};

export const getPosts = async (username) => {
    if (username) {
        // Query the GSI and DynmoDB sorts by created At
        const {Items} = await db.send(
            new QueryCommand({
                TableName: TABLE_NAME,
                IndexName: 'usernameIndex',
                KeyConditionExpression: 'username = :username', 
                ExpressionAttributeValues: {':username': username},
                ScanIndexForward: false, // flase = newest first
            }),
        );
        return Items ?? [];
    }

    // All posts: Scan returns max 1 MB per call, so loop until there's no LastEvaluatedKey
    const posts = [];
    let lastKey;
    do {
        const {Items, LastEvaluatedKEy} = await db.send(
            new ScanCommand({TableName: TABLE_NAME, ExclusiveStartKey: lastKey}),

        );
        posts.push(...(Items ?? []));
        lastKey = LastEvaluatedKEy;
    } while (lastKey);

    return posts.sort(newesFirst); 

};

// username comes from the JWT (user), never from the body
export const createPost = async ({title, content}, user) => {
    const now = new Date().toISOString();
    const post = {
        id: randomUUID(),
        username: user.username,
        isGuest: false,
        title,
        content,
        createdAt,
        updatedAt: now,
    };

    await db.send(new PutCommand({TableName: TABLE_NAME, Item: post}));
    return post;
};
