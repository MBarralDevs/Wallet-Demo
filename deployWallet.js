import WalletConnector from "./walletConnector.js";

const wallet = new WalletConnector();

// Connect to wallet
wallet
  .connect()
  .then(() => {
    console.log("Connected!");
    wallet.getBalance();
  })
  .catch((error) => {
    console.error(error);
  });

// Sign a message
wallet.signMessage("Hello Web3!").catch((error) => {
  console.error(error);
});

// Send transaction (requires amount in Wei)
wallet
  .sendTransaction("0xRecipientAddress", "1000000000000000000")
  .catch((error) => {
    console.error(error);
  });

// Disconnect
wallet.disconnect();
