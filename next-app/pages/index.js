import { useState } from "react"
import { DIDSession } from 'did-session'
import { EthereumWebAuth, getAccountId } from '@didtools/pkh-ethereum'
import { ComposeClient } from '@composedb/client'
import { Ed25519Provider } from "key-did-provider-ed25519";
import { getResolver } from 'key-did-resolver'
import { CeramicClient } from "@ceramicnetwork/http-client";
import { definition } from '../definition'


function IndexPopup() {
  const [data, setData] = useState("")

  const ceramic = new CeramicClient("http://localhost:7007");

  const composeClient = new ComposeClient({
    ceramic: "http://localhost:7007",
    // cast our definition as a RuntimeCompositeDefinition
    definition: definition,
  });

  const authenticateEthPKH = async (ceramic, compose) => {
    const sessionStr = localStorage.getItem('ceramic:eth_did') // for production you will want a better place than localStorage for your sessions.
    let session

    if (sessionStr) {
      session = await DIDSession.fromSession(sessionStr)
    }

    if (!session || (session.hasSession && session.isExpired)) {
      if (window.ethereum === null || window.ethereum === undefined) {
        throw new Error("No injected Ethereum provider found.");
      }

      // We enable the ethereum provider to get the user's addresses.
      const ethProvider = window.ethereum;
      // request ethereum accounts.
      const addresses = await ethProvider.enable({
        method: "eth_requestAccounts",
      });
      const accountId = await getAccountId(ethProvider, addresses[0])
      const authMethod = await EthereumWebAuth.getAuthMethod(ethProvider, accountId)

      /**
       * Create DIDSession & provide capabilities for resources that we want to access.
       * @NOTE: Any production applications will want to provide a more complete list of capabilities.
       *        This is not done here to allow you to add more datamodels to your application.
       */

      // TODO: Switch to explicitly authorized resources. This sets a bad precedent.
      session = await DIDSession.authorize(authMethod, { resources: compose.resources })
      // Set the session in localStorage.
      localStorage.setItem('ceramic:eth_did', session.serialize());
    }

    // Set our Ceramic DID to be our session DID.
    compose.setDID(session.did)
    ceramic.did = session.did
    return
  }

  return (
    <div>
      <p>Hello</p>
    </div>
  );
};

export default IndexPopup;
