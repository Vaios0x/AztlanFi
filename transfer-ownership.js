const { ethers } = require("hardhat");

const NEW_OWNER = "0x8eC3829793D0a2499971d0D853935F17aB52F800"; // Tu dirección de wallet

// Direcciones de contratos desplegados en Monad testnet
const CONTRACT_ADDRESSES = {
  RemittancePool: "0x42cCb3EB32ab80433e957260cD7C486ae1BFb9f6",
  ComplianceModule: "0x1546F9800d28ddff94438A76C8445381E487E1a8",
  IncentiveVault: "0xdFa24C062fb6fFDBF8fe7431aD8EB2014E841ef2",
  RemittanceToken: "0xB72EcDa4f600F5a5965C82eB421a551EdC8279D2",
  ExchangeRateOracle: "0x57439Fa61Ac189DD5fBFaA87113A70C70385cF64",
  AztlanFiCore: "0x46Ca523e51783a378fBa0D06d05929652D04B19E",
  PartnerIntegrations: "0xC1eeEDbc9bcB94484157BbC2F8B95D94B1d7e447",
};

async function main() {
  console.log("🔄 Transferring ownership of all contracts...");
  console.log("👤 New owner:", NEW_OWNER);

  const [deployer] = await ethers.getSigners();
  console.log("📝 Current owner:", deployer.address);

  // Lista de contratos que tienen función transferOwnership
  const contractsToTransfer = [
    { name: "RemittancePool", address: CONTRACT_ADDRESSES.RemittancePool },
    { name: "ComplianceModule", address: CONTRACT_ADDRESSES.ComplianceModule },
    { name: "IncentiveVault", address: CONTRACT_ADDRESSES.IncentiveVault },
    { name: "RemittanceToken", address: CONTRACT_ADDRESSES.RemittanceToken },
    { name: "ExchangeRateOracle", address: CONTRACT_ADDRESSES.ExchangeRateOracle },
    { name: "AztlanFiCore", address: CONTRACT_ADDRESSES.AztlanFiCore },
    { name: "PartnerIntegrations", address: CONTRACT_ADDRESSES.PartnerIntegrations },
  ];

  for (const contract of contractsToTransfer) {
    try {
      console.log(`\n🔄 Transferring ownership of ${contract.name}...`);
      
      // Obtener el contrato
      const contractInstance = await ethers.getContractAt(contract.name, contract.address);
      
      // Verificar si el contrato tiene función transferOwnership
      const hasTransferOwnership = contractInstance.interface.hasFunction('transferOwnership');
      
      if (hasTransferOwnership) {
        // Transferir ownership
        const tx = await contractInstance.transferOwnership(NEW_OWNER);
        console.log(`⏳ Waiting for transaction: ${tx.hash}`);
        await tx.wait();
        console.log(`✅ Ownership transferred for ${contract.name}`);
      } else {
        console.log(`⚠️  ${contract.name} does not have transferOwnership function`);
      }
    } catch (error) {
      console.error(`❌ Error transferring ownership of ${contract.name}:`, error.message);
    }
  }

  console.log("\n🎉 Ownership transfer process completed!");
  console.log("📋 Next steps:");
  console.log("1. Verify ownership transfer on MonadScan");
  console.log("2. Test contract functions with new owner");
  console.log("3. Update documentation if needed");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
