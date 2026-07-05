import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie, deleteCookie } from "@tanstack/react-start/server";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-change-me";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin";

export const login = createServerFn({ method: "POST" })
  .validator((password: string) => password)
  .handler(async ({ data: password }) => {
    if (password !== ADMIN_PASSWORD) {
      return { success: false, error: "Invalid password" };
    }

    const jwt = await import("jsonwebtoken");
    const token = jwt.default.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "1d" });
    
    // Set cookie for 1 day
    setCookie("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return { success: true };
  });

export const logout = createServerFn({ method: "POST" }).handler(async () => {
  deleteCookie("admin_token");
  return { success: true };
});

export const checkAuth = createServerFn({ method: "GET" }).handler(async () => {
  const token = getCookie("admin_token");
  if (!token) return { authenticated: false };

  try {
    const jwt = await import("jsonwebtoken");
    jwt.default.verify(token, JWT_SECRET);
    return { authenticated: true };
  } catch (err) {
    return { authenticated: false };
  }
});
