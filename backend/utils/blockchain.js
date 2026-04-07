const ethers = require('ethers');
const fs = require('fs');
const path = require('path');

// Read the ABI from compiled Hardhat artifacts and deployed address
const contractJsonPath = path.join(__dirname, '../artifacts/contracts/DocumentVerification.sol/DocumentVerification.json');
const addressJsonPath = path.join(__dirname, '../contractAddress.json');

let contractABI = [];
let contractAddress = '';

if (fs.existsSync(contractJsonPath)) {
    const contractJson = JSON.parse(fs.readFileSync(contractJsonPath, 'utf-8'));
    contractABI = contractJson.abi;
}

if (fs.existsSync(addressJsonPath)) {
    const addressJson = JSON.parse(fs.readFileSync(addressJsonPath, 'utf-8'));
    contractAddress = addressJson.address;
}

// Set up provider and wallet
const rpcUrl = process.env.RPC_URL || "http://127.0.0.1:8545";
const privateKey = process.env.ISSUER_PRIVATE_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; // Default Hardhat Account #0

const getContract = () => {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    return new ethers.Contract(contractAddress, contractABI, wallet);
};

const storeDocumentOnBlockchain = async (documentHash) => {
    try {
        if (!contractAddress || contractABI.length === 0) {
            console.log("Blockchain integration skipped: Contract not deployed yet or ABI missing.");
            return "simulated_tx_hash_" + documentHash;
        }
        const contract = getContract();
        const tx = await contract.issueDocument(documentHash);
        const receipt = await tx.wait();
        return receipt.hash;
    } catch (error) {
        console.error("Blockchain error:", error);
        throw error;
    }
};

const verifyDocumentOnBlockchain = async (documentHash) => {
    try {
        if (!contractAddress || contractABI.length === 0) {
            console.log("Blockchain verification skipped: Contract not deployed yet.");
            return { isValid: true, issuer: "simulated_issuer", timestamp: Date.now() }; // Mock return
        }
        const contract = getContract();
        const [isValid, issuer, timestamp] = await contract.verifyDocument(documentHash);
        return { isValid, issuer, timestamp: Number(timestamp) };
    } catch (error) {
        console.error("Blockchain verification error:", error);
        return { isValid: false, issuer: null, timestamp: null };
    }
};

module.exports = { storeDocumentOnBlockchain, verifyDocumentOnBlockchain };
