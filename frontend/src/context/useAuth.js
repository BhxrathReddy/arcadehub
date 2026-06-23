import { useContext } from "react";
import { AuthContext } from "./authValueContext";

export const useAuth = () =>
  useContext(AuthContext);
