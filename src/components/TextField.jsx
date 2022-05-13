import React, {useEffect, useState} from 'react'
import "./textfield.css";
import { ethers } from 'ethers';


const refugeecampABI = require("./../refugeecampABI.json");


const TextField = () => {
  const [contractAddress, setContractAddress] = useState("");
  const [owner, setOwner] = useState("-");
  const [trx, setTrx] = useState(["fasf", "asfs"])
  const [regInfo, setRegInfo] = useState({cAddress: "", address: ""});
  const [contractListened, setContractListened] = useState();
  
  const [finalContractAddress, setFinalContractAddress] = useState("");


  useEffect(() => {
    if(finalContractAddress !== ""){
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const refugeecamp = new ethers.Contract(contractAddress, refugeecampABI, provider);
      alert("useeffect");
      console.log("fasdfa")
      refugeecamp.on("RegistrationComplete", (person, event) => {
        alert("Registration Complete! Person : ", person, event);

        setTrx([...trx, person.substring(0, 5) + "..." + person.substring(37)]);
      });
      setContractListened(refugeecamp);

      return () => {
        contractListened.removeAllListeners();
      };
    }
  },
  [finalContractAddress]
  );

  const registration = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const refugeecamp = new ethers.Contract(regInfo.cAddress, refugeecampABI, signer);
    console.log(signer, contractAddress);
    await refugeecamp.register(regInfo.address);
  }
  
  const getOwner = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const refugeecamp = new ethers.Contract(contractAddress, refugeecampABI, provider);
    const ownerAddress = await refugeecamp.owner();
    setFinalContractAddress(contractAddress);
    console.log(ownerAddress);
    setOwner(ownerAddress);
  }

  return (
    <div className="row">
      <div className="container">
        <div className="registerRefugeeContainer">
          <h1>Register A Refugee</h1>
          <input type="text" value={regInfo.cAddress} placeholder="Contract Address" className="registerInput" onChange={(e)=>setRegInfo({ ...regInfo, cAddress:e.target.value})}/>
          <input type="text" value={regInfo.address} className="registerInput" placeholder= "Refugee Address" onChange={(e)=>setRegInfo({...regInfo, address:e.target.value})}/>
          <button className="registerButton" onClick={registration}><b>REGISTER</b></button>
        </div>

        <div className="registerRefugeeContainer">
          <h1>Get Contract Owner</h1>
          <input type="text" value={contractAddress} className="registerInput" placeholder='Contract Address' onChange={(e)=>setContractAddress(e.target.value)}/>
          <button className="registerButton" onClick={getOwner}><b>GET OWNER ADDRESS</b></button>
          <h3>Owner Address</h3>
          <h2>{owner}</h2>
        </div>
      </div>

      <div className="container">
        <h1>Transactions</h1>
        {
          trx.map((t)=> <div className='trxContainer'>
            <h2>REGISTRATION COMPLETE</h2>
            <h3>Person Address</h3>
            <h1>{t}</h1>
          </div>)
        }
      </div>
    </div>
    
  );
}

export default TextField

// 0xdB0E43a6D1D97C9700c0861364383F13BEA97C2d  refugee
// 0x91013c098C93cb2E64189a8c4F6D97D4c9972907 contract address