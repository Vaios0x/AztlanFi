console.log("🚀 Starting step-by-step Monad deployment...");

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

    // Get current gas price
    const gasPrice = await ethers.provider.getFeeData();
    console.log("⛽ Current gas price:", ethers.formatUnits(gasPrice.gasPrice, "gwei"), "gwei");

    // Deploy ExchangeRateOracle first
    console.log("\n📊 Step 1: Deploying ExchangeRateOracle...");
    const ExchangeRateOracle = await ethers.getContractFactory("ExchangeRateOracle");
    console.log("⏳ Creating deployment transaction...");
    const exchangeRateOracle = await ExchangeRateOracle.deploy();
    console.log("⏳ Waiting for deployment transaction...");
    await exchangeRateOracle.waitForDeployment();
    const oracleAddress = await exchangeRateOracle.getAddress();
    console.log("✅ ExchangeRateOracle deployed to:", oracleAddress);

    // Deploy RemittanceToken
    console.log("\n🪙 Step 2: Deploying RemittanceToken...");
    const RemittanceToken = await ethers.getContractFactory("RemittanceToken");
    console.log("⏳ Creating deployment transaction...");
    const remittanceToken = await RemittanceToken.deploy();
    console.log("⏳ Waiting for deployment transaction...");
    await remittanceToken.waitForDeployment();
    const tokenAddress = await remittanceToken.getAddress();
    console.log("✅ RemittanceToken deployed to:", tokenAddress);

    // Deploy ComplianceModule
    console.log("\n📋 Step 3: Deploying ComplianceModule...");
    const ComplianceModule = await ethers.getContractFactory("ComplianceModule");
    console.log("⏳ Creating deployment transaction...");
    const complianceModule = await ComplianceModule.deploy(ethers.ZeroAddress);
    console.log("⏳ Waiting for deployment transaction...");
    await complianceModule.waitForDeployment();
    const complianceAddress = await complianceModule.getAddress();
    console.log("✅ ComplianceModule deployed to:", complianceAddress);

    // Deploy IncentiveVault
    console.log("\n🏆 Step 4: Deploying IncentiveVault...");
    const IncentiveVault = await ethers.getContractFactory("IncentiveVault");
    console.log("⏳ Creating deployment transaction...");
    const incentiveVault = await IncentiveVault.deploy(ethers.ZeroAddress, tokenAddress);
    console.log("⏳ Waiting for deployment transaction...");
    await incentiveVault.waitForDeployment();
    const vaultAddress = await incentiveVault.getAddress();
    console.log("✅ IncentiveVault deployed to:", vaultAddress);

    // Deploy RemittancePool
    console.log("\n💰 Step 5: Deploying RemittancePool...");
    const RemittancePool = await ethers.getContractFactory("RemittancePool");
    console.log("⏳ Creating deployment transaction...");
    const remittancePool = await RemittancePool.deploy(oracleAddress);
    console.log("⏳ Waiting for deployment transaction...");
    await remittancePool.waitForDeployment();
    const poolAddress = await remittancePool.getAddress();
    console.log("✅ RemittancePool deployed to:", poolAddress);

    // Update references
    console.log("\n🔗 Step 6: Updating contract references...");
    
    console.log("⏳ Setting RemittancePool in ComplianceModule...");
    const tx1 = await complianceModule.setRemittancePool(poolAddress);
    await tx1.wait();
    console.log("✅ Updated ComplianceModule with RemittancePool address");

    console.log("⏳ Setting RemittancePool in IncentiveVault...");
    const tx2 = await incentiveVault.setRemittancePool(poolAddress);
    await tx2.wait();
    console.log("✅ Updated IncentiveVault with RemittancePool address");

    console.log("⏳ Setting ComplianceModule in RemittancePool...");
    const tx3 = await remittancePool.setComplianceModule(complianceAddress);
    await tx3.wait();
    console.log("✅ Updated RemittancePool with ComplianceModule address");

    console.log("⏳ Adding IncentiveVault as minter...");
    const tx4 = await remittanceToken.addMinter(vaultAddress);
    await tx4.wait();
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
      "deployment-info-monad-final.json",
      JSON.stringify(deploymentInfo, null, 2)
    );
    console.log("\n💾 Deployment info saved to deployment-info-monad-final.json");

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
