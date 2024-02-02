import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserContextWrapper = ({ children }) => {
    const [userProfile, setUserProfile] = useState({
        displayName: '',
        avatarCid: '',
        favorites: [],
    });

    return (
        <UserContext.Provider value={{ userProfile, setUserProfile }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => useContext(UserContext);
