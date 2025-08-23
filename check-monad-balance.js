const { ethers } = require("ethers");

async function checkBalance() {
  console.log("🔍 Checking balance on Monad testnet...");
  
  try {
    // Connect to Monad testnet
    const provider = new ethers.JsonRpcProvider("https://testnet-rpc.monad.xyz");
    
    // Your wallet address (from hardhat config)
    const address = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
    
    // Get network info
    const network = await provider.getNetwork();
    console.log("🌐 Connected to Chain ID:", network.chainId.toString());
    
    // Get balance
    const balance = await provider.getBalance(address);
    console.log("💰 Balance for", address + ":", ethers.formatEther(balance), "ETH");
    
    // Get block number
    const blockNumber = await provider.getBlockNumber();
    console.log("📦 Current block:", blockNumber);
    
    if (balance === 0n) {
      console.log("⚠️  You need to get testnet tokens from a faucet first!");
      console.log("💧 Visit a Monad testnet faucet to get test ETH");
    } else {
      console.log("✅ You have sufficient balance to deploy contracts");
    }
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

checkBalance();
