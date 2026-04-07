const hre = require("hardhat");
const fs = require("fs");

async function main() {
  // Get the contract factory
  const DocumentVerification = await hre.ethers.getContractFactory("DocumentVerification");
  const contract = await DocumentVerification.deploy();

  await contract.waitForDeployment();
  const address = await contract.getAddress();

  console.log("DocumentVerification deployed to:", address);

  // Save the contract address to a local file so the backend can use it
  const addressData = { address };
  fs.writeFileSync('./contractAddress.json', JSON.stringify(addressData, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
