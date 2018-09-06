const SHA256=require('crypto-js/sha256');
class Block{
  constructor(index,timestamp,data,previousHash=''){
    this.index=index;
    this.timestamp=timestamp;
    this.data=data;
    this.hash=this.calculateHash();
  }

  calculateHash(){
    return SHA256(this.index+this.previousHash+this.timestamp+JSON.stringify(this.data)).toString();
  }
}

class Blockchain{
  constructor(){
    this.chain=[this.createGenesisBlock()];
  }
  createGenesisBlock(){
    return new Block(0,"25/05/2018","Genesis block","0");
  }

  getLatestBlock(){
      return this.chain[this.chain.length-1];
  }

  addBlock(newBlock){
      newBlock.previousHash=this.getLatestBlock().hash;
      newBlock.hash=newBlock.calculateHash();
      this.chain.push(newBlock);
  }
}

let sxync_coin=new Blockchain();
sxync_coin.addBlock(new Block(1,"27/05/2018",{amount:4}));
sxync_coin.addBlock(new Block(1,"12/06/2018",{amount:10}));

console.log(JSON.stringify(sxync_coin,null,4));
