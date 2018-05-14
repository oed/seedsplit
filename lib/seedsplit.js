const bip39 = require('bip39')
const ssss = require("shamirsecretsharing");

const SECRET_LENGTH = 64

const lengthToPrefix = { 64: '', 56: 'd', 48: 'c', 40: 'b', 32: 'a' }
const prefixToLength = { '': 64, 'd': 56, 'c': 48, 'b': 40, 'a': 32 }
const getExtraEntopy = length => bip39.mnemonicToEntropy(
  bip39.generateMnemonic(SECRET_LENGTH * 2)).substring(0, SECRET_LENGTH - length)


async function split(seed, numShards, threshold) {
  if (threshold > numShards) {
    throw new Error('Threshold can\'t be larger than the number of shards')
  }
  if (!bip39.validateMnemonic(seed)) {
    throw new Error('Invalid mnemonic')
  }
  let ent = bip39.mnemonicToEntropy(seed)
  let prefix = lengthToPrefix[ent.length]
  ent = ent + getExtraEntopy(ent.length)

  let shards = await ssss.createKeyshares(Buffer.from(ent, 'hex'), numShards, threshold)

  return shards.map(shard =>
    prefix + shard[0] + ' ' + bip39.entropyToMnemonic(shard.slice(1).toString('hex'))
  )
}

async function combine(shardMnemonics) {
  let prefix = ""
  let shards = shardMnemonics.map(sm => {
    if (!bip39.validateMnemonic(sm.split(' ').slice(1).join(' '))) {
      throw new Error('Invalid mnemonic ' + sm.split(' ')[0])
    }
    let buf = new Buffer.from('00' + bip39.mnemonicToEntropy(sm.split(' ').slice(1).join(' ')), 'hex')

    let number = sm.split(' ')[0]
    if (!/\d/.test(number[0])) {
      prefix = number[0]
      number = number.slice(1)
    }
    buf.writeUInt8(parseInt(number), 0)
    return buf
  })

  let combined = await ssss.combineKeyshares(shards)
  try{
    return bip39.entropyToMnemonic(combined.toString('hex').substring(0, prefixToLength[prefix]))
  } catch (e) {
    throw new Error('Could not combine the given mnemonics')
  }
}

module.exports = { split, combine }
