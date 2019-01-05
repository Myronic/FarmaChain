pragma solidity ^0.5.0;
contract Auction {
  address public manager;
  address payable public seller;
  uint public latestBid;
  address payable public latestBidder;
 
  constructor() public {
    manager = msg.sender;
  }
 
  function auction(uint bid) public {
    latestBid = bid * 1 ether; //1000000000000000000;
    seller = msg.sender;
  }
 
  function bid() public payable {
    require(msg.value > latestBid);
 
    if (latestBidder != address(0)) {
      latestBidder.transfer(latestBid);
    }
    latestBidder = msg.sender;
    latestBid = msg.value;
  }
 
  function finishAuction() restricted public {
    seller.transfer(address(this).balance);
  }
 
  modifier restricted() {
    require(msg.sender == manager);
    _;
  }
}

/*
Auction.at("0x1F8402b7137c40447fcF4bb51F8c92d87d5fF4Ec").manager.call();
 
 HelloWorld.deployed().balance.call().then(console.log) 
 Auction.at("0x1F8402b7137c40447fcF4bb51F8c92d87d5fF4Ec").manager.call();

 Auction.deployed().then(function(instance) {return instance.at("0x1F8402b7137c40447fcF4bb51F8c92d87d5fF4Ec").manager.call();})
 .then(function(balance) {
    console.log(balance);
});
*/