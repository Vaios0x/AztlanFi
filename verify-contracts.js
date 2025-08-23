const { ethers } = require("ethers");
const fs = require("fs");

async function verifyContracts() {
  console.log("🔍 Verifying deployed contracts on Monad testnet...");
  
  try {
    // Read deployment info
    const deploymentInfo = JSON.parse(fs.readFileSync("deployment-info-monad-final.json", "utf8"));
    
    // Connect to Monad testnet
    const provider = new ethers.JsonRpcProvider("https://testnet-rpc.monad.xyz");
    
    console.log("📋 Deployment Info:");
    console.log("Network:", deploymentInfo.network);
    console.log("Deployer:", deploymentInfo.deployer);
    console.log("Timestamp:", deploymentInfo.timestamp);
    
    console.log("\n🔍 Verifying contract addresses:");
    
    for (const [contractName, contractAddress] of Object.entries(deploymentInfo.contracts)) {
      console.log(`\n📄 ${contractName}:`);
      console.log("Address:", contractAddress);
      console.log("MonadScan:", `https://testnet.monadscan.com/address/${contractAddress}`);
      
      // Check if contract exists
      const code = await provider.getCode(contractAddress);
      if (code !== "0x") {
        console.log("✅ Contract deployed and verified");
        
        // Get contract balance
        const balance = await provider.getBalance(contractAddress);
        console.log("💰 Contract balance:", ethers.formatEther(balance), "ETH");
      } else {
        console.log("❌ Contract not found or not deployed");
      }
    }
    
    console.log("\n🎉 Verification completed!");
    console.log("\n📝 Next steps:");
    console.log("1. Visit MonadScan to view contract details");
    console.log("2. Update your frontend with these contract addresses");
    console.log("3. Test contract interactions");
    console.log("4. Consider verifying contracts on MonadScan (if supported)");
    
  } catch (error) {
    console.error("❌ Verification failed:", error.message);
  }
}

verifyContracts();
