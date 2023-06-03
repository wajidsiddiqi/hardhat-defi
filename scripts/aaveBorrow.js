const { ethers, getNamedAccounts } = require("hardhat");
const { getWeth, AMOUNT } = require("../scripts/getWeth");

const main = async () => {
  await getWeth();
  const { deployer } = await getNamedAccounts();
  const signer = ethers.provider.getSigner(deployer);
  const lendingPool = await getLendingPool(signer);
  console.log(`Lending Pool address ${lendingPool.address}`);
  const wethTokenAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
  await approveErc20(wethTokenAddress, lendingPool.address, AMOUNT, signer);
  console.log("Deposting.....");
  await lendingPool.deposit(wethTokenAddress, AMOUNT, signer, 0);
  console.log("Deposited!");
};

const approveErc20 = async (
  erc20Address,
  spenderAddress,
  amountToSpend,
  account
) => {
  const erc20Token = await ethers.getContractAt(
    "IERC20",
    erc20Address,
    account
  );
  const tx = await erc20Token.approve(spenderAddress, amountToSpend);
  await tx.wait(1);
  console.log("Approved!");
};

const getLendingPool = async (account) => {
  const lendingPoolAddressesProvider = await ethers.getContractAt(
    "ILendingPoolAddressesProvider",
    "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5",
    account
  );
  const lendingPoolAddress =
    await lendingPoolAddressesProvider.getLendingPool();
  const lendingPool = await ethers.getContractAt(
    "ILendingPool",
    lendingPoolAddress,
    account
  );
  return lendingPool;
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
