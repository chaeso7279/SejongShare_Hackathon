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
    // getWeb3()
    //   .then(results => {
    //     this.setState({
    //       web3: results.web3
    //     });

    //     this.instantiateContract();
    //   })
    //   .catch((error) => {
    //     console.log("Error web3: " + error);
    //   });
  }

  instantiateContract() { // 계약 인스턴스화
    // this.state.web3.ethereum.request({ method: 'eth_accounts' }).then(accounts =>
    //   { this.setState({ myAccount: accounts[0] });
    //     console.log("account: "+ this.state.myAccount);
    //   }).catch((error) => {
    //     console.log(error);
    // })
    // console.log("account: "+ this.state.default_account);
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