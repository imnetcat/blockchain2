import Blockchain from "./blockchain.js";

const blockchain = new Blockchain();

console.log(blockchain.chain, '\n');

console.time("pow");
blockchain.pow();
console.timeEnd("pow");

console.log('\n', blockchain.chain);

