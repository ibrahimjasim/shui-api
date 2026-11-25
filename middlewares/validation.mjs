import { HttpError } from '../responses/index.mjs';

// validate(schema)          -> checks the JSON body
export const validate = (schema, source = 'body') => ({
    before: (handler) => {
        const { event } = handler;
        let input;

        if (source === 'query') {
            input = event.queryStringParameters ?? {};
        } else {
            try {
                input = event.body ? JSON.parse(event.body) : {};
            } catch {
                throw new HttpError(400, 'Invalid JSON body');
            }
        }

        const result = schema.safeParse(input);
        if (!result.success) {
            throw new HttpError(400, result.error.issues[0].message);
        }

        // Clean data (trimmed, extra fields removed). Handlers read only from here.    
        if (source === 'query') event.validatedQuery = result.data;
        else event.validatedBody = result.data;
    },

});