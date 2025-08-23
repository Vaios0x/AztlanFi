const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Iniciando despliegue en Monad Testnet...");

  // Obtener el deployer
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  console.log("💰 Account balance:", (await deployer.getBalance()).toString());

  // Desplegar AztlanFiCore
  console.log("\n📦 Desplegando AztlanFiCore...");
  const AztlanFiCore = await ethers.getContractFactory("AztlanFiCore");
  const aztlanFiCore = await AztlanFiCore.deploy();
  await aztlanFiCore.deployed();
  console.log("✅ AztlanFiCore deployed to:", aztlanFiCore.address);

  // Desplegar SavingsGoals
  console.log("\n📦 Desplegando SavingsGoals...");
  const SavingsGoals = await ethers.getContractFactory("SavingsGoals");
  const savingsGoals = await SavingsGoals.deploy();
  await savingsGoals.deployed();
  console.log("✅ SavingsGoals deployed to:", savingsGoals.address);

  // Desplegar P2PEscrow
  console.log("\n📦 Desplegando P2PEscrow...");
  const P2PEscrow = await ethers.getContractFactory("P2PEscrow");
  const p2pEscrow = await P2PEscrow.deploy();
  await p2pEscrow.deployed();
  console.log("✅ P2PEscrow deployed to:", p2pEscrow.address);

  // Configurar roles y permisos
  console.log("\n🔧 Configurando roles y permisos...");
  
  // Dar rol de escrow manager al deployer
  const ESCROW_MANAGER_ROLE = await p2pEscrow.ESCROW_MANAGER_ROLE();
  await p2pEscrow.grantRole(ESCROW_MANAGER_ROLE, deployer.address);
  console.log("✅ Escrow manager role granted to deployer");

  // Dar rol de compliance officer al deployer
  const COMPLIANCE_OFFICER_ROLE = await aztlanFiCore.COMPLIANCE_OFFICER_ROLE();
  await aztlanFiCore.grantRole(COMPLIANCE_OFFICER_ROLE, deployer.address);
  console.log("✅ Compliance officer role granted to deployer");

  // Dar rol de liquidity provider al deployer
  const LIQUIDITY_PROVIDER_ROLE = await aztlanFiCore.LIQUIDITY_PROVIDER_ROLE();
  await aztlanFiCore.grantRole(LIQUIDITY_PROVIDER_ROLE, deployer.address);
  console.log("✅ Liquidity provider role granted to deployer");

  // Inicializar corredores
  console.log("\n🌍 Inicializando corredores de pago...");
  await aztlanFiCore.initializeCorridors();
  console.log("✅ Corredores inicializados");

  // Verificar contratos
  console.log("\n🔍 Verificando contratos...");
  try {
    await aztlanFiCore.getCorridor(1); // USA-Mexico
    console.log("✅ AztlanFiCore verificado");
  } catch (error) {
    console.log("❌ Error verificando AztlanFiCore:", error.message);
  }

  // Guardar información de despliegue
  const deploymentInfo = {
    network: "monad-testnet",
    chainId: 41454,
    deployer: deployer.address,
    contracts: {
      aztlanFiCore: aztlanFiCore.address,
      savingsGoals: savingsGoals.address,
      p2pEscrow: p2pEscrow.address,
    },
    timestamp: new Date().toISOString(),
    blockNumber: await ethers.provider.getBlockNumber(),
  };

  const deploymentPath = path.join(__dirname, "../deployment-info-monad-final.json");
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("\n📄 Información de despliegue guardada en:", deploymentPath);

  // Mostrar resumen
  console.log("\n🎉 ¡Despliegue completado exitosamente!");
  console.log("=" * 50);
  console.log("📋 Resumen del despliegue:");
  console.log(`🌐 Red: Monad Testnet (Chain ID: 41454)`);
  console.log(`👤 Deployer: ${deployer.address}`);
  console.log(`📦 AztlanFiCore: ${aztlanFiCore.address}`);
  console.log(`💰 SavingsGoals: ${savingsGoals.address}`);
  console.log(`🤝 P2PEscrow: ${p2pEscrow.address}`);
  console.log(`📊 Block: ${deploymentInfo.blockNumber}`);
  console.log("=" * 50);

  // URLs de explorador
  console.log("\n🔗 Enlaces útiles:");
  console.log(`🌐 MonadScan: https://testnet.monadscan.com`);
  console.log(`📦 AztlanFiCore: https://testnet.monadscan.com/address/${aztlanFiCore.address}`);
  console.log(`💰 SavingsGoals: https://testnet.monadscan.com/address/${savingsGoals.address}`);
  console.log(`🤝 P2PEscrow: https://testnet.monadscan.com/address/${p2pEscrow.address}`);

  return {
    aztlanFiCore: aztlanFiCore.address,
    savingsGoals: savingsGoals.address,
    p2pEscrow: p2pEscrow.address,
  };
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error durante el despliegue:", error);
    process.exit(1);
  });
