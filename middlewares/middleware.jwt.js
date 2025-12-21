const tokenService = require("../modules/token/token.service.js");

exports.validJWT = (role) => {
    return async (req, res, next) => {
        const authHeader = req.headers.authorization;

        if (!authHeader || !role) {
            return res.status(401).json({
                message: "Authorization token and role are required",
            });
        }

        const [scheme, token] = authHeader.split(" ");

        if (scheme !== "Bearer" || !token) {
            return res.status(401).json({
                message: "Invalid token format. Use: Bearer <token>",
            });
        }

        // Validate the token
        const isValid = tokenService.validate_access_token(token);

        if (!isValid.valid) {
            return res.status(401).json({
                message: isValid.reason,
                safe: isValid.safe,
            });
        }

        // Check role
        const clearance = tokenService.validate_the_role(
            isValid.decoded.role,
            role
        );

        if (!clearance) {
            return res.status(403).json({
                message: "You do not have permission to perform this action",
                yourRole: isValid.decoded.role,
                requiredRole: role,
            });
        }

        // Attach useful info to request
        req.accessToken = token;
        req.user = isValid.decoded;

        next();
    };
};
