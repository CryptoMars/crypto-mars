//SPDX-License-Identifier: MIT

// most efficient way to delete offer /bid?
// do we need an owner?
// can we get the info offer is not for sale without an mapping entry?
// better way tp safe the trading info in the mapping?
// best way to withdraw?
// verification for the owner? send function to verify an account belongs to someone
// method to refund ether after delete
// squares does not exist useful?

pragma solidity ^0.5.16;


/// @title A simple contract to store property rights on mars
contract DivideMars {

    // Constants and mars divison verification
    string public constant CHAIN_HASH = "e32ec60a118655ea3c044baf6bd78e3ab057c92f162638153aee9b3f2c5ead7b";
    string public constant IPFS_HASH = "QmWmWfR1X9APo2LVUz7rfXjPgPMq5jfvSF1xMtgkcfJqbc";
    uint public constant TOTAL_SUPPLY = 10000;
    string public constant NAME =  "DivideMars";

    address public OWNER;

    //Variables for claiming
    uint public claimProp;
    uint public squaresClaimed;
    uint public DEGRESSION ;

    //Mappings
    mapping(uint => address) public ownership;
    mapping(uint => Offer) public market;
    mapping(uint => Bid) public bids;
    mapping(address => uint) public toWithdraw;
    mapping(address => uint256) public nClaimed;
    mapping(address => uint256) public nClaims;

    constructor()  public {
        OWNER = msg.sender;
        claimProp = 128;  // First claim amount
        squaresClaimed = 0;  //Where to start the claim
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


    // Version 1: Simple claim based on ID
    function claimSquare() public {
        require(squaresClaimed < TOTAL_SUPPLY, "Claiming is over.");
        require(nClaims[msg.sender] < 3, "You already claimed your portion!");
        uint ids = squaresClaimed + claimProp;
        nClaims[msg.sender] += 1;
        if(ids >= TOTAL_SUPPLY){
            ids = TOTAL_SUPPLY;
            for (uint i=squaresClaimed; i < (ids) ; i++) {
            ownership[i] = msg.sender;
            }
            nClaimed[msg.sender] += TOTAL_SUPPLY-squaresClaimed;
            squaresClaimed = TOTAL_SUPPLY;
            delete claimProp;
            delete DEGRESSION;
            emit FinalSquareClaimed(squaresClaimed, ids , msg.sender);
        }
        else {
            for (uint i=squaresClaimed; i < (ids) ; i++) {
                ownership[i] = msg.sender;
            }
            nClaimed[msg.sender] += claimProp;
            emit SquareClaimed(squaresClaimed, ids , msg.sender);
            squaresClaimed += claimProp;
            if (squaresClaimed % 1280 == 0) {
                claimProp  = claimProp / 2 ;
            }
        }
     }

    // Offers
    function offerSquareForSale (uint squareIndex, uint minSalePriceInWei)  public  {
        require(squaresClaimed == TOTAL_SUPPLY , "Trade opens after the claiming phase ends");
        require(ownership[squareIndex] == msg.sender, "You can not offer a square you do not own");
        require(squareIndex < TOTAL_SUPPLY, "Square does not exist");
        market[squareIndex] = Offer(true, squareIndex, msg.sender, minSalePriceInWei, address(0x0));
        emit SquareOffered(squareIndex, minSalePriceInWei, address(0x0));
    }

    function offerSquareForSaleToAddress (uint squareIndex, uint minSalePriceInWei, address toAddress)  public  {
        require(squaresClaimed == TOTAL_SUPPLY , "Trade opens after the claiming phase ends");
        require(ownership[squareIndex] == msg.sender, "You can not offer a square you do not own");
        // problem here?
        require(squareIndex < TOTAL_SUPPLY, "Square does not exist");
        market[squareIndex] = Offer(true, squareIndex, msg.sender, minSalePriceInWei, toAddress);
        emit SquareOffered(squareIndex, minSalePriceInWei, toAddress);
    }

    function squareNoLongerForSale(uint squareIndex) public {
        require(squaresClaimed == TOTAL_SUPPLY , "Trade opens after the claiming phase ends");
        require(ownership[squareIndex] == msg.sender, "You can not offer a square you do not own");
        require(squareIndex < TOTAL_SUPPLY, "Square does not exist");
        market[squareIndex] = Offer(false, squareIndex, msg.sender, 0, address(0x0));
        emit OfferWithdrawn(squareIndex);
    }

    function buySquare(uint squareIndex) public payable {
        require(squaresClaimed == TOTAL_SUPPLY , "Trade opens after the claiming phase ends");
        require(squareIndex < TOTAL_SUPPLY, "Square does not exist");
        Offer memory offer = market[squareIndex];
        require(offer.isForSale, "Square is not for sale");
        if (offer.onlySellTo != address(0x0)) {
            require(offer.onlySellTo == msg.sender, "Square is not offered to you");
        }
        require(msg.value >= offer.minValue, "The price is higher than your sent Ether");
        require(offer.seller == ownership[squareIndex], "This square is no longer owned by this address"); //sanity check
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
        require(squaresClaimed == TOTAL_SUPPLY , "Trade opens after the claiming phase ends");
        require(squareIndex < TOTAL_SUPPLY, "Square does not exist");
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
        require(squaresClaimed == TOTAL_SUPPLY, "Trade opens after the claiming phase ends");
        require(squareIndex < TOTAL_SUPPLY, "Square does not exist");
        Bid memory bid = bids[squareIndex];
        require(bid.bidder ==  msg.sender, "There is no active bet from you for this square");
        uint amount = bid.value;
        bids[squareIndex] = Bid(false, squareIndex, address(0x0), 0);
        toWithdraw[msg.sender] += amount;
        emit SquareBidWithdrawn(squareIndex, bid.value, msg.sender);

    }

    function acceptBidForSquare  (uint squareIndex, uint minPrice)  public  {
        require(squaresClaimed == TOTAL_SUPPLY , "Trade opens after the claiming phase ends");
        require(squareIndex < TOTAL_SUPPLY, "Square does not exist");
        require(ownership[squareIndex] == msg.sender, "You do not own this square");
        Bid memory bid = bids[squareIndex];
        require(bid.value > 0, "Empty bid can not be accepted.");
        require(bid.value >= minPrice, "The bid is lower than your minimum price.");
        ownership[squareIndex] = bid.bidder;
        nClaimed[msg.sender]--;
        nClaimed[bid.bidder]++;
        market[squareIndex] = Offer(false, squareIndex, bid.bidder, 0, address(0x0));
        uint amount = bid.value;
        bids[squareIndex] = Bid(false, squareIndex, address(0x0), 0);
        toWithdraw[msg.sender] += amount;
    }
}