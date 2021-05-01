import React from "react";
import { Drizzle } from '@drizzle/store'
import DivideMars from "./artifacts/DivideMars.json"
import { DrizzleProvider, DrizzleContext } from '@drizzle/react-plugin'
import { LoadingContainer,
        AccountData,
        ContractData,
        ContractForm
}  from '@drizzle/react-components'


const drizzleOptions = {contracts: [DivideMars]}

function App() {
  return (
    <DrizzleProvider options = {drizzleOptions} >
    <LoadingContainer>


        <div>
          <div class="facts_view">
            <div class="col-md-4">
            <div class="single_fact">
            <h4>Claimed squares: </h4><h3> <ContractData contract= "DivideMars" method= "squareCounter"/></h3>
            </div>
            </div>

             <div class=" col-md-4">
             <div class="single_fact">
             <h4>Unclaimed squares: </h4><h3> <ContractData contract= "DivideMars" method= "squaresRemainingToAssign"/></h3>
             </div>
             </div>

             <div class="col-md-4">
             <div class="single_fact">
             <h4>Next claim square amount:</h4><h3>  <ContractData contract= "DivideMars" method= "claimProp"/></h3>
             </div>
             </div>
          </div>




            <h5> Your account: </h5>
            <AccountData   accountIndex={0} units= {"ether"} precision = {2}/>

            <h5> Constants that might be needed on the page</h5>
            <p>Contract Name:  <ContractData  contract= "DivideMars" method= "NAME"/></p>
            <p>MAP_HASH:  <ContractData contract= "DivideMars" method= "MAP_HASH"/></p>
            <p>IPFS_HASH: <ContractData contract= "DivideMars" method= "IPFS_HASH"/></p>
            <p>TOTAL_SUPPLY: <ContractData contract= "DivideMars" method= "TOTAL_SUPPLY"/></p>
            <p>Claim degression:  <ContractData contract= "DivideMars" method= "DEGRESSION"/></p>

            <h5>Variables that change during interaction</h5>
            <p>Unclaimed squares:  <ContractData contract= "DivideMars" method= "squaresRemainingToAssign"/></p>
            <p>Next claim square amount:  <ContractData contract= "DivideMars" method= "claimProp"/></p>
            <p>Claimed squares:  <ContractData contract= "DivideMars" method= "squareCounter"/></p>

            <h5>Mappings</h5>
            <p>ownership:  <ContractData contract= "DivideMars" method= "ownership" methodArgs= "1"/></p>
            <p>Market:  <ContractData contract= "DivideMars" method= "market" methodArgs= "1"/></p>
            <p>Bids:  <ContractData contract= "DivideMars" method= "bids" methodArgs= "1"/></p>
            <p>Ether to withdraw:  <ContractData contract= "DivideMars" method= "toWithdraw" methodArgs={["0x6F5a2D4DB9a3cF75562CCfE5dfca177596767963"]}/></p>
            <p>Squares claimed:  <ContractData contract= "DivideMars" method= "nClaimed" methodArgs={["0x6F5a2D4DB9a3cF75562CCfE5dfca177596767963"]}/></p>


            <h5> Methods that change the contract state</h5>
            <p>Claim squares: <ContractForm contract= "DivideMars" method= "claimSquare"/></p>
            <p>Square offer to address: <ContractForm contract= "DivideMars" method= "offerSquareForSaleToAddress"/></p>
            <p>Square offer: <ContractForm contract= "DivideMars" method= "offerSquareForSale"/></p>
            <p>Withdraw offer: <ContractForm contract= "DivideMars" method= "squareNoLongerForSale"/></p>
            <p>Buy square: <ContractForm contract= "DivideMars" method= "buySquare"/></p>
            <p>Bid on square: <ContractForm contract= "DivideMars" method= "bidForSquare"/></p>
            <p>Withdraw bid: <ContractForm contract= "DivideMars" method= "withdrawBidForSquare"/></p>
            <p>Accept open bid: <ContractForm contract= "DivideMars" method= "acceptBidForSquare"/></p>
           </div>

    </LoadingContainer>
    </DrizzleProvider>
  );
}

export default App;
