const fs = require("fs");
const path = require("path");

console.log("🔍 Verificando preparación para producción...\n");

// Función para verificar si un archivo existe
function checkFileExists(filePath, description) {
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${description}: ${filePath}`);
    return true;
  } else {
    console.log(`❌ ${description}: ${filePath} - NO ENCONTRADO`);
    return false;
  }
}

// Función para verificar si un directorio existe
function checkDirectoryExists(dirPath, description) {
  if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
    console.log(`✅ ${description}: ${dirPath}`);
    return true;
  } else {
    console.log(`❌ ${description}: ${dirPath} - NO ENCONTRADO`);
    return false;
  }
}

// Función para verificar package.json
function checkPackageJson() {
  const packagePath = path.join(__dirname, "..", "package.json");
  if (fs.existsSync(packagePath)) {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
    console.log("✅ package.json encontrado");
    console.log(`   - Nombre: ${packageJson.name}`);
    console.log(`   - Versión: ${packageJson.version}`);
    console.log(`   - Scripts disponibles: ${Object.keys(packageJson.scripts).join(", ")}`);
    return true;
  } else {
    console.log("❌ package.json no encontrado");
    return false;
  }
}

// Función para verificar configuración de contratos
function checkContractConfig() {
  const contractsPath = path.join(__dirname, "..", "src", "lib", "web3", "contracts.ts");
  if (fs.existsSync(contractsPath)) {
    const content = fs.readFileSync(contractsPath, "utf8");
    if (content.includes("0x138ad2d0d48070dffD6C6DaeaEbADc483CbeE29a")) {
      console.log("✅ Configuración de contratos encontrada con direcciones de Monad");
      return true;
    } else {
      console.log("⚠️  Configuración de contratos encontrada pero sin direcciones de Monad");
      return false;
    }
  } else {
    console.log("❌ Configuración de contratos no encontrada");
    return false;
  }
}

// Función para verificar archivos de despliegue
function checkDeploymentFiles() {
  const deploymentPath = path.join(__dirname, "..", "deployment-info-monad-final.json");
  if (fs.existsSync(deploymentPath)) {
    const deploymentInfo = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
    console.log("✅ Información de despliegue encontrada");
    console.log(`   - Red: ${deploymentInfo.network}`);
    console.log(`   - Deployer: ${deploymentInfo.deployer}`);
    console.log(`   - Contratos desplegados: ${Object.keys(deploymentInfo.contracts).length}`);
    return true;
  } else {
    console.log("❌ Información de despliegue no encontrada");
    return false;
  }
}

// Función para verificar estructura de directorios
function checkDirectoryStructure() {
  const directories = [
    { path: "src", description: "Código fuente" },
    { path: "src/app", description: "Páginas de la aplicación" },
    { path: "src/components", description: "Componentes React" },
    { path: "src/lib", description: "Utilidades y configuración" },
    { path: "src/lib/web3", description: "Configuración Web3" },
    { path: "contracts", description: "Smart contracts" },
    { path: "public", description: "Archivos públicos" },
  ];

  let allExist = true;
  directories.forEach(({ path: dirPath, description }) => {
    if (!checkDirectoryExists(dirPath, description)) {
      allExist = false;
    }
  });

  return allExist;
}

// Función para verificar archivos críticos
function checkCriticalFiles() {
  const files = [
    { path: "next.config.js", description: "Configuración de Next.js" },
    { path: "tailwind.config.ts", description: "Configuración de Tailwind" },
    { path: "tsconfig.json", description: "Configuración de TypeScript" },
    { path: "hardhat.config.js", description: "Configuración de Hardhat" },
    { path: "src/app/layout.tsx", description: "Layout principal" },
    { path: "src/app/page.tsx", description: "Página principal" },
    { path: "src/components/web3/WalletConnect.tsx", description: "Componente de conexión de wallet" },
  ];

  let allExist = true;
  files.forEach(({ path: filePath, description }) => {
    if (!checkFileExists(filePath, description)) {
      allExist = false;
    }
  });

  return allExist;
}

// Función para verificar dependencias
function checkDependencies() {
  const packagePath = path.join(__dirname, "..", "package.json");
  if (fs.existsSync(packagePath)) {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
    const requiredDeps = [
      "next",
      "react",
      "react-dom",
      "wagmi",
      "viem",
      "hardhat",
      "@openzeppelin/contracts",
    ];

    const missingDeps = requiredDeps.filter(dep => 
      !packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]
    );

    if (missingDeps.length === 0) {
      console.log("✅ Todas las dependencias críticas están instaladas");
      return true;
    } else {
      console.log(`❌ Dependencias faltantes: ${missingDeps.join(", ")}`);
      return false;
    }
  }
  return false;
}

// Función principal
function main() {
  console.log("🚀 VERIFICACIÓN DE PREPARACIÓN PARA PRODUCCIÓN\n");

  let allChecksPassed = true;

  // Verificar estructura de directorios
  console.log("📁 Verificando estructura de directorios...");
  if (!checkDirectoryStructure()) {
    allChecksPassed = false;
  }
  console.log("");

  // Verificar archivos críticos
  console.log("📄 Verificando archivos críticos...");
  if (!checkCriticalFiles()) {
    allChecksPassed = false;
  }
  console.log("");

  // Verificar package.json
  console.log("📦 Verificando package.json...");
  if (!checkPackageJson()) {
    allChecksPassed = false;
  }
  console.log("");

  // Verificar dependencias
  console.log("🔧 Verificando dependencias...");
  if (!checkDependencies()) {
    allChecksPassed = false;
  }
  console.log("");

  // Verificar configuración de contratos
  console.log("📋 Verificando configuración de contratos...");
  if (!checkContractConfig()) {
    allChecksPassed = false;
  }
  console.log("");

  // Verificar archivos de despliegue
  console.log("🚀 Verificando archivos de despliegue...");
  if (!checkDeploymentFiles()) {
    allChecksPassed = false;
  }
  console.log("");

  // Resultado final
  console.log("=".repeat(50));
  if (allChecksPassed) {
    console.log("🎉 ¡TODAS LAS VERIFICACIONES PASARON!");
    console.log("✅ El proyecto está listo para producción");
    console.log("\n📝 Próximos pasos:");
    console.log("1. Ejecutar 'npm run build' para verificar la compilación");
    console.log("2. Ejecutar 'npm run start' para probar en producción local");
    console.log("3. Desplegar en Vercel, Netlify o tu plataforma preferida");
    console.log("4. Configurar variables de entorno en producción");
    console.log("5. Verificar que los contratos estén desplegados en mainnet");
  } else {
    console.log("❌ ALGUNAS VERIFICACIONES FALLARON");
    console.log("⚠️  Revisa los errores arriba antes de proceder a producción");
  }
  console.log("=".repeat(50));
}

main();
