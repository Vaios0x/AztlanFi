const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying AztlanFi smart contracts to Monad testnet...");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);

  // Deploy ExchangeRateOracle first
  console.log("📊 Deploying ExchangeRateOracle...");
  const ExchangeRateOracle = await ethers.getContractFactory("ExchangeRateOracle");
  const exchangeRateOracle = await ExchangeRateOracle.deploy();
  await exchangeRateOracle.waitForDeployment();
  console.log("✅ ExchangeRateOracle deployed to:", await exchangeRateOracle.getAddress());

  // Deploy RemittanceToken
  console.log("🪙 Deploying RemittanceToken...");
  const RemittanceToken = await ethers.getContractFactory("RemittanceToken");
  const remittanceToken = await RemittanceToken.deploy();
  await remittanceToken.waitForDeployment();
  console.log("✅ RemittanceToken deployed to:", await remittanceToken.getAddress());

  // Deploy ComplianceModule
  console.log("📋 Deploying ComplianceModule...");
  const ComplianceModule = await ethers.getContractFactory("ComplianceModule");
  const complianceModule = await ComplianceModule.deploy(ethers.ZeroAddress); // Will be updated after RemittancePool deployment
  await complianceModule.waitForDeployment();
  console.log("✅ ComplianceModule deployed to:", await complianceModule.getAddress());

  // Deploy IncentiveVault
  console.log("🏆 Deploying IncentiveVault...");
  const IncentiveVault = await ethers.getContractFactory("IncentiveVault");
  const incentiveVault = await IncentiveVault.deploy(ethers.ZeroAddress, await remittanceToken.getAddress()); // Will be updated after RemittancePool deployment
  await incentiveVault.waitForDeployment();
  console.log("✅ IncentiveVault deployed to:", await incentiveVault.getAddress());

  // Deploy RemittancePool
  console.log("💰 Deploying RemittancePool...");
  const RemittancePool = await ethers.getContractFactory("RemittancePool");
  const remittancePool = await RemittancePool.deploy(await exchangeRateOracle.getAddress()); // Oracle address
  await remittancePool.waitForDeployment();
  console.log("✅ RemittancePool deployed to:", await remittancePool.getAddress());

  // Update references
  console.log("🔗 Updating contract references...");
  
  // Update ComplianceModule with RemittancePool address
  await complianceModule.setRemittancePool(await remittancePool.getAddress());
  console.log("✅ Updated ComplianceModule with RemittancePool address");

  // Update IncentiveVault with RemittancePool address
  await incentiveVault.setRemittancePool(await remittancePool.getAddress());
  console.log("✅ Updated IncentiveVault with RemittancePool address");

  // Update RemittancePool with ComplianceModule address
  await remittancePool.setComplianceModule(await complianceModule.getAddress());
  console.log("✅ Updated RemittancePool with ComplianceModule address");

  // Add IncentiveVault as authorized minter for RemittanceToken
  await remittanceToken.addMinter(await incentiveVault.getAddress());
  console.log("✅ Added IncentiveVault as authorized minter for RemittanceToken");

  console.log("\n🎉 All contracts deployed successfully!");
  console.log("\n📋 Contract Addresses:");
  console.log("RemittancePool:", await remittancePool.getAddress());
  console.log("ComplianceModule:", await complianceModule.getAddress());
  console.log("IncentiveVault:", await incentiveVault.getAddress());
  console.log("RemittanceToken:", await remittanceToken.getAddress());
  console.log("ExchangeRateOracle:", await exchangeRateOracle.getAddress());

  console.log("\n🔗 MonadScan Explorer Links:");
  console.log("RemittancePool: https://testnet.monadscan.com/address/" + await remittancePool.getAddress());
  console.log("ComplianceModule: https://testnet.monadscan.com/address/" + await complianceModule.getAddress());
  console.log("IncentiveVault: https://testnet.monadscan.com/address/" + await incentiveVault.getAddress());
  console.log("RemittanceToken: https://testnet.monadscan.com/address/" + await remittanceToken.getAddress());
  console.log("ExchangeRateOracle: https://testnet.monadscan.com/address/" + await exchangeRateOracle.getAddress());

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
      RemittancePool: await remittancePool.getAddress(),
      ComplianceModule: await complianceModule.getAddress(),
      IncentiveVault: await incentiveVault.getAddress(),
      RemittanceToken: await remittanceToken.getAddress(),
      ExchangeRateOracle: await exchangeRateOracle.getAddress(),
    },
    timestamp: new Date().toISOString(),
  };

  const fs = require("fs");
  fs.writeFileSync(
    "deployment-info.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("\n💾 Deployment info saved to deployment-info.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
