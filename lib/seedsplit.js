const bip39 = require('bip39')
const ssss = require('secrets.js')

const paddingWord = 'abandon '

function split(seed, numShards, threshold) {
  if (threshold > numShards) {
    throw new Error('Threshold can\'t be larger than the number of shards')
  }
  let ent = bip39.mnemonicToEntropy(seed)
  let shards = ssss.share(ent, numShards, threshold)

  let shardMnemonics = shards.map(shard => {
    let padding = '0'.repeat(8 - shard.length%8)
    return bip39.entropyToMnemonic(padding + shard)
  })
  // due to padding first word is always the same
  return shardMnemonics.map(sm => sm.split(' ').slice(1).join(' '))
}

function combine(shardMnemonics) {
  let shards = shardMnemonics.map(sm =>
    // due to padding first word is always the same
      bip39.mnemonicToEntropy(paddingWord + sm).replace(/^(0+)/g, ''))
    let comb = ssss.combine(shards)
    try {
      return bip39.entropyToMnemonic(comb)
    } catch (e) {
      throw new Error('Could not combine the given mnemonics')
    }
}

module.exports = { split, combine }
