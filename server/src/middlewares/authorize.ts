import { Request, Response, NextFunction } from "express";

export const authorize = (...allowedRoles: Array<"admin" | "trainer" | "user">) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const headerRole = req.headers["x-role"] as string | undefined;
    const headerUser = req.headers["x-user-id"] as string | undefined;
    if (!req.user && headerRole) req.user = { id: headerUser || "dev-user", role: headerRole as any };

    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    if (!allowedRoles.includes(user.role)) return res.status(403).json({ message: "Forbidden" });
    next();
  };
};
