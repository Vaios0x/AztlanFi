const { ethers } = require("ethers");

console.log("🔑 Generating new wallet for Monad testnet...");

// Generate a new random wallet
const wallet = ethers.Wallet.createRandom();

console.log("\n📋 New Wallet Details:");
console.log("Address:", wallet.address);
console.log("Private Key:", wallet.privateKey);
console.log("Mnemonic:", wallet.mnemonic.phrase);

console.log("\n⚠️  IMPORTANT:");
console.log("1. Save the private key securely");
console.log("2. Get testnet tokens from a Monad faucet");
console.log("3. Update hardhat.config.js with the new private key");
console.log("4. Never share your private key publicly");

console.log("\n💧 To get testnet tokens:");
console.log("1. Visit a Monad testnet faucet");
console.log("2. Enter your address:", wallet.address);
console.log("3. Request test tokens");
