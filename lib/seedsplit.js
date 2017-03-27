const bip39 = require('bip39')
const ssss = require('secrets.js')

const wordPadding = 'abandon divorce '

function split(seed, numShards, threashold) {
    if (threashold > numShards) {
        throw Error('Threshold can\'t be larger than the number of shards')
    }
    let ent = bip39.mnemonicToEntropy(seed)
    let shards = ssss.share(ent, numShards, threashold)

    let shardMnemonics = shards.map(shard => {
        let padding = '0'.repeat(8 - shard.length%8)
        return bip39.entropyToMnemonic(padding + shard)
    })
    // due to padding first two words is always the same
    return shardMnemonics.map(sm => sm.split(' ').slice(2).join(' '))
}

function combine(shardMnemonics) {
    let shards = shardMnemonics.map(sm =>
        bip39.mnemonicToEntropy(wordPadding + sm).replace(/^(0+)/g, ''))
    let comb = ssss.combine(shards)
    return bip39.entropyToMnemonic(comb)
}

module.exports = { split, combine }
