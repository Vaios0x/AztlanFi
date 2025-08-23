console.log("🚀 Starting Monad deployment...");

const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("🚀 Deploying AztlanFi smart contracts to Monad testnet...");

  try {
    // Get deployer account
    const [deployer] = await ethers.getSigners();
    console.log("📝 Deploying contracts with account:", deployer.address);
    
    // Get balance
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");
    
    // Get network info
    const network = await ethers.provider.getNetwork();
    console.log("🌐 Network Chain ID:", network.chainId.toString());

    // Deploy ExchangeRateOracle first
    console.log("📊 Deploying ExchangeRateOracle...");
    const ExchangeRateOracle = await ethers.getContractFactory("ExchangeRateOracle");
    const exchangeRateOracle = await ExchangeRateOracle.deploy();
    console.log("⏳ Waiting for deployment...");
    await exchangeRateOracle.waitForDeployment();
    const oracleAddress = await exchangeRateOracle.getAddress();
    console.log("✅ ExchangeRateOracle deployed to:", oracleAddress);

    // Deploy RemittanceToken
    console.log("🪙 Deploying RemittanceToken...");
    const RemittanceToken = await ethers.getContractFactory("RemittanceToken");
    const remittanceToken = await RemittanceToken.deploy();
    console.log("⏳ Waiting for deployment...");
    await remittanceToken.waitForDeployment();
    const tokenAddress = await remittanceToken.getAddress();
    console.log("✅ RemittanceToken deployed to:", tokenAddress);

    // Deploy ComplianceModule
    console.log("📋 Deploying ComplianceModule...");
    const ComplianceModule = await ethers.getContractFactory("ComplianceModule");
    const complianceModule = await ComplianceModule.deploy(ethers.ZeroAddress);
    console.log("⏳ Waiting for deployment...");
    await complianceModule.waitForDeployment();
    const complianceAddress = await complianceModule.getAddress();
    console.log("✅ ComplianceModule deployed to:", complianceAddress);

    // Deploy IncentiveVault
    console.log("🏆 Deploying IncentiveVault...");
    const IncentiveVault = await ethers.getContractFactory("IncentiveVault");
    const incentiveVault = await IncentiveVault.deploy(ethers.ZeroAddress, tokenAddress);
    console.log("⏳ Waiting for deployment...");
    await incentiveVault.waitForDeployment();
    const vaultAddress = await incentiveVault.getAddress();
    console.log("✅ IncentiveVault deployed to:", vaultAddress);

    // Deploy RemittancePool
    console.log("💰 Deploying RemittancePool...");
    const RemittancePool = await ethers.getContractFactory("RemittancePool");
    const remittancePool = await RemittancePool.deploy(oracleAddress);
    console.log("⏳ Waiting for deployment...");
    await remittancePool.waitForDeployment();
    const poolAddress = await remittancePool.getAddress();
    console.log("✅ RemittancePool deployed to:", poolAddress);

    // Update references
    console.log("🔗 Updating contract references...");
    
    console.log("⏳ Setting RemittancePool in ComplianceModule...");
    await complianceModule.setRemittancePool(poolAddress);
    console.log("✅ Updated ComplianceModule with RemittancePool address");

    console.log("⏳ Setting RemittancePool in IncentiveVault...");
    await incentiveVault.setRemittancePool(poolAddress);
    console.log("✅ Updated IncentiveVault with RemittancePool address");

    console.log("⏳ Setting ComplianceModule in RemittancePool...");
    await remittancePool.setComplianceModule(complianceAddress);
    console.log("✅ Updated RemittancePool with ComplianceModule address");

    console.log("⏳ Adding IncentiveVault as minter...");
    await remittanceToken.addMinter(vaultAddress);
    console.log("✅ Added IncentiveVault as authorized minter for RemittanceToken");

    console.log("\n🎉 All contracts deployed successfully!");
    console.log("\n📋 Contract Addresses:");
    console.log("RemittancePool:", poolAddress);
    console.log("ComplianceModule:", complianceAddress);
    console.log("IncentiveVault:", vaultAddress);
    console.log("RemittanceToken:", tokenAddress);
    console.log("ExchangeRateOracle:", oracleAddress);

    console.log("\n🔗 MonadScan Explorer Links:");
    console.log("RemittancePool: https://testnet.monadscan.com/address/" + poolAddress);
    console.log("ComplianceModule: https://testnet.monadscan.com/address/" + complianceAddress);
    console.log("IncentiveVault: https://testnet.monadscan.com/address/" + vaultAddress);
    console.log("RemittanceToken: https://testnet.monadscan.com/address/" + tokenAddress);
    console.log("ExchangeRateOracle: https://testnet.monadscan.com/address/" + oracleAddress);

    // Save deployment info
    const deploymentInfo = {
      network: "monad-testnet",
      deployer: deployer.address,
      contracts: {
        RemittancePool: poolAddress,
        ComplianceModule: complianceAddress,
        IncentiveVault: vaultAddress,
        RemittanceToken: tokenAddress,
        ExchangeRateOracle: oracleAddress,
      },
      timestamp: new Date().toISOString(),
    };

    fs.writeFileSync(
      "deployment-info-monad.json",
      JSON.stringify(deploymentInfo, null, 2)
    );
    console.log("\n💾 Deployment info saved to deployment-info-monad.json");

    console.log("\n📝 Next steps:");
    console.log("1. Verify contracts on MonadScan");
    console.log("2. Update frontend with contract addresses");
    console.log("3. Test contract interactions");
    console.log("4. Deploy frontend to production");

  } catch (error) {
    console.error("❌ Deployment failed:", error);
    console.error("Error details:", error.message);
    if (error.stack) {
      console.error("Stack trace:", error.stack);
    }
    throw error;
  }
}

main()
  .then(() => {
    console.log("🎉 Deployment script completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
