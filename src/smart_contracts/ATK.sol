pragma solidity >=0.5.0 <0.6.0;

import "./ownable.sol";

contract ATK is Ownable {
    mapping (address => uint) balances;
    event BalanceAdded(
        address to,
        uint amount
    );

    event AmountTransferred(
        address sender,
        address requested,
        uint amount
    );

    function mint(uint amount, address to) public onlyOwner {
        balances[to] += amount;
        emit BalanceAdded(to, amount);
    }

    function send(uint amount, address to) public {
        require(balances[msg.sender] >= amount);
        balances[msg.sender] -= amount;
        balances[to] += amount;
        emit AmountTransferred(msg.sender, to, amount);
    }

    function getBalance() public view returns (uint){
        return balances[msg.sender];
    }
}

