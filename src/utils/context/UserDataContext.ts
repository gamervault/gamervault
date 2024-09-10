import { User } from "@supabase/supabase-js";
import { createContext } from "react";

export const UserDataContext = createContext<User | null | undefined>(null);