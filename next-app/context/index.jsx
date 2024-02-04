import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { CeramicClient } from "@ceramicnetwork/http-client"
import { ComposeClient } from "@composedb/client";

import { definition } from "../definition";

/**
 * Configure ceramic Client & create context.
 */
const ceramic = new CeramicClient("http://localhost:7007");

const composeClient = new ComposeClient({
  ceramic: "http://localhost:7007",
  // cast our definition as a RuntimeCompositeDefinition
  definition: definition,
});

const CeramicContext = createContext({ ceramic: ceramic, composeClient: composeClient });
const UserContext = createContext();

export const CeramicWrapper = ({ children }) => {
  const [userProfile, setUserProfile] = useState({
    displayName: '',
    bio: '',
    avatarCid: '',
    favorites: [],
  });

  const getUserDetails = useCallback((user) => {
    setUserProfile(user);
  }, []);

  const value = useMemo(() => ({ userProfile, getUserDetails }), [userProfile]);
  return (
    <CeramicContext.Provider value={{ ceramic, composeClient }}>
      <UserContext.Provider value={value}>
        {children}
      </UserContext.Provider>
    </CeramicContext.Provider>
  );
};

/**
 * Provide access to the Ceramic & Compose clients.
 * @example const { ceramic, compose } = useCeramicContext()
 * @returns CeramicClient
 */

export const useCeramicContext = () => useContext(CeramicContext);
export const useUserContext = () => useContext(UserContext);