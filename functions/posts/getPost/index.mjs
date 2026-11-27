import middy from '@middy/core';
import { errorHandler } from '../../../middlewares/errorHandler.mjs';
import { getPostOrThrow } from '../../../services/posts.mjs';
import { sendResponse } from '../../../responses/index.mjs';

const getPost = async (event) => {
  const post = await getPostOrThrow(event.pathParameters.postId);
  return sendResponse(200, post);
};

export const handler = middy(getPost).use(errorHandler());