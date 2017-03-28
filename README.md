# seedsplit
Seedsplit lets you split a mnemonic seed into a selected number of shards which are also encoded as mnemonics. n-of-m shards can then be combined in order to get the initial mnemonic seed. This is accomplished by using Shamirs Secret Sharing.

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
