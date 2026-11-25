import middy from '@middy/core';
import { validate } from '../../../middlewares/validation.mjs';
import { registerSchema } from '../../../models/auth.mjs';
import { errorHandler } from '../../../middlewares/errorHandler.mjs';
import { registerUser } from '../../../services/users.mjs';
import { sendResponse } from '../../../responses/index.mjs'; 



const register = async (event) => {
    const { username } = await registerUser(event.validatedBody);
    return sendResponse(201, { message: 'User registered successfully', username });
};

export const handler = middy(register)
    .use(errorHandler())
    .use(validate(registerSchema));
