const hre = require("hardhat");

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  // Deploy the NFT Contract
  const nftContract = await hre.ethers.deployContract("CryptoDevsNFT");
  await nftContract.waitForDeployment();
  console.log("CryptoDevsNFT deployed to:", nftContract.target);

  // Deploy the Fake Marketplace Contract
  const fakeNftMarketplaceContract = await hre.ethers.deployContract(
    "FakeNFTMarketplace"
  );
  await fakeNftMarketplaceContract.waitForDeployment();
  console.log(
    "FakeNFTMarketplace deployed to:",
    fakeNftMarketplaceContract.target
  );

  // Deploy the DAO Contract
  const amount = hre.ethers.parseEther("0.000001"); // You can change this value from 1 ETH to something else
  const daoContract = await hre.ethers.deployContract("CryptoDevsDAO", [
    fakeNftMarketplaceContract.target,
    nftContract.target,
  ], {value: amount,});
  await daoContract.waitForDeployment();
  console.log("CryptoDevsDAO deployed to:", daoContract.target);

  // Sleep for 30 seconds to let Etherscan catch up with the deployments
  await sleep(30 * 1000);

  // Verify the NFT Contract
  await hre.run("verify:verify", {
    address: nftContract.target,
    constructorArguments: [],
  });

  // Verify the Fake Marketplace Contract
  await hre.run("verify:verify", {
    address: fakeNftMarketplaceContract.target,
    constructorArguments: [],
  });

  // Verify the DAO Contract
  await hre.run("verify:verify", {
    address: daoContract.target,
    constructorArguments: [
      fakeNftMarketplaceContract.target,
      nftContract.target,
    ],
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


/*
CryptoDevsNFT deployed to: 0x20Aff28422EEeC6366789df68D609E876396Cd3a
FakeNFTMarketplace deployed to: 0x34fAD5Ec454124De10c0fcB7495bE78816E87beB
CryptoDevsDAO deployed to: 0xFcBDB6D823f0E921dD3bD53310143D62c0F704a0
The contract 0x20Aff28422EEeC6366789df68D609E876396Cd3a has already been verified on Etherscan.
https://sepolia.etherscan.io/address/0x20Aff28422EEeC6366789df68D609E876396Cd3a#code
The contract 0x34fAD5Ec454124De10c0fcB7495bE78816E87beB has already been verified on Etherscan.
https://sepolia.etherscan.io/address/0x34fAD5Ec454124De10c0fcB7495bE78816E87beB#code
The contract 0xFcBDB6D823f0E921dD3bD53310143D62c0F704a0 has already been verified on Etherscan.
https://sepolia.etherscan.io/address/0xFcBDB6D823f0E921dD3bD53310143D62c0F704a0#code
*/