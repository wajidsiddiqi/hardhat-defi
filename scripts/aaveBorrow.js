const { getNamedAccounts } = require("hardhat");
const { getWeth } = require("../scripts/getWeth");

const main = async () => {
  await getWeth();
  const { deployer } = await getNamedAccounts();
  const signer = ethers.provider.getSigner(deployer);
  const lendingPool = await getLendingPool(signer);
  console.log(`Lending Pool address ${lendingPool}`);
  //   0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5
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
