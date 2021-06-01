import React from "react";
import { Drizzle } from '@drizzle/store'
import DivideMars from "../artifacts/DivideMars.json"
import Header from "./Header"
import AddContact from "./AddContact"
import ContactList from "./ContactList"
import { DrizzleProvider, DrizzleContext } from '@drizzle/react-plugin'
import { LoadingContainer,
        AccountData,
        ContractData,
        ContractForm
}  from '@drizzle/react-components'


const drizzleOptions = {contracts: [DivideMars]}

function App() {
  const contacts = [
  {
    "id": 1,
    "name": "mars",
    "email": "yeet@gmx.de"
   },
   {
    "id": 2,
    "name": "crypto",
    "email": "oof@gmx.de"
   },
  ];
  return (
    <DrizzleProvider options = {drizzleOptions} >
    <LoadingContainer>
           <div className= "ui container">
            <Header />
            <AddContact />
            <ContactList  contacts= {contacts}/>
            <h5> Your account: </h5>
            <AccountData accountIndex={0} units= {"ether"} precision = {2}/>
            <h5> Constants that might be needed on the page</h5>
            <p>MAP_HASH:  <ContractData contract= "DivideMars" method= "CHAIN_HASH"/></p>
            <p>IPFS_HASH: <ContractData contract= "DivideMars" method= "IPFS_HASH"/></p>

            <h5>Variables that change during interaction</h5>
            <p>Unclaimed squares:  <ContractData contract= "DivideMars" method= "squaresClaimed"/></p>
            <p>Next claim square amount:  <ContractData contract= "DivideMars" method= "claimProp"/></p>

            <h5>Mappings</h5>
            <p>ownership:  <ContractData contract= "DivideMars" method= "ownership" methodArgs= "1"/></p>
            <p>Squares claimed:  <ContractData contract= "DivideMars" method= "nClaimed" methodArgs={["0x6F5a2D4DB9a3cF75562CCfE5dfca177596767963"]}/></p>



            <h5> Methods that change the contract state</h5>
            <p>Claim squares: <ContractForm contract= "DivideMars" method= "claimSquare"/></p>
           </div>
    </LoadingContainer>
    </DrizzleProvider>
  );
}

export default App;
