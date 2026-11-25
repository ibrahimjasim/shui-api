import {sendError} from '../responses/index.mjs';

export const errorHandler = () => ({
    onError: (handler) => {
        const { error } = handler;

     // Our own errors (400, 401, 403, 404, 409): show the message
     if (error.statusCode && error.statusCode < 500) {  
        handler.response = sendError(error.statusCode, error.message);
        return;
     }

        // Unexpected errors (500): show a generic message
        console.error(error);
        handler.response = sendError(500, 'Internal Server Error');
        }
});