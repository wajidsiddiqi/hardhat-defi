const { ethers, getNamedAccounts, network } = require("hardhat");

const AMMOUNT = ethers.utils.parseEther("0.02");

const getWeth = async () => {
  const { deployer } = await getNamedAccounts();
  const iWeth = await ethers.getContractAt(
    "IWeth",
    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    ethers.provider.getSigner(deployer)
  );
  const tx = await iWeth.deposit({ value: AMMOUNT });
  await tx.wait(1);
  const wethBalance = await iWeth.balanceOf(deployer);
  console.log(`got ${wethBalance.toString()} WETH`);
};

module.exports = { getWeth };
