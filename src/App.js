import { ethers } from 'ethers';
import moment from 'moment';
import { useEffect, useState } from 'react';
import './App.css';
import abi from './utils/WavePortal.json';

function App() {

  const [currentAccount, setCurrentAccount] = useState('')
  const [allWaves, setAllWaves] = useState([])
  const [input, setInput] = useState('')
  const contractAddress = '0x656A6b40B0425C5F19a115819b769F40bDD6Dd8b'
  const contractABI = abi.abi

  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const waves = await wavePortalContract.getAllWaves();
      
        /*
         * Store our data in React State
         */
        setAllWaves(waves.map(wave => ({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message,
            waveHeight: wave.waveHeight.toNumber(),
        })))
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

/**
 * Listen in for emitter events!
 */
useEffect(() => {
  let wavePortalContract;

  const onNewWave = (from, timestamp, message, waveHeight) => {
    console.log('NewWave', from, timestamp, message);
    setAllWaves(prevState => [
      ...prevState,
      {
        address: from,
        timestamp: new Date(timestamp * 1000),
        message: message,
        waveHeight: waveHeight
      },
    ]);
  };

  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
    wavePortalContract.on('NewWave', onNewWave);
  }

  return () => {
    if (wavePortalContract) {
      wavePortalContract.off('NewWave', onNewWave);
    }
  };
}, []);

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
        await getAllWaves()
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

  const wave = async event => {
    event.preventDefault()
    setInput('')
    try {
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer)

        let count = await wavePortalContract.getTotalWaves()
        console.log('Retrieved total wave count...', count.toNumber())

        if (input && input.length > 0) {
          const waveTxn = await wavePortalContract.wave(input, { gasLimit: 300000 })
          console.log("Mining...", waveTxn.hash)
  
          await waveTxn.wait()
          console.log('mined -- ', waveTxn.hash)
  
          count = await wavePortalContract.getTotalWaves()
          console.log('Got total wave count...', count.toNumber())
        }
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

          <form onSubmit={wave}>
            <input type='text' name='input' value={input} placeholder='Send me a message...' maxLength="50" onChange={event => setInput(event.target.value)}></input>
            <button className="waveButton">
              🌊 Wave at Me
            </button>
          </form>

          {!currentAccount && 
            <button className="waveButton" onClick={connectWallet}>
              Connect Wallet
            </button>
          }
        </div>
        <div className='waves'>
          {allWaves.map((wave, index) => {
            return (
              <div key={index} className='wave'>
                <div className='wave-header'>
                  <div className='from'>{wave.address.substring(0,8)}...</div>
                  <div className='date'>{moment(wave.timestamp).format('MM/d/y')}</div>
                </div>
                <div className='message'>{wave.message}</div>
                <div className="wave-height">They surfed a {wave.waveHeight}ft wave!</div>
              </div>)
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
