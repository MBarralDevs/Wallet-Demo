// Wallet Connection Module
// Connects to Ethereum wallets like MetaMask

class WalletConnector {
  constructor() {
    this.account = null;
    this.isConnected = false;
    this.provider = null;
    this.chainId = null;
  }

  // Check if wallet is installed
  async isWalletInstalled() {
    return typeof window.ethereum !== "undefined";
  }

  // Connect to wallet
  async connect() {
    try {
      if (!(await this.isWalletInstalled())) {
        throw new Error("Please install MetaMask or another Web3 wallet");
      }

      this.provider = window.ethereum;

      // Request account access
      const accounts = await this.provider.request({
        method: "eth_requestAccounts",
      });

      this.account = accounts[0];
      this.isConnected = true;

      // Get chain ID
      const chainId = await this.provider.request({ method: "eth_chainId" });
      this.chainId = chainId;

      console.log("Wallet connected:", this.account);
      console.log("Chain ID:", this.chainId);

      // Listen for account changes
      this.provider.on("accountsChanged", (accounts) => {
        if (accounts.length === 0) {
          this.disconnect();
        } else {
          this.account = accounts[0];
          console.log("Account changed:", this.account);
        }
      });

      // Listen for chain changes
      this.provider.on("chainChanged", (chainId) => {
        this.chainId = chainId;
        console.log("Chain changed:", chainId);
      });

      return { account: this.account, chainId: this.chainId };
    } catch (error) {
      console.error("Connection failed:", error.message);
      this.isConnected = false;
      throw error;
    }
  }

  // Disconnect wallet
  disconnect() {
    this.account = null;
    this.isConnected = false;
    this.chainId = null;
    console.log("Wallet disconnected");
  }

  // Get current account
  getAccount() {
    return this.account;
  }

  // Get connection status
  getStatus() {
    return {
      isConnected: this.isConnected,
      account: this.account,
      chainId: this.chainId,
    };
  }

  // Sign a message
  async signMessage(message) {
    try {
      if (!this.isConnected) {
        throw new Error("Wallet not connected");
      }

      const signature = await this.provider.request({
        method: "personal_sign",
        params: [message, this.account],
      });

      console.log("Message signed:", signature);
      return signature;
    } catch (error) {
      console.error("Sign message failed:", error.message);
      throw error;
    }
  }

  // Send transaction
  async sendTransaction(to, amount) {
    try {
      if (!this.isConnected) {
        throw new Error("Wallet not connected");
      }

      const txHash = await this.provider.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: this.account,
            to: to,
            value: amount,
          },
        ],
      });

      console.log("Transaction sent:", txHash);
      return txHash;
    } catch (error) {
      console.error("Transaction failed:", error.message);
      throw error;
    }
  }

  // Get balance
  async getBalance() {
    try {
      if (!this.isConnected) {
        throw new Error("Wallet not connected");
      }

      const balance = await this.provider.request({
        method: "eth_getBalance",
        params: [this.account, "latest"],
      });

      // Convert from Wei to Ether
      const etherBalance = parseInt(balance, 16) / 1e18;
      console.log("Balance:", etherBalance, "ETH");
      return etherBalance;
    } catch (error) {
      console.error("Get balance failed:", error.message);
      throw error;
    }
  }
}

// Example usage:
/*
const wallet = new WalletConnector();

// Connect to wallet
wallet.connect().then(() => {
  console.log('Connected!');
  wallet.getBalance();
}).catch(error => {
  console.error(error);
});

// Sign a message
wallet.signMessage('Hello Web3!').catch(error => {
  console.error(error);
});

// Send transaction (requires amount in Wei)
wallet.sendTransaction('0xRecipientAddress', '1000000000000000000').catch(error => {
  console.error(error);
});

// Disconnect
wallet.disconnect();
*/
