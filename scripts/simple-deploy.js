const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment...");
  
  try {
    // Get deployer account
    const [deployer] = await ethers.getSigners();
    console.log("📝 Deploying with account:", deployer.address);
    
    // Get balance
    const balance = await deployer.getBalance();
    console.log("💰 Account balance:", ethers.utils.formatEther(balance), "ETH");
    
    // Deploy ExchangeRateOracle
    console.log("📊 Deploying ExchangeRateOracle...");
    const ExchangeRateOracle = await ethers.getContractFactory("ExchangeRateOracle");
    const exchangeRateOracle = await ExchangeRateOracle.deploy();
    await exchangeRateOracle.deployed();
    console.log("✅ ExchangeRateOracle deployed to:", exchangeRateOracle.address);
    
    // Deploy RemittanceToken
    console.log("🪙 Deploying RemittanceToken...");
    const RemittanceToken = await ethers.getContractFactory("RemittanceToken");
    const remittanceToken = await RemittanceToken.deploy();
    await remittanceToken.deployed();
    console.log("✅ RemittanceToken deployed to:", remittanceToken.address);
    
    console.log("\n🎉 Deployment completed successfully!");
    console.log("\n📋 Contract Addresses:");
    console.log("ExchangeRateOracle:", exchangeRateOracle.address);
    console.log("RemittanceToken:", remittanceToken.address);
    
  } catch (error) {
    console.error("❌ Deployment failed:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
