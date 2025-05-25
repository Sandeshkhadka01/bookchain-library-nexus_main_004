const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const BookLibrary = await hre.ethers.getContractFactory("BookLibrary");
  // Use deployer as Super Admin
  const contract = await BookLibrary.deploy(deployer.address);
  await contract.waitForDeployment();

  console.log("BookLibrary deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 