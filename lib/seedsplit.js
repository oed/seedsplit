const bip39 = require('bip39')
const ssss = require("shamirsecretsharing");

function split(seed, numShards, threshold) {
  if (threshold > numShards) {
    throw new Error('Threshold can\'t be larger than the number of shards')
  }
  if (!bip39.validateMnemonic(seed)) {
    throw new Error('Invalid mnemonic')
  }

  let ent = bip39.mnemonicToEntropy(seed)
  let prefix = ""
  switch(ent.length) {
    case 32:
      ent = ent + bip39.mnemonicToEntropy(bip39.generateMnemonic(128))
      prefix = "x"
      break;
    case 40:
      ent = ent + bip39.mnemonicToEntropy(bip39.generateMnemonic(128)).substring(0,24)
      prefix = "s"
      break;
    case 48:
      ent = ent + bip39.mnemonicToEntropy(bip39.generateMnemonic(128)).substring(0,16)
      prefix = "t"
      break;
    case 56:
      ent = ent + bip39.mnemonicToEntropy(bip39.generateMnemonic(128)).substring(0,8)
      prefix = "m"
      break;
  }

  let shards = ssss.createKeyshares(Buffer.from(ent, 'hex'), numShards, threshold)

  return shards.then((x) => x.map(shard =>
    prefix + shard[0] + ' ' + bip39.entropyToMnemonic(shard.slice(1).toString('hex'))
  ))
}

function combine(shardMnemonics) {
  let prefix = ""
  let shards = shardMnemonics.map(sm => {
      if (!bip39.validateMnemonic(sm.split(' ').slice(1).join(' '))) {
        throw new Error('Invalid mnemonic')
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

  let comb = ssss.combineKeyshares(shards)

  try{
    return comb.then((x) => {
      switch(prefix) {
        case "x":
          return bip39.entropyToMnemonic(x.toString('hex').substring(0, 32))
          break;
        case "s":
          return bip39.entropyToMnemonic(x.toString('hex').substring(0, 40))
          break;
        case "t":
          return bip39.entropyToMnemonic(x.toString('hex').substring(0, 48))
          break;
        case "m":
          return bip39.entropyToMnemonic(x.toString('hex').substring(0, 56))
          break;
        default:
          return bip39.entropyToMnemonic(x.toString('hex'))
      }
    })
  } catch (e) {
    throw new Error('Could not combine the given mnemonics')
  }
}

module.exports = { split, combine }
