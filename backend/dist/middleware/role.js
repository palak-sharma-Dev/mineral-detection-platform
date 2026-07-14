"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = authorize;
function authorize(allowedRoles) {
    return (req, res, next) => {
        const user = req.user;
        if (!user?.role || !allowedRoles.includes(user.role)) {
            return res.status(403).json({ status: "error", message: "Forbidden" });
        }
        next();
    };
}
