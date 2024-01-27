import React, { useContext, createContext } from "react";
import IUser from "./interfaces/IUser";

interface IUserContext {
    user: IUser | null;
    setUser: (user: IUser | null) => void;
}

const UserContext = createContext<IUserContext>({
    user: null,
    setUser: () => {},
});

export function UserProvider({ children, value }: any) {
    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useUser = () => useContext(UserContext);