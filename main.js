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
sxync_coin.addBlock(new Block(1,"27/05/2018",{amount:4}));
sxync_coin.addBlock(new Block(2,"12/06/2018",{amount:10}));

//to tamper with the blockchain, uncomment the next line
// sxync_coin.chain[1].data={amount:100};
//even the next line won't make the above line work because of the rippling effect
// sxync_coin.chain[1].hash=sxync_coin.chain[1].calculateHash();

console.log(JSON.stringify(sxync_coin,null,4));


if(sxync_coin.isChainValid()){
  console.log("\nBlockchain is valid");
}else if(!sxync_coin.isChainValid()){
  console.log("\nBlockchain is not valid");
}
