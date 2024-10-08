import { createContext } from "react";

import type { AuthContextType } from "./types";

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export default AuthContext;
