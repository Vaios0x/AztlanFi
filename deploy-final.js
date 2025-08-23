const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying AztlanFi smart contracts to Monad testnet...");

  try {
    // Get deployer account
    const [deployer] = await ethers.getSigners();
    console.log("📝 Deploying contracts with account:", deployer.address);
    
    // Get balance
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");

    // Deploy ExchangeRateOracle first
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

    // Deploy ComplianceModule
    console.log("📋 Deploying ComplianceModule...");
    const ComplianceModule = await ethers.getContractFactory("ComplianceModule");
    const complianceModule = await ComplianceModule.deploy(ethers.constants.AddressZero);
    await complianceModule.deployed();
    console.log("✅ ComplianceModule deployed to:", complianceModule.address);

    // Deploy IncentiveVault
    console.log("🏆 Deploying IncentiveVault...");
    const IncentiveVault = await ethers.getContractFactory("IncentiveVault");
    const incentiveVault = await IncentiveVault.deploy(ethers.constants.AddressZero, remittanceToken.address);
    await incentiveVault.deployed();
    console.log("✅ IncentiveVault deployed to:", incentiveVault.address);

    // Deploy RemittancePool
    console.log("💰 Deploying RemittancePool...");
    const RemittancePool = await ethers.getContractFactory("RemittancePool");
    const remittancePool = await RemittancePool.deploy(exchangeRateOracle.address);
    await remittancePool.deployed();
    console.log("✅ RemittancePool deployed to:", remittancePool.address);

    // Update references
    console.log("🔗 Updating contract references...");
    
    // Update ComplianceModule with RemittancePool address
    await complianceModule.setRemittancePool(remittancePool.address);
    console.log("✅ Updated ComplianceModule with RemittancePool address");

    // Update IncentiveVault with RemittancePool address
    await incentiveVault.setRemittancePool(remittancePool.address);
    console.log("✅ Updated IncentiveVault with RemittancePool address");

    // Update RemittancePool with ComplianceModule address
    await remittancePool.setComplianceModule(complianceModule.address);
    console.log("✅ Updated RemittancePool with ComplianceModule address");

    // Add IncentiveVault as authorized minter for RemittanceToken
    await remittanceToken.addMinter(incentiveVault.address);
    console.log("✅ Added IncentiveVault as authorized minter for RemittanceToken");

    console.log("\n🎉 All contracts deployed successfully!");
    console.log("\n📋 Contract Addresses:");
    console.log("RemittancePool:", remittancePool.address);
    console.log("ComplianceModule:", complianceModule.address);
    console.log("IncentiveVault:", incentiveVault.address);
    console.log("RemittanceToken:", remittanceToken.address);
    console.log("ExchangeRateOracle:", exchangeRateOracle.address);

    console.log("\n🔗 Explorer Links:");
    console.log("RemittancePool: https://explorer.testnet.monad.xyz/address/" + remittancePool.address);
    console.log("ComplianceModule: https://explorer.testnet.monad.xyz/address/" + complianceModule.address);
    console.log("IncentiveVault: https://explorer.testnet.monad.xyz/address/" + incentiveVault.address);
    console.log("RemittanceToken: https://explorer.testnet.monad.xyz/address/" + remittanceToken.address);
    console.log("ExchangeRateOracle: https://explorer.testnet.monad.xyz/address/" + exchangeRateOracle.address);

    console.log("\n📝 Next steps:");
    console.log("1. Update .env.local with contract addresses");
    console.log("2. Verify contracts on explorer");
    console.log("3. Test contract interactions");
    console.log("4. Deploy frontend to Vercel");

    // Save deployment info
    const deploymentInfo = {
      network: "monad-testnet",
      deployer: deployer.address,
      contracts: {
        RemittancePool: remittancePool.address,
        ComplianceModule: complianceModule.address,
        IncentiveVault: incentiveVault.address,
        RemittanceToken: remittanceToken.address,
        ExchangeRateOracle: exchangeRateOracle.address,
      },
      timestamp: new Date().toISOString(),
    };

    const fs = require("fs");
    fs.writeFileSync(
      "deployment-info.json",
      JSON.stringify(deploymentInfo, null, 2)
    );
    console.log("\n💾 Deployment info saved to deployment-info.json");

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
