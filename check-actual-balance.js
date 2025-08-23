const { ethers } = require("ethers");

async function checkBalance() {
  console.log("🔍 Checking balance for the configured wallet...");
  
  try {
    // Connect to Monad testnet
    const provider = new ethers.JsonRpcProvider("https://testnet-rpc.monad.xyz");
    
    // Create wallet from private key in hardhat config
    const privateKey = "2003f926c578fea4a77ffdd98a288a3297ee12b8893505562422dd258e4a5765";
    const wallet = new ethers.Wallet(privateKey, provider);
    
    console.log("🔑 Wallet address:", wallet.address);
    
    // Get network info
    const network = await provider.getNetwork();
    console.log("🌐 Connected to Chain ID:", network.chainId.toString());
    
    // Get balance
    const balance = await provider.getBalance(wallet.address);
    console.log("💰 Balance:", ethers.formatEther(balance), "ETH");
    
    // Get block number
    const blockNumber = await provider.getBlockNumber();
    console.log("📦 Current block:", blockNumber);
    
    if (balance === 0n) {
      console.log("⚠️  No balance found for this wallet!");
      console.log("💡 Make sure you're using the correct wallet that has the 2 MONAD");
    } else {
      console.log("✅ You have sufficient balance to deploy contracts!");
      console.log("🚀 Ready to deploy!");
    }
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

checkBalance();
