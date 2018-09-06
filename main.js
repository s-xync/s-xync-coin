const SHA256=require('crypto-js/sha256');
class Transaction{
  constructor(fromAddress,toAddress,amount){
    this.fromAddress=fromAddress;
    this.toAddress=toAddress;
    this.amount=amount;
  }
}

class Block{
  constructor(timestamp,transactions,previousHash=''){
    this.timestamp=timestamp;
    this.transactions=transactions;
    this.hash=this.calculateHash();
    this.nonce=0;
  }

  calculateHash(){
    return SHA256(this.previousHash+this.timestamp+JSON.stringify(this.transactions)+this.nonce).toString();
  }

  mineBlock(difficulty){
    //caclculates hash until the difficulty number of starting elements of hash are set to 0
    //nonce helps in changing hash during iterations
    while(this.hash.substring(0,difficulty)!==Array(difficulty+1).join("0")){
      this.nonce++;//without this, the while loop is forever
      this.hash=this.calculateHash();
    }
    console.log("Block Mined: "+this.hash);
  }
}

class Blockchain{
  constructor(){
    this.chain=[this.createGenesisBlock()];
    this.difficulty=2;
    this.pendingTransactions=[];
    this.miningReward=100;
  }
  createGenesisBlock(){
    return new Block("25/05/2018","Genesis block","0");
  }

  getLatestBlock(){
      return this.chain[this.chain.length-1];
  }

  minePendingTransactions(miningRewardAddress){
    let block=new Block(Date.now(),this.pendingTransactions);
    block.mineBlock(this.difficulty);

    console.log("Block successfully mined!");
    this.chain.push(block);

    this.pendingTransactions=[
      new Transaction(null,miningRewardAddress,this.miningReward)
    ];
  }

  createTransaction(transaction){
    this.pendingTransactions.push(transaction);
  }

  getBalanceOfAddress(address){
    let balance=0;

    for(const block of this.chain){
      for(const trans of block.transactions){
        if(trans.fromAddress===address){
          balance-=trans.amount;
        }

        if(trans.toAddress===address){
          balance+=trans.amount;
        }
      }
    }
    return balance;
  }

  isChainValid(){
    for(let i=1;i<this.chain.length;i++){
      const currentBlock=this.chain[i];
      const previousBlock=this.chain[i-1];
      if(currentBlock.hash!==currentBlock.calculateHash()){
        return false;
      }

      if(currentBlock.previousHash!==previousBlock.hash){
        return false;
      }
    }
    return true;
  }
}

let sxync_coin=new Blockchain();
sxync_coin.createTransaction(new Transaction('address1','address2',100));
sxync_coin.createTransaction(new Transaction('address2','address1',50));

console.log('\nStarting the miner ...');
sxync_coin.minePendingTransactions('miner-address');

console.log('\nStarting the miner ...');
sxync_coin.minePendingTransactions('miner-address');

console.log('\nBalance of miner is',sxync_coin.getBalanceOfAddress('miner-address'));
