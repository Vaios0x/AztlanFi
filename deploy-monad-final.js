console.log("🚀 Starting Monad deployment...");

const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("🚀 Deploying AztlanFi smart contracts to Monad testnet...");

  try {
    // Configure specific wallet as deployer
    const privateKey = "2003f926c578fea4a77ffdd98a288a3297ee12b8893505562422dd258e4a5765";
    const deployer = new ethers.Wallet(privateKey, ethers.provider);
    console.log("📝 Deploying contracts with account:", deployer.address);
    console.log("🔑 Expected owner address: 0x8eC3829793D0a2499971d0D853935F17aB52F800");
    
    if (deployer.address.toLowerCase() !== "0x8eC3829793D0a2499971d0D853935F17aB52F800".toLowerCase()) {
      throw new Error("Wallet address mismatch! Please check the private key.");
    }
    
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

    // Deploy AztlanFiCore
    console.log("🏛️ Deploying AztlanFiCore...");
    const AztlanFiCore = await ethers.getContractFactory("AztlanFiCore");
    const aztlanFiCore = await AztlanFiCore.deploy();
    console.log("⏳ Waiting for deployment...");
    await aztlanFiCore.waitForDeployment();
    const coreAddress = await aztlanFiCore.getAddress();
    console.log("✅ AztlanFiCore deployed to:", coreAddress);

    // Deploy PartnerIntegrations
    console.log("🤝 Deploying PartnerIntegrations...");
    const PartnerIntegrations = await ethers.getContractFactory("PartnerIntegrations");
    const partnerIntegrations = await PartnerIntegrations.deploy();
    console.log("⏳ Waiting for deployment...");
    await partnerIntegrations.waitForDeployment();
    const partnerAddress = await partnerIntegrations.getAddress();
    console.log("✅ PartnerIntegrations deployed to:", partnerAddress);

    // Deploy RemittancePool
    console.log("💰 Deploying RemittancePool...");
    const RemittancePool = await ethers.getContractFactory("RemittancePool");
    const remittancePool = await RemittancePool.deploy(oracleAddress);
    console.log("⏳ Waiting for deployment...");
    await remittancePool.waitForDeployment();
    const poolAddress = await remittancePool.getAddress();
    console.log("✅ RemittancePool deployed to:", poolAddress);

    // Update references and configure roles
    console.log("🔗 Updating contract references and configuring roles...");
    
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

    // Configure AztlanFiCore roles
    console.log("⏳ Configuring AztlanFiCore roles...");
    await aztlanFiCore.grantRole(await aztlanFiCore.LIQUIDITY_PROVIDER_ROLE(), deployer.address);
    console.log("✅ Granted LIQUIDITY_PROVIDER_ROLE to deployer");

    // Configure PartnerIntegrations roles
    console.log("⏳ Configuring PartnerIntegrations roles...");
    await partnerIntegrations.grantRole(await partnerIntegrations.PARTNER_ROLE(), deployer.address);
    await partnerIntegrations.grantRole(await partnerIntegrations.ANALYTICS_ROLE(), deployer.address);
    console.log("✅ Granted PARTNER_ROLE and ANALYTICS_ROLE to deployer");

    console.log("\n🎉 All contracts deployed successfully!");
    console.log("\n📋 Contract Addresses:");
    console.log("AztlanFiCore:", coreAddress);
    console.log("PartnerIntegrations:", partnerAddress);
    console.log("RemittancePool:", poolAddress);
    console.log("ComplianceModule:", complianceAddress);
    console.log("IncentiveVault:", vaultAddress);
    console.log("RemittanceToken:", tokenAddress);
    console.log("ExchangeRateOracle:", oracleAddress);

    console.log("\n🔗 MonadScan Explorer Links:");
    console.log("AztlanFiCore: https://testnet.monadscan.com/address/" + coreAddress);
    console.log("PartnerIntegrations: https://testnet.monadscan.com/address/" + partnerAddress);
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
        AztlanFiCore: coreAddress,
        PartnerIntegrations: partnerAddress,
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
    
    // Update frontend contract addresses
    console.log("\n🔄 Updating frontend contract addresses...");
    try {
      const { execSync } = require('child_process');
      execSync('node update-contract-addresses.js', { stdio: 'inherit' });
      console.log("✅ Frontend contract addresses updated successfully!");
    } catch (error) {
      console.log("⚠️  Warning: Could not update frontend addresses automatically");
      console.log("   Please run 'node update-contract-addresses.js' manually");
    }

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
