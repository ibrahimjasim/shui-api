// HTTP API sends lowercase headers; REST API preserves header-name casing.
const authHeader = headers.authorization ?? headers.Authorization;

if (!authHeader) {
    if (optional) {
        handler.event.user = null;
        return;
    }

    throw new HttpError(401, 'Missing token');
}

const [scheme, token] = authHeader.split(' ');

if (scheme !== 'Bearer' || !token) {
    throw new HttpError(401, 'Invalid token format, use: Bearer <token>');
}

try {
    const decoded = verifyToken(token);
    handler.event.user = { username: decoded.username };
} catch {
    throw new HttpError(401, 'Invalid or expired token');
}