import middy from "@middy/core";
import { authenticate } from '../../../middlewares/authenticate.mjs';
import { validate } from "../../../middlewares/validation.mjs";
import { errorHandler } from '../../../middlewares/errorHandler.mjs';
import { postSchema } from '../../../models/posts.mjs';
import { createPost } from '../../../services/posts.mjs';
import { sendResponse } from "../../../responses/index.mjs";

const create = async (event) => {
    const post = await createPost(event.validatedBody, event.user);
    return sendResponse(201, { message: 'Post created successfully', post });

};

export const handler = middy(create)
    .use(errorHandler())
    .use(authenticate())    // token required 
    .use(validate(postSchema));