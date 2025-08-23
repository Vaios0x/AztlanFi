const { ethers } = require('hardhat');

async function transferOwnership() {
  // Configuración
  const NEW_OWNER = "0x8eC3829793D0a2499971d0D853935F17aB52F800"; // Tu dirección de wallet
  const DEPLOYER_PRIVATE_KEY = "2003f926c578fea4a77ffdd98a288a3297ee12b8893505562422dd258e4a5765"; // Tu clave privada
  
  // Verificar que la clave privada es válida
  if (!DEPLOYER_PRIVATE_KEY || DEPLOYER_PRIVATE_KEY.length !== 64) {
    console.error("❌ Error: Clave privada inválida");
    return;
  }

  // Direcciones de contratos desplegados
  const CONTRACTS = {
    RemittancePool: "0x138ad2d0d48070dffD6C6DaeaEbADc483CbeE29a",
    ComplianceModule: "0x025434d9Cd4c77F7acC24f8DF90F07b425eFA953",
    IncentiveVault: "0x6fF6aD8216dD1454bC977Ebb72C83aD96C034E28",
    RemittanceToken: "0x2e2e47ab692b8A29c16a38bca3A8523fA520853b",
    ExchangeRateOracle: "0xFFdCc99Cc7A9DE930716e3fB4a1b153caa740AfC"
  };

  console.log("🚀 Iniciando transferencia de ownership...");
  console.log(`📤 Nuevo owner: ${NEW_OWNER}`);
  console.log("");

  // Conectar con la red
  const provider = new ethers.JsonRpcProvider("https://testnet-rpc.monad.xyz");
  const wallet = new ethers.Wallet(DEPLOYER_PRIVATE_KEY, provider);

  console.log(`🔗 Conectado con wallet: ${wallet.address}`);
  console.log("");

  // ABI mínimo para transferOwnership
  const OWNER_ABI = [
    "function owner() view returns (address)",
    "function transferOwnership(address newOwner) external",
    "function authorizedUpdater() view returns (address)",
    "function setAuthorizedUpdater(address newUpdater) external"
  ];

  try {
    for (const [contractName, contractAddress] of Object.entries(CONTRACTS)) {
      console.log(`📋 Procesando ${contractName}...`);
      
      const contract = new ethers.Contract(contractAddress, OWNER_ABI, wallet);
      
      // Verificar owner actual
      const currentOwner = await contract.owner();
      console.log(`   👤 Owner actual: ${currentOwner}`);
      
      if (currentOwner.toLowerCase() === NEW_OWNER.toLowerCase()) {
        console.log(`   ✅ ${contractName} ya tiene el owner correcto`);
        continue;
      }
      
      // Transferir ownership
      console.log(`   🔄 Transfiriendo ownership a ${NEW_OWNER}...`);
      const tx = await contract.transferOwnership(NEW_OWNER);
      await tx.wait();
      console.log(`   ✅ Ownership transferido! TX: ${tx.hash}`);
      
      // Verificar nuevo owner
      const newOwner = await contract.owner();
      console.log(`   👤 Nuevo owner: ${newOwner}`);
      
      // Caso especial para ExchangeRateOracle (también tiene authorizedUpdater)
      if (contractName === "ExchangeRateOracle") {
        console.log(`   🔄 Configurando authorizedUpdater...`);
        const authTx = await contract.setAuthorizedUpdater(NEW_OWNER);
        await authTx.wait();
        console.log(`   ✅ AuthorizedUpdater configurado! TX: ${authTx.hash}`);
      }
      
      console.log("");
    }
    
    console.log("🎉 ¡Transferencia de ownership completada!");
    console.log("");
    console.log("📝 Próximos pasos:");
    console.log("1. Conecta tu wallet en la aplicación");
    console.log("2. Ve al panel de administración (/admin)");
    console.log("3. Verifica que aparezcan todos los badges de Owner");
    console.log("4. ¡Ya tienes acceso completo al sistema!");
    
  } catch (error) {
    console.error("❌ Error durante la transferencia:", error.message);
    console.log("");
    console.log("🔧 Soluciones posibles:");
    console.log("1. Verifica que tienes la clave privada correcta del deployer");
    console.log("2. Asegúrate de tener suficiente MONAD para gas");
    console.log("3. Verifica que la dirección NEW_OWNER es válida");
  }
}

// Ejecutar script
transferOwnership()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
