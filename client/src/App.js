import React, { Component } from "react";
import MyNFTContract from "./contracts/MyNFT.json";
import AuctionsContract from "./contracts/Auctions.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      myAccount: null,
      web3: null
    };
  }

  componentWillMount() {
    getWeb3()
      .then(results => {
        this.setState({
          web3: results.web3
        });

        this.instantiateContract();
      })
      .catch((error) => {
        console.log("Error web3: " + error);
      });
  }

  instantiateContract() { // 계약 인스턴스화
    this.state.web3.ethereum.request({ method: 'eth_accounts' }).then(accounts =>
      { this.setState({ myAccount: accounts[0] });
        console.log("account: "+ this.state.myAccount);
      }).catch((error) => {
        console.log(error);
      })
    }
   
  render() {
      return (
        <div>
          <div>
            myaccount is: 
            {this.state.myAccount}
          </div>
        </div>
      );
  }

}

export default App;