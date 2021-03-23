//SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;


/// @title A simple co ntract to store property rights on mars
contract DivideMars {
    
    // To verify the map
    string public MAP_HASH = "e32ec60a118655ea3c044baf6bd78e3ab057c92f162638153aee9b3f2c5ead7b";
    string public IPFS_HASH = "QmWmWfR1X9APo2LVUz7rfXjPgPMq5jfvSF1xMtgkcfJqbc"; 
    
    //Constants
    address payable OWNER;
    uint public TOTAL_SUPPLY = 1000;
    uint public DEGRESSION;
    string public NAME ;

    //Variables
    uint public squaresRemainingToAssign;
    uint public claimProp;
    uint public squareCounter;


    //Mappings
    mapping(uint => address) public ownership;
    mapping(uint => Offer) public market;
    mapping(uint => Bid) public bids;
    mapping(address => uint) public toWithdraw;
    mapping(address => uint256) public nClaimed;

    constructor()  public {
        OWNER = msg.sender;                       // Update total supply
        squaresRemainingToAssign = TOTAL_SUPPLY;
        claimProp = 100;

        DEGRESSION = 90;
        NAME = "Marsdivision";
        squareCounter = 0;
    }

    // Events
    event SquareBidEntered(uint indexed punkIndex, uint value, address indexed fromAddress);
    event SquareOffered(uint indexed punkIndex, uint minValue, address indexed toAddress);
    event SquareBidWithdrawn(uint indexed punkIndex, uint value, address indexed fromAddress);
    event SquareBought(uint indexed punkIndex, uint value, address indexed fromAddress, address indexed toAddress);
    event OfferWithdrawn(uint indexed punkIndex);
    event SquareClaimed(uint indexed start, uint indexed end,  address indexed fromAdsdress);
    event FinalSquareClaimed(uint indexed start, uint indexed end,  address indexed fromAdsdress);

    struct Offer {
        bool isForSale;
        uint punkIndex;
        address seller;
        uint minValue;          // in ether
        address onlySellTo;     // specify to sell only to a specific person
    }

    struct Bid {
        bool hasBid;
        uint punkIndex;
        address bidder;
        uint value;
    }

    // withdraw offers
    function withdrawEther() public {
        uint  amount  = toWithdraw[msg.sender];
        // Remember to zero the pending refund before
        // sending to prevent re-entrancy attacks
        toWithdraw[msg.sender] = 0;
        msg.sender.transfer(amount);
    }


    // Initial distributtruffle migrate-rion
    // Version 1: Simple claim based on ID
    function claimSquare() public {
        require(nClaimed[msg.sender] == 0, "You claimed the maximum of squares already");
        require(squaresRemainingToAssign > 0, "All squares are claimed.");
        uint ids = squareCounter + claimProp;
        if(ids> TOTAL_SUPPLY){
            ids = TOTAL_SUPPLY;
            for (uint i=squareCounter; i < (ids) ; i++) {
            ownership[i] = msg.sender;
            }
            nClaimed[msg.sender] = claimProp;
            squaresRemainingToAssign = 0;
            delete squareCounter;
            delete claimProp;
            delete DEGRESSION;
            emit FinalSquareClaimed(squareCounter, ids , msg.sender);
        }
        else {
            for (uint i=squareCounter; i < (ids) ; i++) {
                ownership[i] = msg.sender;
            }
            nClaimed[msg.sender] = claimProp;
            squaresRemainingToAssign -= claimProp;
            squareCounter += claimProp;
            claimProp = claimProp * DEGRESSION / 100;
            emit SquareClaimed(squareCounter, ids , msg.sender);
        }
     }

    // Offers
    function offerSquareForSale (uint squareIndex, uint minSalePriceInWei)  public  {
        require(ownership[squareIndex] == msg.sender, "You can not offer a square you do not own");
        require(squareIndex <= TOTAL_SUPPLY, "Square does not exist");
        market[squareIndex] = Offer(true, squareIndex, msg.sender, minSalePriceInWei, address(0x0));
        emit SquareOffered(squareIndex, minSalePriceInWei, address(0x0));
    }

    function offerSquareForSaleToAddress (uint squareIndex, uint minSalePriceInWei, address toAddress)  public  {
        require(ownership[squareIndex] == msg.sender, "You can not offer a square you do not own");
        require(squareIndex <= TOTAL_SUPPLY, "Square does not exist");
        market[squareIndex] = Offer(true, squareIndex, msg.sender, minSalePriceInWei, toAddress);
        emit SquareOffered(squareIndex, minSalePriceInWei, toAddress);
    }
    
    function squareNoLongerForSale(uint squareIndex) public {
        require(ownership[squareIndex] == msg.sender, "You can not offer a square you do not own");
        require(squareIndex <= TOTAL_SUPPLY, "Square does not exist");
        market[squareIndex] = Offer(false, squareIndex, msg.sender, 0, address(0x0));
        emit OfferWithdrawn(squareIndex);
    }
    
    function buySquare(uint squareIndex) public payable {
        Offer memory offer = market[squareIndex];
        require(squareIndex <= TOTAL_SUPPLY, "Square does not exist");
        require(offer.isForSale, "Square is not for sale"); 
        if (offer.onlySellTo != address(0x0)) {
            require(offer.onlySellTo != msg.sender, "Square is not offered to you");
        }
        require(msg.value >= offer.minValue, "The price is higher than your sent Ether"); 
        require(offer.seller == ownership[squareIndex], "This square is no longer owned by this address");
        address seller = offer.seller;
        ownership[squareIndex] = msg.sender;
        nClaimed[seller]--;
        nClaimed[msg.sender]++;
        squareNoLongerForSale(squareIndex);
        toWithdraw[seller] += msg.value;
        // Check for the case where there is a bid from the new owner and refund it.
        Bid memory bid = bids[squareIndex];
        if (bid.bidder == msg.sender) {
            // Kill bid and refund value
            toWithdraw[msg.sender] += bid.value;
            bids[squareIndex] = Bid(false, squareIndex, address(0x0), 0);
        }
        emit SquareBought(squareIndex, msg.value, seller, msg.sender);
    }
    
    // Bidding
    function bidForSquare(uint squareIndex) public payable {
        require(squareIndex <= TOTAL_SUPPLY, "Square does not exist");
        require(ownership[squareIndex] != address(0x0), "Square is not owned yet");
        require(ownership[squareIndex] != msg.sender, "You own this square already");
        require(msg.value > 0, "Bid lower than 0");
        Bid memory existing = bids[squareIndex];
        require(msg.value > existing.value, "Your bid is lower than the current bid");
        if (existing.value > 0) {
            // Refund the failing bid
            toWithdraw[existing.bidder] += existing.value;
        }
        bids[squareIndex] = Bid(true, squareIndex, msg.sender, msg.value);
        emit SquareBidEntered(squareIndex, msg.value, msg.sender);
    }

    function withdrawBidForSquare  (uint squareIndex)  public  {
        require(squareIndex <= TOTAL_SUPPLY, "Square does not exist");
        Bid memory bid = bids[squareIndex];
        require(bid.bidder ==  msg.sender, "You do not have a bid for this square active");
        uint amount = bid.value;
        bids[squareIndex] = Bid(false, squareIndex, address(0x0), 0);
        msg.sender.transfer(amount);
        emit SquareBidWithdrawn(squareIndex, bid.value, msg.sender);

    }

    function acceptBidForSquare  (uint squareIndex, uint minPrice)  public  {
        require(squareIndex <= TOTAL_SUPPLY, "Square does not exist");
        require(ownership[squareIndex] == msg.sender, "You do not own this square");
        address seller = msg.sender;
        Bid memory bid = bids[squareIndex];
        require(bid.value > 0, "Empty bid can not be accepted.");
        require(bid.value >= minPrice, "The bid is lower than your minimum price.");
        ownership[squareIndex] = bid.bidder;
        nClaimed[seller]--;
        nClaimed[bid.bidder]++;
        market[squareIndex] = Offer(false, squareIndex, bid.bidder, 0, address(0x0));
        uint amount = bid.value;
        bids[squareIndex] = Bid(false, squareIndex, address(0x0), 0);
        toWithdraw[seller] += amount;
        emit SquareBought(squareIndex, bid.value, seller, bid.bidder);
    }
}