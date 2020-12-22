import React, { Component } from "react";
import MyNFTContract from "./contracts/MyNFT.json";
import AuctionsContract from "./contracts/Auctions.json";
import setWeb3 from "./setWeb3";

import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accounts: null, // 전체 어카운트
      default_account: null, // 0번 어카운트
      web3: null
    };
  }

  componentWillMount() {
    setWeb3(this).then(this.instantiateContract);
  }

  instantiateContract() { // 계약 인스턴스화
      const contract = require("truffle-contract");
      const mynft = contract(MyNFTContract);
      const auctions = contract(AuctionsContract);

      mynft.setProvider(this.state.web3.currentProvider);
      auctions.setProvider(this.state.web3.currentProvider);
  }
   
  render() {
      return (
        <div>
          <div>
            myaccount is: 
            {this.state.default_account}
          </div>
        </div>
      );
  }

}

export default App;