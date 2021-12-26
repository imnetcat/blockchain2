import { createHash } from 'crypto';

const PoWValidityRule = (proof) => {
    if (!proof) return false;
    return proof[proof.length - 2] === '1' && proof[proof.length - 1] === '0';
}

class Blockchain {
    constructor() {
        this.chain = [];
        this.transactions = [];
        // Generate genesis block - the first block of the chain
        this.newBlock('05102001', 'Guskov');
    }

    // Add new block to the chain
    newBlock(proof, parentHash) {
        const parentBlock = this.getLastBlock();
        const parentIndex = parentBlock?.index;
        const block = {
            index: parentBlock ? parentIndex + 1 : 0,
            timestamp: new Date().getTime(),
            transactions: this.transactions,
            proof,
            parentHash: parentHash || this.hash(parentBlock),
        };
        // Add blcok to the chain
        this.chain.push(block);
        // clear transiction queue
        this.transactions = [];
        return block;
    }

    // Add new transaction to the queue
    newTransaction(sender, recipient, amount) {
        // Add transaction to the queue
        this.transactions.push({
            sender,
            recipient,
            amount
        });

        // Return next chain block index
        return this.chain.length;
    }

    // Generate hash from provided block
    hash(block) {
        return createHash('sha256').update(JSON.stringify(block)).digest('hex');
    }

    getLastBlock() {
        if (this.chain.length === 0) return undefined;
        return this.chain[this.chain.length - 1];
    }

    proofOfWork() {
        let proof = undefined;
        const previousProof = this.getLastBlock().proof;
        while (!PoWValidityRule(proof)) {
            proof = createHash('sha256').update(`${previousProof}${proof}`).digest('hex')
        }
        return proof;
    }

    validateProofOfWork(previousProof, proof) {
        if (!previousProof || !proof) return false;
        return PoWValidityRule(proof);
    }

    mine(nodeAddress) {
        // Calculate PoW
        const proof = this.proofOfWork();
        // Add miner reward to the mining node
        this.newTransaction('0', nodeAddress, 5);
        // Add new block to the chain
        return this.newBlock(proof);
    }
}

export default Blockchain;
