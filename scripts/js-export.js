import { csvToJs } from './csv-to-js.js';

csvToJs('./data/script_tests.csv', './npm/script_vectors.js');
csvToJs('./data/base58_encode_decode.csv', './npm/base58_encode_decode.js');
csvToJs('./data/base58_keys_invalid.csv', './npm/base58_keys_invalid.js');
csvToJs('./data/base58_keys_valid.csv', './npm/base58_keys_valid.js');
