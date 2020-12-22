import React, { Component } from "react";
import MyNFTContract from "./contracts/MyNFT.json";
import AuctionsContract from "./contracts/Auctions.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      defaultUser: null,
      web3: null
    };
  }

  componentWillMount() {
    getWeb3
      .then(results => {
        this.setState({
          web3: results.web3
        });

        this.instantiateContract();
      })
      .catch(() => {
        console.log("Error finding web3.");
      });
  }

  instantiateContract() {
    this.state.web3.eth.getAccounts((error, accounts) => {
      if (!error) {
        this.setState({ myAccount: accounts[0] });
      }
    });
  }

  render() {
      return <div>{this.state.defaultUser}</div>
  }

}

export default App;