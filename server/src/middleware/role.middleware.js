/**
 * Runs after authenticate. Only JWT payloads with an allowed `role` may proceed.
 */
export function requireRoles(...allowedRoles) {
  const allowed = new Set(allowedRoles);
  return (req, res, next) => {
    const role = req.user?.role;
    if (!role || !allowed.has(role)) {
      return res.status(403).json({
        message:
          "Access denied. Only authorised HR or admin staff may manage roster data from this dashboard.",
      });
    }
    next();
  };
}
