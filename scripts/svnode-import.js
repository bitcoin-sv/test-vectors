import { jsonToCsv } from './json-to-csv.js';

const SV_NODE_DIR = '../bitcoin-sv/src/test/data';
const OUTPUT_DIR = './data';

// TODO: import the others from sv-node
[
  {
    source: 'script_tests.json',
    headers: ['[[wit..., amount]?', 'scriptSig', 'flags', 'expected_scripterror', 'comments'],
    singleCellComments: true,
    rowProcessor: (row) => {
      if (row.length === 6) {
        // There are a couple of rows that don't fit the regular format
        return [
          row[0],
          `${row[1]},${row[2]}`,
          row[3],
          row[4],
          row[5],
        ];
      }
      return row;
    },
  },
  {
    source: 'base58_encode_decode.json',
    headers: ['hex_input', 'base58_output'],
  },
  {
    source: 'base58_keys_invalid.json',
    headers: ['base58_key_invalid'],
  },
  {
    source: 'base58_keys_valid.json',
    headers: ['base58_address', 'hex_key', 'addrType', 'isCompressed', 'isPrivkey', 'isTestnet'],
    rowProcessor: (row) => {
      if (row.length === 3) {
        const {
          addrType, isCompressed, isPrivkey, isTestnet,
        } = row[2];
        return [
          row[0], // base58_address
          row[1], // hex_key
          addrType,
          isCompressed,
          isPrivkey,
          isTestnet,
        ];
      }
      throw new Error('Invalid row format');
    },
  },
  {
    source: 'sighash.json',
    headers: ['raw_transaction', 'script', 'input_index', 'hashType', 'signature_hash (regular)', 'signature_hash(no forkid)'],
    skipFirstRow: true,
  },
  {
    source: 'tx_invalid.json',
    headers: ['[[[prevout hash, prevout index, prevout scriptPubKey], [input 2], ...]', 'serializedTransaction', 'verifyFlags'],
    singleCellComments: true,
  },
  {
    source: 'tx_valid.json',
    headers: ['[[[prevout hash, prevout index, prevout scriptPubKey], [input 2], ...]', 'serializedTransaction', 'verifyFlags|[verifyFlags1, verifyFlags2, ...]]'],
    singleCellComments: true,
  },
].forEach(({
  source,
  headers,
  singleCellComments = false,
  rowProcessor = false,
  skipFirstRow = false,
}) => {
  jsonToCsv(
    `${SV_NODE_DIR}/${source}`,
    `${OUTPUT_DIR}/${source.replace('.json', '.csv')}`,
    headers,
    singleCellComments,
    rowProcessor,
    skipFirstRow,
  );
});
