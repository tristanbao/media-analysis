import { createContext } from "react";

// 由于用户需求中没有提到认证功能，我们简化这个上下文
export const AuthContext = createContext({
  isAuthenticated: true,
  setIsAuthenticated: (value: boolean) => {},
  logout: () => {},
});