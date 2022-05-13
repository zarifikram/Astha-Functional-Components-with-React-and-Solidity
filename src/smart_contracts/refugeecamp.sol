pragma solidity >=0.5.0 <0.6.0;

import "./ownable.sol";
import "./merkleproof.sol";

contract RefugeeCamp is Ownable {
    event RegistrationComplete(address person);
    event AttestionComplete(address person, bytes32 root);

    mapping(address => bool) registered;
    mapping(address => bool) refugeeStatus;
    mapping(bytes32 => bool) attestationStatus;
    mapping(bytes32 => address) public rootHashToOwner;

    function register(address person) public onlyOwner {
        registered[person] = true;
        emit RegistrationComplete(person);
    }

    function enlistDocument(address person, bytes32 root) public onlyOwner{

        attestationStatus[root] = true;
        rootHashToOwner[root] = person;
        emit AttestionComplete(person, root);
    }

    function getAttestation(bytes32[] memory _merkleProof, bytes32 leaf) public view returns (bool) {
        // bytes32 leaf = keccak256(abi.encode(claim));
        bytes32 hash = MerkleProof.getHash(_merkleProof, leaf);
        
        return attestationStatus[hash] && rootHashToOwner[hash] == msg.sender;
    }
}


//   [
//     "0x332cd44ea7a27eb28475620aece0ae827e39d911c0c46861188a33322ff594a8",
//     "0xc703408bd4c051b6f3545cda992c848f047d0935b08aa9f8e03b79b111a237cb",
//     "0x92c74139ac74015458235f5701efb24fbb1e9a4805b8e5a6a6ab9d7790652409",
//     "0xdd3105e1ad9682b35598a339cf74143575e6bf235091e0b1160ec7efec3f537c"
//   ]


// Claim 
// 0xb420553e1eafb0bdf2e8f60d2461cba3c96b6709a7a50765c309275434f1c0cc

// root
// 0x258b10ad1abcf96c69c27c7fa22928ea33065377e8dffab4a4496a085e234564