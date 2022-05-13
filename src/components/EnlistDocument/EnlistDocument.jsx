import React, {useEffect, useState} from 'react'
import "./enlistdocument.css";
import { ethers } from 'ethers';
import DropFileInput from '../drop-file-input/DropFileInput';
import keccak256 from 'keccak256';
import MerkleTree from 'merkletreejs';

const refugeecampABI = require("./../../refugeecampABI.json");
const CONTRACT_ADDRESS = "0x91013c098C93cb2E64189a8c4F6D97D4c9972907"


const EnlistDocument = () => {
    const [refugeeAddress, setRefugeeAddress] = useState("");
    // const [documentHash, setDocumentHash] = useState("");
    const [transactions, setTransactions] = useState([])
    const [contractListened, setContractListened] = useState();
    const [file, setFile] = useState({});

    var root = ""

    const enlistDocument = async () => {
        getRoot()
        console.log(root)
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const refugeecamp = new ethers.Contract(CONTRACT_ADDRESS, refugeecampABI, signer);
        await refugeecamp.enlistDocument(refugeeAddress, root);
      }

    var transactionsTemp = [];

    useEffect(() => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const refugeecamp = new ethers.Contract(CONTRACT_ADDRESS, refugeecampABI, provider);
        refugeecamp.on("AttestionComplete", (person, root, event) => {
          transactionsTemp = [...transactionsTemp, {person: person.substring(0, 5) + "... ... ..." + person.substring(37), root : root.substring(0, 5) + "... ... ..." + root.substring(61)}];
          setTransactions(transactionsTemp);
          });
        setContractListened(refugeecamp);   
        return () => {
          contractListened.removeAllListeners();
        };
      }, []);

    const onFileChange = async(files) => {
      const fileReader = new FileReader()
      fileReader.readAsText(files[0])
      fileReader.onload = e => {
        const f = JSON.parse(e.target.result)
        setFile(f)
      }
    }

    const getRoot = () => {
      // creating PII   
      var PIIs = []
      for(var key in file){
        const PII = "" + key + "__" + file[key]
        PIIs.push(PII);
      }
      const leafNodes = PIIs.map((PII) => keccak256(PII));
      const merkleTree = new MerkleTree(leafNodes, keccak256, {sortPairs : true });
      console.log("0x" + merkleTree.getRoot().toString("hex"))
      root = ("0x" + merkleTree.getRoot().toString("hex"))
    }


    return (
        <div className="row">
          <div className="container">
            <div className="registerRefugeeContainer">
              <h1>Enlist Document Under Refugee</h1>
              <input type="text" value={refugeeAddress} className="registerInput" placeholder= "Refugee Address" onChange={(e)=>setRefugeeAddress( e.target.value )}/>
              <DropFileInput onFileChange={(files) => onFileChange(files)}/>  
              <button className="registerButton" onClick={enlistDocument}><b>ENLIST</b></button>
            </div>
          </div>
    
          <div className="container">
            <h1>Transactions</h1>
            {
              transactions.map((transaction)=> <div className='transactionsContainer'>
                <h2>ATTESTATION COMPLETE</h2>
                <h3>Person Address</h3>
                <h1>{transaction.person}</h1>
                <h3>Document Root Hash</h3>
                <h1>{transaction.root}</h1>
              </div>)
            }
          </div>
        </div>
        
      )
}

export default EnlistDocument


// 0xdB0E43a6D1D97C9700c0861364383F13BEA97C2d  refugee
// 0x258b10ad1abcf96c69c27c7fa22928ea33065377e8dffab4a4496a085e234564 ROOT