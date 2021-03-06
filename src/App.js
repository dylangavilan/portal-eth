import React, { useEffect, useState } from "react";
import "./App.css";
import { ethers } from "ethers";
import { abi } from "./utils/WavePortal.json";
const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [allWaves, setAllWaves] = useState([]);
  const [mined, setMined] = useState(false);
  const [input, setInput] = useState([]);
  const contractAddress = "0x67bF472FaC3592Da63621A29539B0407Be9D9792";
  const contractABI = abi;
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }
      const accounts = await ethereum.request({ method: "eth_accounts" });
      console.log("check", accounts);
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };
  const wave = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        const waveTxn = await wavePortalContract.wave(input, {
          gasLimit: 300000,
        });
        setMined(true);
        console.log("Mining...", waveTxn.hash);
        console.log("object", waveTxn);
        await waveTxn.wait();
        setMined(false);
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        const waves = await wavePortalContract.getAllWaves();
        console.log(waves);
        let wavesCleaned = [];
        waves.forEach((wave) => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message,
          });
        });
        setAllWaves(wavesCleaned);
      } else {
        alert("Connect metamask!");
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  console.log(mined);
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="mainContainer">
      <div className="header">???? Hey there!</div>
      <div className="bio">
        I'm Dylan, fullstack developer graduated in bootcamp Henry with a great
        interest in Blockchain!
        <br />
      </div>
      <div className="bio2">
        {" "}
        Connect your Ethereum wallet with Metamask and wave at me!
      </div>
      <div></div>

      {!currentAccount ? (
        <button className="connectwallet" onClick={connectWallet}>
          Connect Wallet
        </button>
      ) : (
        <div>
          <div className="input">
            <input onChange={(e) => setInput(e.target.value)}></input>
            <button className="waveButton" onClick={wave}>
              Wave at Me
            </button>
          </div>
          <button onClick={() => getAllWaves()} className="buttonwaves">
            View all waves
          </button>
          {allWaves?.map((wave, index) => {
            return (
              <div className="waves" key={index}>
                <div>Address: {wave.address}</div>
                <div>Time: {wave.timestamp.toString()}</div>
                <div>Message: {wave.message}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default App;
