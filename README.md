## ⚠️ Use at your own risk. This library isn't actively maintained and has not been audited.

# seedsplit
Seedsplit lets you split a mnemonic seed into a selected number of shards which are also encoded as mnemonics. n-of-m shards can then be combined in order to get the initial mnemonic seed. This is accomplished by using Shamirs Secret Sharing. Seedsplit supports 12 and 24 word seeds.

## Why?
If you use a hardware wallet like Trezor or Ledger you get a mnemonic seed that can be used to recover your device in case of loss or breakage. After you have written this seed down you obviously need to keep it very safe, but how? Some people put it in a safety deposit box in their bank. However, this gives you a trust issue again, which is what you where trying to avoid. With seedsplit you can split your seed into multiple mnemonics that you can hand out to your friends and family. They can only recreate your seed if some of them come together to do so.

## Safe usage
For maximal safety you should only run this program on a computer that is not connected to the internet. Make sure to write down the mnemonic shards by hand, do **not** print them.

## Installation
```
$ npm i -g seedsplit
```

## Example usage
To split the mnemonic seed (`island rich ghost moral city vital ignore plastic slab drift surprise grid idea distance regret gospel page across bird obscure copy either vessel jeans` is used in the example):
```
$ seedsplit split -t 2 -s 3
Enter seed mnemonic:  
1 pony quality biology flush middle flight universe stool like ocean climb casino super buyer smooth owner hidden gravity unable hunt mass media early borrow
2 sorry earn angry best glide purpose chat grant fox wall lawsuit such liquid wrong chimney raven husband boss grass inject they special warm shuffle
3 bus farm lecture segment shiver adjust rookie beyond blade clutch monster output clog taxi expect embrace omit lazy palace lobster fix budget donate rebel
```
Note that when you enter the seed no input will be displayed.

To combine mnemonics to get a seed:
```
$ seedsplit combine -t 2
Enter shard mnemonic:  2 sorry earn angry best glide purpose chat grant fox wall lawsuit such liquid wrong chimney raven husband boss grass inject they special warm shuffle
Enter shard mnemonic:  3 bus farm lecture segment shiver adjust rookie beyond blade clutch monster output clog taxi expect embrace omit lazy palace lobster fix budget donate rebel
island rich ghost moral city vital ignore plastic slab drift surprise grid idea distance regret gospel page across bird obscure copy either vessel jeans
```

## Tests
To run tests:
```
$ npm test
```

## Older versions
Releases 0.1.2 and older used a different Shamirs Secret Sharing library and are incompatible with newer versions. If you need to combine shards created with an old version, please [use version 0.1.2](https://github.com/oed/seedsplit/releases/tag/v0.1.2).

## Wordlists
Seedsplit uses wordlists from [bitcoinjs/bip39](https://github.com/bitcoinjs/bip39/tree/master/wordlists) project.

## Acknowledgments
Thanks to Christian Lundkvist for the idea of encoding the shards to mnemonics.
