//Peyton Seefeldt

const Blockchain = require('./blockchain')
const sha256 =require('sha256')

const bitcoin = new Blockchain();
const previousBlockHash = 5734783;
const currentBlockdata = [
    {
        amount :10,
        sender: 'lee',
        recipient: 'kim'
    },
    {
        amount: 20,
        sender: 'kim',
        recipient: 'lee'
    },
    {
        amount:30,
        sender: 'lee',
        recipient: 'kim'
    }
];
var newtrans = bitcoin.createNewTransaction(100, 'stacy', 'bob');
console.log("new trans"+newtrans)

console.log(bitcoin)

const nonce = 10;
var POWnonce= bitcoin.proofOfWork(previousBlockHash,currentBlockdata);
console.log("Nonce for newHash: "+POWnonce);
var newHashBlock= bitcoin.hashBlock(previousBlockHash,currentBlockdata,POWnonce);
console.log("HashBlock: "+newHashBlock)




