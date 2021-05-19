const DivideMars = artifacts.require("DivideMars");

contract('DivideMars', async accounts => {
     it('should properly allow multiple claims', async  ()=> {
        const  divideMars = await DivideMars.deployed();
        const total = await divideMars.TOTAL_SUPPLY.call()
        var claimSum = 0;
        var i;
        var account = 0;
        for (i = 0; i < 2309; i++) {
            const prop = await divideMars.claimProp.call();
            console.log(i)
            await divideMars.claimSquare({from: accounts[account]});
            const ownerFirst = await divideMars.ownership.call(claimSum)
            account +=1;
            if (account %1000 == 0){
                account = 0
            }
            claimSum += parseInt(prop);
        }
        console.log(claimSum)
     });
     it('should still keep all trading functions close up until the last claim', async  ()=> {
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
     it('should make the last claim properly', async  ()=> {
        const  divideMars = await DivideMars.deployed();
        const prop = await divideMars.claimProp.call();
        await divideMars.claimSquare({from: accounts[999]});
        const ownerLast = await divideMars.ownership.call(9999)
        const noOwner = await divideMars.ownership(10000)
        assert.equal(noOwner, "0x0000000000000000000000000000000000000000", "Too many claims");
        assert.equal(ownerLast,  accounts[999], "Too few claims");
     });
     it('should close claiming after the last claim', async  ()=> {
        const  divideMars = await DivideMars.deployed();
        var check = false;
        try {
            await divideMars.claimSquare({from: accounts[998]});
            check = true
        } catch (error) {
            assert.equal(error.reason, "Claiming is over.", "Error but not due to require")
        }
        assert.equal(check,false,"Claiming is not closed properly")
     });
     it('should open trading after the last claim', async  ()=> {
        const  divideMars = await DivideMars.deployed();
        var check = false;
        try {
            await divideMars.buySquare(0,{from: accounts[999]});
            check = true
        } catch (error) {
          assert.notEqual(error.reason, "Trade opens after the claiming phase ends", "Function still closed!")
        }
        try {
            await divideMars.offerSquareForSale(0,1,{from: accounts[999]});
            check = true
        } catch (error) {
          assert.notEqual(error.reason, "Trade opens after the claiming phase ends", "Function still closed!")
        }
        try {
            await divideMars.offerSquareForSaleToAddress(0,1,accounts[1],{from: accounts[999]});
            check = true
        } catch (error) {
          assert.notEqual(error.reason, "Trade opens after the claiming phase ends", "Function still closed!")
        }
        try {
            await divideMars.squareNoLongerForSale(0,{from: accounts[999]});
            check = true
        } catch (error) {
          assert.notEqual(error.reason, "Trade opens after the claiming phase ends", "Function still closed!")
        }
        try {
            await divideMars.bidForSquare(10000,{from: accounts[999]});
            check = true
        } catch (error) {
          assert.notEqual(error.reason, "Trade opens after the claiming phase ends", "Function still closed!")
        }
        try {
            await divideMars.withdrawBidForSquare(0,{from: accounts[999]});
            check = true
        } catch (error) {
          assert.notEqual(error.reason, "Trade opens after the claiming phase ends", "Function still closed!")
        }
        assert.equal(check,false,"A function was called without error")
        try {
            await divideMars.acceptBidForSquare(0,1,{from: accounts[999]});
            check = true
        } catch (error) {
          assert.notEqual(error.reason, "Trade opens after the claiming phase ends", "Function still closed!")
        }
        assert.equal(check,false,"A function was called without error")
     });
     it('should pass a random check of ownership assignment', async  ()=> {
        const  divideMars = await DivideMars.deployed();
        var samples = [0,128,1280,2560,3840,8420]
        var owner= await divideMars.ownership.call(samples[0])
        assert.equal(owner, accounts[0], "Wrong assignment 1");
        var owner= await divideMars.ownership.call(samples[1])
        assert.equal(owner, accounts[1], "Wrong assignment 2");
        var owner= await divideMars.ownership.call(samples[2])
        assert.equal(owner, accounts[10], "Wrong assignment 3");
        var owner= await divideMars.ownership.call(samples[3])
        assert.equal(owner, accounts[30], "Wrong assignment 4");
        var owner= await divideMars.ownership.call(samples[4])
        assert.equal(owner, accounts[70], "Wrong assignment 5");
        var owner= await divideMars.ownership.call(samples[5]) // should be the second claim of the first account
        assert.equal(owner, accounts[0], "Wrong assignment 6");
     });
     it('should state the correct amount of squares claimed', async  ()=> {
        const  divideMars = await DivideMars.deployed();
        var amount = await divideMars.nClaimed.call(accounts[0])
        assert.equal(amount, 128+2+1, "Wrong assignment");
        var amount = await divideMars.nClaimed.call(accounts[9])
        assert.equal(amount, 128+2+1, "Wrong assignment");
        var amount = await divideMars.nClaimed.call(accounts[10])  // a bunch pf precalculated numbers
        assert.equal(amount, 64+2+1, "Wrong assignment");
        var amount = await divideMars.nClaimed.call(accounts[29])
        assert.equal(amount, 64+2+1, "Wrong assignment");
        var amount = await divideMars.nClaimed.call(accounts[10])
        assert.equal(amount, 64+2+1, "Wrong assignment");
        var amount = await divideMars.nClaimed.call(accounts[270])
        assert.equal(amount, 8+1+1, "Wrong assignment");
     });
     //////////////// TRADING //////////////////////
     it('should allow only valid offers ', async  ()=> {
        const  divideMars = await DivideMars.deployed();
        var offered = false
        try {
            await divideMars.offerSquareForSale(0,200,{from: accounts[1]});
            offered = true
        }catch (error) {
            assert.equal(error.reason, "You can not offer a square you do not own", "unowned square should block here")
        }
            assert.equal(offered,false,"Unowned square was offered")
        try {
            await divideMars.offerSquareForSale(0,200,{from: accounts[0]});
        }catch (error) {
            assert.equal(error.reason, "_", "Offer broke")
        }
     });
     it('should allow only valid offers to address', async  ()=> {
        const  divideMars = await DivideMars.deployed();
        var offered = false
        try {
            await divideMars.offerSquareForSaleToAddress(1,200,accounts[999],{from: accounts[1]});
            offered = true
        }catch (error) {
            assert.equal(error.reason, "You can not offer a square you do not own", "unowned square should block here")
        }
            assert.equal(offered,false,"Unowned square was offered")
        try {
            await divideMars.offerSquareForSaleToAddress(1,200,accounts[999],{from: accounts[0]});
        }catch (error) {
            assert.equal(error.reason, "_", "Offer broke")
        }
     });
     it('should allow to withdraw an offer if placed ', async  ()=> {
        const  divideMars = await DivideMars.deployed();
        await divideMars.offerSquareForSale(2,2000000,{from: accounts[0]});
        await divideMars.squareNoLongerForSale(2,{from: accounts[0]})
        var saleState = await divideMars.market.call(2)
        assert.equal(saleState.isForSale, false, "Offer still up!")
        await divideMars.offerSquareForSaleToAddress(2,200,accounts[250],{from: accounts[0]});
        await divideMars.squareNoLongerForSale(2,{from: accounts[0]})
        var saleState = await divideMars.market.call(2)
        assert.equal(saleState.isForSale, false, "Offer still up!")
     });
     it('should block invalid buys ', async  ()=> {
        const  divideMars = await DivideMars.deployed();
        var bought = false
        try {
            await divideMars.buySquare(0,{from: accounts[1],value:10});
            bought = true
        }catch (error) {
            assert.equal(error.reason, "The price is higher than your sent Ether", "Wrong throw")
        }
        try {
            await divideMars.buySquare(10000,{from: accounts[1],value:2000000});
            bought = true
        }catch (error) {
            assert.equal(error.reason, "Square does not exist", "Wrong throw")
        }
        try {
            await divideMars.buySquare(3,{from: accounts[1],value:2000000});
            bought = true
        }catch (error) {
            assert.equal(error.reason, "Square is not for sale", "unowned square should block here")
        }
        try {
            await divideMars.buySquare(1,{from: accounts[1],value:2000000});
            bought = true
        }catch (error) {
            assert.equal(error.reason, "Square is not offered to you", "unowned square should block here")
        }
        assert.equal(bought, false, "Some invalid offer worked!")
     });
     it('should allow to buy a square that is on offer', async  ()=> {
        const  divideMars = await DivideMars.deployed();
        await divideMars.buySquare(0,{from: accounts[1],value:2000000});
        await divideMars.buySquare(1,{from: accounts[999],value:2000000});
     });
     it('should transfer money correctly', async  ()=> {
        const  divideMars = await DivideMars.deployed();
        const money = await divideMars.toWithdraw.call(accounts[0]);
        console.log(money)
        assert.equal(money, 4000000, "An uncorrect amount of Ether is available")
     });
     it('should change mappings correctly', async  ()=> {
        const  divideMars = await DivideMars.deployed();
        const owner1 = await divideMars.ownership.call(0);
        const owner2 = await divideMars.ownership.call(1);
        assert.equal(owner1, accounts[1], "Wrong owner for square after trade")
        assert.equal(owner2, accounts[999], "Wrong owner for square after trade")
     });
     it('should allow bids on a square ', async  ()=> {
        const  divideMars = await DivideMars.deployed();
        await divideMars.bidForSquare(10,{from: accounts[1],value:2000000});
        await divideMars.bidForSquare(20,{from: accounts[2],value:1000000});
     });
     it('should block bids that are lower than current', async  ()=> {
        const  divideMars = await DivideMars.deployed();
        offered = false
        try {
            await divideMars.bidForSquare(10,{from: accounts[1],value:1000000});
            offered = true
        }catch (error) {
            assert.equal(error.reason, "Your bid is lower than the current bid", "lower bet shouldnt be possible")
        }
        try {
            await divideMars.bidForSquare(10,{from: accounts[9],value:1000000});
            offered = true
        }catch (error) {
            assert.equal(error.reason, "Your bid is lower than the current bid", "lower bet shouldnt be possible")
        }
        try {
            await divideMars.bidForSquare(10,{from: accounts[0],value:1000000});
            offered = true
        }catch (error) {
            assert.equal(error.reason, "You own this square already", "should break because squared already owned")
        }
        assert.equal(offered,false, "Some invalid bet went through")
     });
     it('should allow to withdraw a bid if placed ', async  ()=> {
        const  divideMars = await DivideMars.deployed();
        await divideMars.withdrawBidForSquare(10,{from: accounts[1]})
        const bid = await divideMars.bids.call(10)
        assert.equal(bid.hasBid, false, "Offer still up!")
     });
     it('should block invalid bid acceptance', async  ()=> {
        const  divideMars = await DivideMars.deployed();
        offered = false
        try {
            await divideMars.acceptBidForSquare(20, 5000000,{from: accounts[0]})
            offered = true
        }catch (error) {
            assert.equal(error.reason, "The bid is lower than your minimum price.", "should block because of minimum price")
        }
       try {
            await divideMars.acceptBidForSquare(20, 50,{from: accounts[1]})
            offered = true
        }catch (error) {
            assert.equal(error.reason, "You do not own this square", "should block because doesnt belong")
        }
       assert.equal(offered,false, "Some invalid acceptance went through")
     });
     it('should allow to accept a bid if one is the owner and transfer money correctly', async  ()=> {
        const  divideMars = await DivideMars.deployed();
        const money = await divideMars.toWithdraw.call(accounts[0]);
        await divideMars.acceptBidForSquare(20, 10000,{from: accounts[0]})
        const new_owner = await divideMars.ownership.call(20);
        assert.equal(new_owner, accounts[2], "Wrong owner for square after bid acceptance")
        const money2 = await divideMars.toWithdraw.call(accounts[0]);
        assert.equal(parseInt(money) + 1000000, money2, "Money was not sent correctly")
     });
     it('should be possible to withdraw Ether ', async  ()=> {
        const  divideMars = await DivideMars.deployed();
        await divideMars.withdrawEther({from: accounts[0]})
        const money = await divideMars.toWithdraw.call(accounts[0],{from: accounts[0]});
        assert.equal(money,0 , "Money was not withdrawn correctly")
     });
});


