import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import './App.css';
import abi from './utils/WavePortal.json';

function App() {

  const [currentAccount, setCurrentAccount] = useState('')
  const contractAddress = '0xBF20A06C176dDfdf5ECeA591e8624E584BdB0578'
  const contractABI = abi.abi

  const checkIfWalletIsConnected = async () => {
    try {
      const {ethereum} = window
  
      if (!ethereum) {
        console.log("Make sure you have metamask!")
        return
      }
      else {
        console.log("We have the ethereum object", ethereum)
      }
    
      const accounts = await ethereum.request({method: 'eth_accounts'})
  
      if (accounts.length !== 0) {
        const account = accounts[0]
        console.log('Found an authorized account:', account)
        setCurrentAccount(account)
      }
      else {
        console.log('No authorized account found')
      }
    }
    catch (error) {
      console.log(error)
    }
  }

  const connectWallet = async () => {
    try {
      const {ethereum} = window

      if (!ethereum) {
        alert('Get Metamask!')
        return
      }

      const accounts = await ethereum.request({method: 'eth_requestAccounts'})

      console.log('connected', accounts[0])
      setCurrentAccount(accounts[0])
    }
    catch (error) {
      console.log(error)
    }
  }

  const wave = async () => {
    try {
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer)

        let count = await wavePortalContract.getTotalWaves()
        console.log('Retrieved total wave count...', count.toNumber())

        const waveTxn = await wavePortalContract.wave()
        console.log("Mining...", waveTxn.hash)

        await waveTxn.wait()
        console.log('mined -- ', waveTxn.hash)

        count = await wavePortalContract.getTotalWaves()
        console.log('Got total wave count...', count.toNumber())
      }
      else {
        console.log('ethereum object doesn\'t exist')
      }
    }
    catch (error) {
      console.log(error)
    }
  }

  useEffect( () => {
    checkIfWalletIsConnected()
  }, [])

  return (
    <div className='App'>
      <div className="main-container">
        <div className="data-container">
          <div className="header">
          👋 Hey there!
          <img className='profile-img' src='https://i.imgur.com/m39Zdqn.jpg'/>
          </div>

          <div className="bio">
            I am Blake and I live in O'ahu Hawai'i! Connect your Ethereum wallet and wave at me!
          </div>

          <button className="waveButton" onClick={wave}>
            🌊 Wave at Me
          </button>

          {!currentAccount && 
            <button className="waveButton" onClick={connectWallet}>
              Connect Wallet
            </button>
          }
        </div>
      </div>
    </div>
  );
}

export default App;
