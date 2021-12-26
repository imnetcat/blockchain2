import { createHash } from 'crypto';

const PoWStep = (seed) => {
    return createHash('sha256').update(seed).digest('hex');
}

const PoWValidityRule = (proof) => {
    if (!proof) return false;
    return proof[proof.length - 2] === '1' && proof[proof.length - 1] === '0';
}

class PoW {
    find(previousProof) {
        let proof = undefined;
        while (!PoWValidityRule(proof)) {
            proof = PoWStep(`${previousProof}${proof}`);
        }
        return proof;
    }
    validate(previousProof, proof) {
        if (!previousProof || !proof) return false;
        return PoWValidityRule(proof);
    }
}

export default PoW;
