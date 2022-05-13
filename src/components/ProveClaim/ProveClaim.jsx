import React, { useState, useEffect } from 'react'
import "./proveclaim.css";
import DropFileInput from '../drop-file-input/DropFileInput';
import { ethers } from 'ethers';
import keccak256 from 'keccak256';
import MerkleTree from 'merkletreejs';


const refugeecampABI = require("./../../refugeecampABI.json");
// const CONTRACT_ADDRESS = "0xD096f5059ccd1ae2759dC893E80FB43E988Af896"
const CONTRACT_ADDRESS = "0x91013c098C93cb2E64189a8c4F6D97D4c9972907"

window.Buffer = window.Buffer || require("buffer").Buffer;

const ProveClaim = () => {
  const [claimValue, setClaimValue] = useState("");
  const [file, setFile] = useState({});
  const [keys, setKeys] = useState(["Claim"]);
  const [claim, setClaim] = useState(-1);
  const [isProofTrue, setIsProofTrue] = useState();



  const onFileChange = async(files) => {
    const fileReader = new FileReader()
    fileReader.readAsText(files[0])
    fileReader.onload = e => {
      const f = JSON.parse(e.target.result)
      setFile(f)
      setKeys(Object.keys(f))
      console.log(Object.keys(f))
    }
  }

  const proveClaim = () => {
    
    // creating PII
    if(file[keys[claim]] != claimValue) {
      setIsProofTrue(false)
      return
    }
    var PIIs = []
    for(var key in file){
      const PII = "" + key + "__" + file[key]
      PIIs.push(PII);
    }
    const leafNodes = PIIs.map((PII) => keccak256(PII));
    const merkleTree = new MerkleTree(leafNodes, keccak256, {sortPairs : true });
    const proof = merkleTree.getHexProof(leafNodes[claim])
    console.log("got proof")
    console.log(proof)
    
    console.log("0x" + merkleTree.getRoot().toString("hex"))
    sendProofToBlockChain(proof, leafNodes[claim])

  }

  const sendProofToBlockChain = async(proof, leaf) => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log("0x" + leaf.toString("hex"))
      await provider.send("eth_requestAccounts", []);
      const hehe = await provider.getCode(CONTRACT_ADDRESS)
      console.log(hehe)
      const signer = await provider.getSigner();
      const refugeecamp = new ethers.Contract(CONTRACT_ADDRESS, refugeecampABI, signer);
      const attestation = await refugeecamp.getAttestation(proof, leaf);
      console.log(attestation)
      setIsProofTrue(attestation);
  }

  return (
    <div className="row">
      <div className="container">
        <div className="registerRefugeeContainer">
          <h1>Prove A Claim</h1>
          <select value = {claim} className='registerDropDown' onChange={(e) => setClaim(e.target.value)}>
            {
              keys.map((k, ind)=> <option value={ind}>{k}</option>)
            }
          </select>
          <input type="text" value={claimValue} className="registerInput" placeholder= "Claim" onChange={(e)=>setClaimValue( e.target.value )}/>
          <DropFileInput onFileChange={(files) => onFileChange(files)}/>  
          <button className="registerButton" onClick={proveClaim}><b>GET PROOF</b></button>
          {isProofTrue == null ? <></>:<h1>{isProofTrue.toString()}</h1>}
        </div>
      </div>
    </div>
    
  )
}

export default ProveClaim