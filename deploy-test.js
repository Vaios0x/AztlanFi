const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Testing deployment...");

  try {
    // Get deployer account
    const [deployer] = await ethers.getSigners();
    console.log("📝 Deployer:", deployer.address);
    
    // Get balance
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("💰 Balance:", ethers.formatEther(balance), "ETH");

    // Deploy ExchangeRateOracle
    console.log("📊 Deploying ExchangeRateOracle...");
    const ExchangeRateOracle = await ethers.getContractFactory("ExchangeRateOracle");
    const oracle = await ExchangeRateOracle.deploy();
    await oracle.deployed();
    console.log("✅ Oracle deployed to:", oracle.address);

    console.log("🎉 Test deployment successful!");

  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("Stack:", error.stack);
  }
}

main();
