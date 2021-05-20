const { ethers } = require("ethers");

async function main() {

    const Factory = await ethers.getContractFactory("UniswapV2Factory");
    const Router = await ethers.getContractFactory("UniswapV2Router");
    const WETH = await ethers.getContractFactory("WETH");
    const MockERC20 = await ethers.getContractFactory("MockERC20");
}

main()
 .then(()=> process.exit(0))
 .catch(error => {
     console.error(error);
     process.exit(1);
 })
