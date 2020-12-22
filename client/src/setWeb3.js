import Web3 from "web3";

// const getWeb3 = () =>
//   new Promise((resolve, reject) => {
//     // Wait for loading completion to avoid race conditions with web3 injection timing.
//     window.addEventListener("load", async () => {
//       // Modern dapp browsers...
//       if (window.ethereum) {
//         console.log("wait ethereum...");
//         const web3 = new Web3(window.ethereum);
//         try {
//           // Request account access if needed
//           // ethereum.request({ method: 'eth_requestAccounts' })
//           await window.ethereum.request({ method: 'eth_requestAccounts' });
//           // Acccounts now exposed
//           resolve(web3);
//           console.log("etherunm conneted...");
//         } catch (error) {
//           reject(error);
//         }
//       }
//       // Legacy dapp browsers...
//       else if (window.web3) {
//         // Use Mist/MetaMask's provider.
//         const web3 = window.web3;
//         console.log("Injected web3 detected.");
//         resolve(web3);
//       }
//       // Fallback to localhost; use dev console port by default...
//       else {
//         const provider = new Web3.providers.HttpProvider(
//           "http://13.209.21.107:8545"
//         );
//         const web3 = new Web3(provider);
//         web3.ethereum.autoRefreshOnNetworkChange = false;
//         console.log("No web3 instance injected, using Local web3.");
//         resolve(web3);
        
//       }
//     });
//   });

//   const getAccounts = () =>
//    new Promise((resolve, reject) => {
//     window.addEventListener("load", async () => {
//       const accounts = new Array();
//       await window.ethereum.request({ method: 'eth_accounts' });
//       resolve(accounts);
//     })
//   })

async function setWeb3(cmp) {
  if(window.ethereum) {
    console.log("wait ethereum...");
    const _web3 = new Web3(window.ethereum);
    try{   console.log("etherunm conneted...");
      // window.ethereum.enable() 과 같은 함수임
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      cmp.setState({web3: _web3});
  
      const _accounts = await window.ethereum.request({ method: 'eth_accounts' });
      cmp.setState({accounts: _accounts});
      cmp.setState({default_account: _accounts[0]});
      
    }catch(error) {
      console.log("web3 error: " + error);
    }
  } 
}

export default setWeb3;
