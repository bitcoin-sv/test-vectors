import { jsonToCsv } from './json-to-csv.js';

const SV_NODE_DIR = '../bitcoin-sv/src/test/data';
const OUTPUT_DIR = './data';

// TODO: import the others from sv-node
[
  {
    source: 'script_tests.json',
    headers: ['[[wit..., amount]?', 'scriptSig', 'flags', 'expected_scripterror', 'comments'],
    singleCellComments: true,
  },
  {
    source: 'base58_encode_decode.json',
    headers: ['hex_input', 'base58_output'],
    singleCellComments: false,
  },
  {
    source: 'base58_keys_invalid.json',
    headers: ['base58_key_invalid'],
    singleCellComments: false,
  },
  {
    source: 'base58_keys_valid.json',
    headers: ['base58_address', 'hex_key', 'addrType', 'isCompressed', 'isPrivkey', 'isTestnet'],
    singleCellComments: false,
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
].forEach(({
  source, headers, singleCellComments = false, rowProcessor = false,
}) => {
  jsonToCsv(
    `${SV_NODE_DIR}/${source}`,
    `${OUTPUT_DIR}/${source.replace('.json', '.csv')}`,
    headers,
    singleCellComments,
    rowProcessor,
  );
});
