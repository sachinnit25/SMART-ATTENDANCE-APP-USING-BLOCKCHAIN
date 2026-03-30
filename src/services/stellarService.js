import * as StellarSdk from '@stellar/stellar-sdk';

const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');

export const initializeAppWallet = async () => {
  try {
    const storedSecret = localStorage.getItem('stellar_secret');
    if (storedSecret) {
      const keypair = StellarSdk.Keypair.fromSecret(storedSecret);
      return keypair;
    }

    // Generate new keypair since we don't have one
    const pair = StellarSdk.Keypair.random();
    
    // Fund it with Friendbot on Testnet
    const response = await fetch(`https://friendbot.stellar.org?addr=${encodeURIComponent(pair.publicKey())}`);
    const responseJSON = await response.json();
    
    if (responseJSON.successful || responseJSON.hash) {
      localStorage.setItem('stellar_secret', pair.secret());
      return pair;
    } else {
      throw new Error("Friendbot failed to fund the account.");
    }
  } catch (err) {
    console.error("Stellar Initialization Error:", err);
    throw err;
  }
};

export const logAttendanceOnChain = async (keypair, studentName) => {
  try {
    // Load the current sequence number for the account
    const account = await server.loadAccount(keypair.publicKey());
    
    // Create a zero-value transaction to self, storing data in Memo
    let memoText = `ATTEND:${studentName}`;
    if (memoText.length > 28) {
      memoText = memoText.substring(0, 28); // Memo text is limited to 28 bytes max in Stellar
    }

    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE || "100",
      networkPassphrase: StellarSdk.Networks.TESTNET
    })
    .addOperation(StellarSdk.Operation.payment({
      destination: keypair.publicKey(),
      asset: StellarSdk.Asset.native(),
      amount: "0.0000001" // Minimal nominal payment to successfully validate transaction
    }))
    .addMemo(StellarSdk.Memo.text(memoText))
    .setTimeout(30)
    .build();

    transaction.sign(keypair);

    const txResult = await server.submitTransaction(transaction);
    return txResult.hash;

  } catch (err) {
    console.error("Logging to Blockchain failed:", err);
    throw err;
  }
};
