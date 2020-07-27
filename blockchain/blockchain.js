//Peyton


const sha256 = require('sha256')

//Any way to add additonal security?
function Blockchain(){
    this.chain=[]
    this.pendingTransaction=[]
    this.createNewBlock('100',0,0) // Genisis Block
}

//Ideas: Potentially add a way to asign a unique Identifyer to each block from a specific person
//This would allow a search function to show all the transactions made
Blockchain.prototype.createNewBlock = function(nonce,previousBlockHash,hash){
    const newBlock = { // new block
    index: this.chain.length + 1,
    timestamp: Date.now(),
    transactions: this.pendingTransaction,
    nonce:nonce, hash:hash,
    previousBlockHash:previousBlockHash  
    };

    this.chain.push(newBlock); //bind to blockchain 
    this. pendingTransaction = []; //empty for next transaction
    return newBlock; 

}
Blockchain.prototype.getLastBlock = function () {
    return this.chain[this.chain.length - 1];
}

//Returns the SSnum of a given block based on the index
Blockchain.prototype.getTransactionSSnum = function(index){
    return this.chain[index].transactions[0].SSnum;
}

//Returns the transaction data of a block based on the index
Blockchain.prototype.getTransactionData = function(index){
    return this.chain[index].transactions;
}

//Creates a pending transaction with all the info from first fourm on the page
Blockchain.prototype.createNewTransaction = function (SSnum, make, model, year, odometer, Sname, Rname, message) { // transaction prototype
    const newTransaction = {
        SSnum: SSnum, 
        make: make,
        model: model,
        year: year, 
        odometer: odometer,
        Sname: Sname,
        Rname: Rname,
        message: message
    }
    this.pendingTransaction.push(newTransaction);
    
    return this.getLastBlock()['index'] + 1
}

//Makes hash from last hash and data
Blockchain.prototype.hashBlock = function (previousBlockHash, currentBlockData, nonce) {
    const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
    const hash = sha256(dataAsString);
    return hash
}

//Ideas: Any way to make more security
//Makes nonce from hash and data
Blockchain.prototype.proofOfWork = function (previousBlockHash, currentBlockData) {
    let nonce = 0;
    let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    while (hash.substring(0, 4) != '0000'){ // Difficulty “0000”
        nonce++; //increase  nonce to find a hash start with “0000…..”
        hash = this.hashBlock(previousBlockHash, currentBlockData, nonce)
    }
    return nonce;
}


module.exports = Blockchain;
    