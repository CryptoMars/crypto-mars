const DivideMars = artifacts.require("DivideMars");

contract('DivideMars', async () => {
     it('Should deploy smart contract properly', async  ()=> {
        const  divideMars = await DivideMars.deployed();
        assert(divideMars.address !== "");
     });

     it ("should instantiate the correct constants ", async ()=> {
        const  divideMars = await DivideMars.deployed();
        const name = await divideMars.NAME.call();
        const ipfs = await divideMars.IPFS_HASH.call();
        const chain = await divideMars.CHAIN_HASH.call();
        const supply = await divideMars.TOTAL_SUPPLY.call();

        assert.equal(name.valueOf(), "DivideMars");
        assert.equal(ipfs.valueOf(), "QmWmWfR1X9APo2LVUz7rfXjPgPMq5jfvSF1xMtgkcfJqbc");
        assert.equal(chain.valueOf(), "e32ec60a118655ea3c044baf6bd78e3ab057c92f162638153aee9b3f2c5ead7b");
        assert.equal(supply.valueOf(), 10000);

     });

     it ("should initialize the variables correctly ", async ()=> {
        const  divideMars = await DivideMars.deployed();
        const squaresClaimed = await divideMars.squaresClaimed.call();
        const owner = await divideMars.OWNER.call();
        const degr = await divideMars.DEGRESSION.call();
        const prop = await divideMars.claimProp.call();

        assert.equal(squaresClaimed.valueOf(), 0);
        assert.notEqual(owner.valueOf(), "0x0");
        assert.equal(prop.valueOf(), 128);

     });
});