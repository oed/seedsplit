# seedsplit
Seedsplit lets you split a mnemonic seed into a selected number of shards which are also encoded as mnemonics. n-of-m shards can then be combined in order to get the initial mnemonic seed. This is accomplished by using Shamirs Secret Sharing.

## Why?
If you use a hardware wallet like Trezor or Ledger you get a mnemonic seed that can be used to recover your device in case of loss or breakage. After you have written this seed down you obviously need to keep it very safe, but how? Some people put it in a safety deposit box in their bank. However, this gives you have a trust issue again, which is what you where trying to avoid. With seedsplit you can split your seed into multiple mnemonics that you can had out to your friends and family. They can only recreate your seed if some of them come together to do so.

## Installation
```
$ npm i -g seedsplit
```

## Example usage
To split the mnemonic seed:
```
$ seedsplit split -t 2 -s 3
```
You will now be prompted for a seed mnemonic.

To combine mnemonics to get a seed:
```
$ seedsplit combine -t 2
```
You will be prompted for t number of mnemonics.

## Tests
To run tests:
```
$ npm test
```

## Acknowledgments
Thanks to Christian Lundkvist for the idea of using encoded the shards to mnemonics.
