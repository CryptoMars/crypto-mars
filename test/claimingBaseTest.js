const DivideMars = artifacts.require("DivideMars");

contract('DivideMars', async accounts => {
     it('should keep trading functions closed during claiming', async  ()=> {
        const  divideMars = await DivideMars.deployed();
        var check = false;
        try {
            await divideMars.buySquare(0);
            check = true
        } catch (error) {
          assert.equal(error.reason, "Trade opens after the claiming phase ends", "Error but not due to require")
        }
        try {
            await divideMars.offerSquareForSale(0,1);
            check = true
        } catch (error) {
          assert.equal(error.reason, "Trade opens after the claiming phase ends", "Error but not due to require")
        }
        try {
            await divideMars.offerSquareForSaleToAddress(0,1,accounts[1]);
            check = true
        } catch (error) {
          assert.equal(error.reason, "Trade opens after the claiming phase ends", "Error but not due to require")
        }
        try {
            await divideMars.squareNoLongerForSale(0);
            check = true
        } catch (error) {
          assert.equal(error.reason, "Trade opens after the claiming phase ends", "Error but not due to require")
        }
        try {
            await divideMars.bidForSquare(0);
            check = true
        } catch (error) {
          assert.equal(error.reason, "Trade opens after the claiming phase ends", "Error but not due to require")
        }
        assert.equal(check,false,"A function was called without error")
        try {
            await divideMars.withdrawBidForSquare(0);
            check = true
        } catch (error) {
          assert.equal(error.reason, "Trade opens after the claiming phase ends", "Error but not due to require")
        }
        assert.equal(check,false,"A function was called without error")
        try {
            await divideMars.acceptBidForSquare(0,1);
            check = true
        } catch (error) {
          assert.equal(error.reason, "Trade opens after the claiming phase ends", "Error but not due to require")
        }
        assert.equal(check,false,"A function was called without error")
    });

    it('should correctly claim the first proportion of areas, write the number of claims into the claim  and change the proportion for the next claim', async  ()=> {
        const  divideMars = await DivideMars.deployed();
        const prop = await divideMars.claimProp.call();
        await divideMars.claimSquare({from: accounts[0]});
        const ownerFirst = await divideMars.ownership.call(0)
        const ownerLast = await divideMars.ownership.call(prop.valueOf()-1)
        const noOwner = await divideMars.ownership(prop.valueOf())
        const nClaim = await divideMars.nClaimed(accounts[0])
        assert.equal(nClaim.toNumber(), prop, "Claim counter does not work correctly!");
        assert.equal(ownerFirst, accounts[0], "First square not claimed");
        assert.equal(noOwner, "0x0000000000000000000000000000000000000000", "Too many claims");
        assert.equal(ownerLast,  accounts[0], "Too few claims");
     });
     it('should allow a second claim with the same address', async  ()=> {
        const  divideMars = await DivideMars.deployed();
        var check = false;
        try {
            await divideMars.claimSquare({from: accounts[0]});
            check = true
        } catch (error) {
            assert.equal(error.reason, "You already claimed your portion!", "Error but not due to require")
        }
        assert.equal(check,true,"A second claim was not possible")
     });

     it('should allow a third claim with the same address', async  ()=> {
        const  divideMars = await DivideMars.deployed();
        var check = false;
        try {
            await divideMars.claimSquare({from: accounts[0]});
            check = true
        } catch (error) {
            assert.equal(error.reason, "You already claimed your portion!", "Error but not due to require")
        }
        assert.equal(check,true,"A third claim was not possible")
     });
     it('should not allow a fourth claim with the same address', async  ()=> {
        const  divideMars = await DivideMars.deployed();
        var check = false;
        try {
            await divideMars.claimSquare({from: accounts[0]});
            check = true
        } catch (error) {
            assert.equal(error.reason, "You already claimed your portion!", "Error but not due to require")
        }
        assert.equal(check,false,"A fourth claim was possible")
     });

     it('should keep trading functions still closed after the first claim', async  ()=> {
        const  divideMars = await DivideMars.deployed();
        var check = false;
        try {
            await divideMars.buySquare(0);
            check = true
        } catch (error) {
          assert.equal(error.reason, "Trade opens after the claiming phase ends", "Error but not due to require")
        }
        try {
            await divideMars.offerSquareForSale(0,1);
            check = true
        } catch (error) {
          assert.equal(error.reason, "Trade opens after the claiming phase ends", "Error but not due to require")
        }
        try {
            await divideMars.offerSquareForSaleToAddress(0,1,accounts[1]);
            check = true
        } catch (error) {
          assert.equal(error.reason, "Trade opens after the claiming phase ends", "Error but not due to require")
        }
        try {
            await divideMars.squareNoLongerForSale(0);
            check = true
        } catch (error) {
          assert.equal(error.reason, "Trade opens after the claiming phase ends", "Error but not due to require")
        }
        try {
            await divideMars.bidForSquare(0);
            check = true
        } catch (error) {
          assert.equal(error.reason, "Trade opens after the claiming phase ends", "Error but not due to require")
        }
        assert.equal(check,false,"A function was called without error")
        try {
            await divideMars.withdrawBidForSquare(0);
            check = true
        } catch (error) {
          assert.equal(error.reason, "Trade opens after the claiming phase ends", "Error but not due to require")
        }
        assert.equal(check,false,"A function was called without error")
        try {
            await divideMars.acceptBidForSquare(0,1);
            check = true
        } catch (error) {
          assert.equal(error.reason, "Trade opens after the claiming phase ends", "Error but not due to require")
        }
        assert.equal(check,false,"A function was called without error")
    });
});


