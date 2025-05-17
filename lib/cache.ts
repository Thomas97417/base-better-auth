import { cache } from "react";
import { getUser } from "./auth-session";

export const getUserCache = cache(getUser);
