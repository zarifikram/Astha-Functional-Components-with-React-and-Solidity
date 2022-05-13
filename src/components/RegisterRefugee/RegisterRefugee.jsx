import React, {useEffect, useState} from 'react'
import "./registerrefugee.css";
import { ethers } from 'ethers';


const refugeecampABI = require("./../../refugeecampABI.json");
const CONTRACT_ADDRESS = "0x91013c098C93cb2E64189a8c4F6D97D4c9972907"


const RegisterRefugee = () => {
    const [refugeeAddress, setRefugeeAddress] = useState("");
    const [transactions, setTransactions] = useState([])
    const [contractListened, setContractListened] = useState();

    const registration = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const refugeecamp = new ethers.Contract(CONTRACT_ADDRESS, refugeecampABI, signer);
        await refugeecamp.register(refugeeAddress);
      }

      var transactionsTemp = [];

      useEffect(() => {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const refugeecamp = new ethers.Contract(CONTRACT_ADDRESS, refugeecampABI, provider);
          refugeecamp.on("RegistrationComplete", (person, event) => {
            transactionsTemp = [...transactionsTemp, person.substring(0, 5) + "..." + person.substring(37)];
            setTransactions(transactionsTemp);
           });
          setContractListened(refugeecamp);   
          return () => {
            contractListened.removeAllListeners();
          };
        }, []);

    return (
        <div className="row">
          <div className="container">
            <div className="registerRefugeeContainer">
              <h1>Register A Refugee</h1>
              <input type="text" value={refugeeAddress} className="registerInput" placeholder= "Refugee Address" onChange={(e)=>setRefugeeAddress( e.target.value )}/>
              <button className="registerButton" onClick={registration}><b>REGISTER</b></button>
            </div>
          </div>
    
          <div className="container">
            <h1>Transactions</h1>
            {
              transactions.map((transaction)=> <div className='transactionsContainer'>
                <h2>REGISTRATION COMPLETE</h2>
                <h3>Person Address</h3>
                <h1>{transaction}</h1>
              </div>)
            }
          </div>
        </div>
        
      )
}

export default RegisterRefugee


// 0xdB0E43a6D1D97C9700c0861364383F13BEA97C2d  refugee