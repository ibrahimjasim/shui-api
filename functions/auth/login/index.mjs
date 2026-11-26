import middy from '@middy/core';
import { validate } from '../../../middlewares/validation.mjs';
import { errorHandler } from '../../../middlewares/errorHandler.mjs';
import { loginSchema } from '../../../models/auth.mjs';
import { loginUser } from '../../../services/users.mjs';
import { sendResponse } from '../../../responses/index.mjs';

const login = async (event) => {
    const { token, username } = await loginUser(event.validatedBody);
    return sendResponse(200, { message: 'Login successful', token, username }); 
};

export const handler = middy(login)
    .use(errorHandler())
    .use(validate(loginSchema));     