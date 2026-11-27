import middy from '@middy/core';
import { validate } from '../../../middlewares/validation.mjs';
import { errorHandler } from '../../../middlewares/errorHandler.mjs';
import { postsQuerySchema } from '../../../models/posts.mjs';
import { getPosts } from '../../../services/posts.mjs';
import { sendResponse } from '../../../responses/index.mjs';


const getAllPosts = async (event) => {
    const posts = await getPosts(event.validatedQuery.username);
    return sendResponse(200, posts);
};

export const handler = middy(getAllPosts)
    .use(errorHandler())
    .use(validate(postsQuerySchema, 'query'));