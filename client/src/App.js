import logo from './logo.svg';
import './App.css';
import {HashRouter, Route} from 'react-router-dom';
import Main from './routes/Main';
import MyShareList from './routes/MyShareList';
import MyPage from'./routes/MyPage';
import MileageApplication from'./routes/MileageApplication';
import ShareItemList from './routes/ShareItemList';
import ShareItemDetail from './routes/ShareItemDetail';
import ShareTalentList from './routes/ShareTalentList';
import ShareTalentDetail from './routes/ShareTalentDetail';
import Navigation from './components/Navigation';

function App() {
  let router;
  const navigate = (pageName = '') =>{
    router.history.push('/'+pageName);


  return (
      <HashRouter ref = {(r)=>{router = r;}}>
        <Route path="/" exact={true} component={Main}/>
        <Route path="/mysharelist" component={MyShareList}/>
        <Route path="/mileage_application" component={MileageApplication}/>
        <Route path="/mypage" component={MyPage}/>

        <Route path="/share_item_list" component={ShareItemList}/>
        <Route path="/share_item_detail" component={ShareItemDetail}/>
        <Route path="/share_talent_list" component={ShareTalentList}/>
        <Route path="/share_talent_detail" component={ShareTalentDetail}/>
      </HashRouter>
  );
}

import React, { Component } from "react";
import MyNFTContract from "./contracts/MyNFT.json";
import AuctionsContract from "./contracts/Auctions.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
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
    const contract = require("truffle-contract");
    const MyNFT = contract(MyNFTContract);
    const Auctions = contract(AuctionsContract);
    
    MyNFT.setProvider(this.state.web3.currentProvider);
    Auctions.setProvider(this.state.web3.currentProvider);
    
  }

  render() {
    return <div className="App">Fruit shop</div>;
  }