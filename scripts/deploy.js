const { ethers } = require("hardhat");

async function main() {

    const [deployer] = await ethers.getSigners();
    console.log(`Deploying with the account: ${deployer.address}`);

    const WETH = await ethers.getContractFactory("WETH");
    const weth = await WETH.deploy();
    await weth.deployed();
    console.log(`Weth address: ${weth.address}`)

    const MockERC20 = await ethers.getContractFactory("MockERC20"); 
    const tokenA = await MockERC20.deploy('Token A', 'TKA', 1000);
    const tokenB = await MockERC20.deploy('Token B','TKB', 1000);
    await tokenA.deployed();
    await tokenB.deployed();
    console.log(`tokenA: ${tokenA.address}`)
    console.log(`tokenB: ${tokenB.address}`)

    const Factory = await ethers.getContractFactory("UniswapV2Factory");
    const factory = await Factory.deploy(deployer.address); 
    await factory.createPair(weth.address, tokenA.address);
    await factory.createPair(weth.address, tokenB.address);

    const Router = await ethers.getContractFactory("UniswapV2Router02");
    const router = await Router.deploy(factory.address, weth.address);
    await router.deployed();
    console.log(`router address: ${router.address}`);

    const SushiToken = await ethers.getContractFactory("SushiToken");
    const sushiToken = await SushiToken.deploy();
    await sushiToken.deployed();
    console.log(`sushiTokeAddress: ${sushiToken.address}`);

    const MasterChef = await ethers.getContractFactory("MasterChef");
    const masterChef = await MasterChef.deploy(sushiToken.address, deployer.address, 100000, 1, 10);
    await masterChef.deployed();
    console.log(`masterChef address: ${masterChef.address}`)
    await sushiToken.transferOwnership(masterChef.address);

    const SushiBar = await ethers.getContractFactory("SushiBar");
    const sushiBar = await SushiBar.deploy(sushiToken.address);
    await sushiBar.deployed();
    console.log(`sushiBar address: ${sushiBar.address}`)

    const SushiMaker = await ethers.getContractFactory("SushiMaker");
    const sushiMaker = await SushiMaker.deploy(factory.address, sushiBar.address, sushiToken.address, weth.address);
    await sushiMaker.deployed();
    console.log(`sushiMaker address: ${sushiMaker.address}`)
    await factory.setFeeTo(sushiMaker.address);  

    const UNISWAP_FACTORY_ADDRESS = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'
    const Migrator = await ethers.getContractFactory("Migrator")
    const migrator = await Migrator.deploy(masterChef.address, UNISWAP_FACTORY_ADDRESS, factory.address, 1)
    await migrator.deployed();
    console.log(`migrator address: ${migrator.address}`)
}

main()
 .then(()=> process.exit(0))
 .catch(error => {
     console.error(error);
     process.exit(1);
 })
