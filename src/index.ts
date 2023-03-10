/**
 * Type that represents a single bit
 * Array of 0 / 1s have been chosen in order to be more explicit instead of using ArrayBuffer or Buffer
 */
type Bit = 0 | 1;

/**
 * If true, output will be very verbose
 */
const verbose = true;

/**
 * Initial Permutation mapping
 */
const IP = [
	58, 50, 42, 34, 26, 18, 10,  2,
	60, 52, 44, 36, 28, 20, 12,  4,
	62, 54, 46, 38, 30, 22, 14,  6,
	64, 56, 48, 40, 32, 24, 16,  8,
	57, 49, 41, 33, 25, 17,  9,  1,
	59, 51, 43, 35, 27, 19, 11,  3,
	61, 53, 45, 37, 29, 21, 13,  5,
	63, 55, 47, 39, 31, 23, 15,  7
];

/**
 * Inverse of the Initial Permutation mapping
 */
const InverseIP = [
	40,  8, 48, 16, 56, 24, 64, 32,
	39,  7, 47, 15, 55, 23, 63, 31,
	38,  6, 46, 14, 54, 22, 62, 30,
	37,  5, 45, 13, 53, 21, 61, 29,
	36,  4, 44, 12, 52, 20, 60, 28,
	35,  3, 43, 11, 51, 19, 59, 27,
	34,  2, 42, 10, 50, 18, 58, 26,
	33,  1, 41,  9, 49, 17, 57, 25
];

/**
 * Expansion/Permutation function mapping
 */
const ExpansionPermutation = [
	32,  1,  2,  3,  4,  5,
	 4,  5,  6,  7,  8,  9,
	 8,  9, 10, 11, 12, 13,
	12, 13, 14, 15, 16, 17,
	16, 17, 18, 19, 20, 21,
	20, 21, 22, 23, 24, 25,
	24, 25, 26, 27, 28, 29,
	28, 29, 30, 31, 32,  1
];

/**
 * Permutation that gets applied to the output of the S-box
 */
const SBoxPermutation = [
	16,  7, 20, 21, 29, 12, 28, 17,
	 1, 15, 23, 26,  5, 18, 31, 10,
	 2,  8, 24, 14, 32, 27,  3,  9,
	19, 13, 30,  6, 22, 11,  4, 25
];

/**
 * S-boxes for each row of E/P output
 * Each element in SBox array represents a single S-box
 */
const SBox = [
	[
		14,  4, 13,  1,  2, 15, 11,  8,  3, 10,  6, 12,  5,  9,  0,  7,
		 0, 15,  7,  4, 14,  2, 13,  1, 10,  6, 12, 11,  9,  5,  3,  8,
		 4,  1, 14,  8, 13,  6,  2, 11, 15, 12,  9,  7,  3, 10,  5,  0,
		15, 12,  8,  2,  4,  9,  1,  7,  5, 11,  3, 14, 10,  0,  6, 13
	],
	[
		15,  1,  8, 14,  6, 11,  3,  4,  9,  7,  2, 13, 12,  0,  5, 10,
		 3, 13,  4,  7, 15,  2,  8, 14, 12,  0,  1, 10,  6,  9, 11,  5,
		 0, 14,  7, 11, 10,  4, 13,  1,  5,  8, 12,  6,  9,  3,  2, 15,
		13,  8, 10,  1,  3, 15,  4,  2, 11,  6,  7, 12,  0,  5, 14,  9
	],
	[
		10,  0,  9, 14,  6,  3, 15,  5,  1, 13, 12,  7, 11,  4,  2,  8,
		13,  7,  0,  9,  3,  4,  6, 10,  2,  8,  5, 14, 12, 11, 15,  1,
		13,  6,  4,  9,  8, 15,  3,  0, 11,  1,  2, 12,  5, 10, 14,  7,
		 1, 10, 13,  0,  6,  9,  8,  7,  4, 15, 14,  3, 11,  5,  2, 12
	],
	[
		 7, 13, 14,  3,  0,  6,  9, 10,  1,  2,  8,  5, 11, 12,  4, 15,
		13,  8, 11,  5,  6, 15,  0,  3,  4,  7,  2, 12,  1, 10, 14,  9,
		10,  6,  9,  0, 12, 11,  7, 13, 15,  1,  3, 14,  5,  2,  8,  4,
		 3, 15,  0,  6, 10,  1, 13,  8,  9,  4,  5, 11, 12,  7,  2, 14
	],
	[
		 2, 12,  4,  1,  7, 10, 11,  6,  8,  5,  3, 15, 13,  0, 14,  9,
		14, 11,  2, 12,  4,  7, 13,  1,  5,  0, 15, 10,  3,  9,  8,  6,
		 4,  2,  1, 11, 10, 13,  7,  8, 15,  9, 12,  5,  6,  3,  0, 14,
		11,  8, 12,  7,  1, 14,  2, 13,  6, 15,  0,  9, 10,  4,  5,  3
	],
	[
		12,  1, 10, 15,  9,  2,  6,  8,  0, 13,  3,  4, 14,  7,  5, 11,
		10, 15,  4,  2,  7, 12,  9,  5,  6,  1, 13, 14,  0, 11,  3,  8,
		 9, 14, 15,  5,  2,  8, 12,  3,  7,  0,  4, 10,  1, 13, 11,  6,
		 4,  3,  2, 12,  9,  5, 15, 10, 11, 14,  1,  7,  6,  0,  8, 13
	],
	[
		 4, 11,  2, 14, 15,  0,  8, 13,  3, 12,  9,  7,  5, 10,  6,  1,
		13,  0, 11,  7,  4,  9,  1, 10, 14,  3,  5, 12,  2, 15,  8,  6,
		 1,  4, 11, 13, 12,  3,  7, 14, 10, 15,  6,  8,  0,  5,  9,  2,
		 6, 11, 13,  8,  1,  4, 10,  7,  9,  5,  0, 15, 14,  2,  3, 12
	],
	[
		13,  2,  8,  4,  6, 15, 11,  1, 10,  9,  3, 14,  5,  0, 12,  7,
		 1, 15, 13,  8, 10,  3,  7,  4, 12,  5,  6, 11,  0, 14,  9,  2,
		 7, 11,  4,  1,  9, 12, 14,  2,  0,  6, 10, 13, 15,  3,  5,  8,
		 2,  1, 14,  7,  4, 10,  8, 13, 15, 12,  9,  0,  3,  5,  6, 11
	]
];

/**
 * Permuted choice 1
 */
const PC1 = [
	57, 49, 41, 33, 25, 17,  9,
	 1, 58, 50, 42, 34, 26, 18,
	10,  2, 59, 51, 43, 35, 27,
	19, 11,  3, 60, 52, 44, 36,
	63, 55, 47, 39, 31, 23, 15,
	 7, 62, 54, 46, 38, 30, 22,
	14,  6, 61, 53, 45, 37, 29,
	21, 13,  5, 28, 20, 12,  4
]

/**
 * Permuted choice 2
 */
const PC2 = [
	14, 17, 11, 24,  1,  5,  3, 28,
	15,  6, 21, 10, 23, 19, 12,  4,
	26,  8, 16,  7, 27, 20, 13,  2,
	41, 52, 31, 37, 47, 55, 30, 40,
	51, 45, 33, 48, 44, 49, 39, 56,
	34, 53, 46, 42, 50, 36, 29, 32
];

/**
 * Permutation after S-box to get the final function F result
 */
const P = [
	16,  7, 20, 21, 29, 12, 28, 17,
	 1, 15, 23, 26,  5, 18, 31, 10,
	 2,  8, 24, 14, 32, 27,  3,  9,
	19, 13, 30,  6, 22, 11,  4, 25
];

/**
 * Number of bits to left-shift to generate a subkey
 */
const Rotations = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];

/**
 * Applies a certain mapping to a bit array
 * @param bits The bit array before mapping
 * @param mapping The mapping to apply on the bits
 * @returns The bits after moving (or copying, in case of E/P and similar) them around
 */
function applyMapping(bits: Bit[], mapping: number[]){
	const ret: Bit[] = [];
	for(let i = 0; i < mapping.length; i++) ret.push(bits[mapping[i] - 1]);
	return ret;
}

/**
 * Applies initial permutation
 * @param bits A 64-bit plaintext/ciphertext block
 * @returns The output of initial permutation
 */
function initialPermutation(bits: Bit[]){
	return applyMapping(bits, IP);
}

/**
 * Applies the inverse of the initial permutation
 * @param bits A 64-bit preoutput
 * @returns The output of the inverse of initial permutation
 */
 function inverseInitialPermutation(bits: Bit[]){
	return applyMapping(bits, InverseIP);
}

/**
 * Applies expansion/permutation, the function used in the first part of the function F
 * @param bits 32-bit right half of the input to this round
 * @returns The 48-bit expanded output
 */
function expansionPermutation(bits: Bit[]){
	return applyMapping(bits, ExpansionPermutation);
}

/**
 * Applies permuted choice 1 on the original key before shifting
 * @param bits The 64-bit key
 * @returns 56-bit permuted key
 */
function permutedChoice1(bits: Bit[]){
	return applyMapping(bits, PC1);
}

/**
 * Applies permuted choice 2 on the shifted key to get the subkey
 * @param bits The 56-bit key after shifting
 * @returns The 48-bit key
 */
function permutedChoice2(bits: Bit[]){
	return applyMapping(bits, PC2);
}

/**
 * Applies the permutation on the output of the S-box to get the result of the function F
 * @param bits The 32-bit S-box output
 * @returns The 32-bit output of the function F
 */
function permutation(bits: Bit[]){
	return applyMapping(bits, P);
}

/**
 * Calculate XOR of the two bit array. Must be of same length to work.
 * @param a First bit array
 * @param b Second bit array
 * @returns XOR of a and b
 */
function xor(a: Bit[], b: Bit[]){
	const ret: Bit[] = [];
	if (a.length !== b.length) throw new Error('Cannot XOR two bit arrays with different length');
	for(let i = 0; i < a.length; i++) {
		// Can't use ^ to pass type checking
		if((a[i] === 0 && b[i] === 1) || (a[i] === 1 && b[i] === 0)) ret.push(1);
		else ret.push(0);
	}
	return ret;
}

/**
 * Execute left shift by a given amount of positions.
 * @param original The bit array before shifting
 * @param by Number of positions to shift
 * @returns Shifted array
 */
function shiftBits(original: Bit[], by: number){
	const ret: Bit[] = [];
	for(let i = 0; i < original.length; i++) {
		ret.push(original[(i + by) % original.length]);
	}
	return ret;
}

/**
 * Generates subkey based on the original master key.
 * @param original The master key to encrypt/decrypt this message with
 * @param keyNumber The round number this key will be used for. Note that for the first encryption round, the keyNumber will be 0, as per 'Index starts with 0'.
 * @returns The subkey for this round
 */
function genKey(original: Bit[], keyNumber: number){
	const leftHalf = original.slice(0, 28);
	const rightHalf = original.slice(28);
	// Calculates how many shifts are needed by getting part of the Rotations array, and calculating the sum of all elements in it
	const shiftAmount = Rotations.slice(0, keyNumber + 1).reduce((prev, current) => prev + current, 0);
	const leftShifted = shiftBits(leftHalf, shiftAmount);
	const rightShifted = shiftBits(rightHalf, shiftAmount);
	return permutedChoice2([...leftShifted, ...rightShifted]);
}

/**
 * Converts a single number to binary array
 * @param n Decimal integer
 * @returns Corresponding binary array
 */
function intToBin(n: number){
	const ret: Bit[] = [];
	while(n){
		ret.push(n % 2 as Bit);
		n = Math.floor(n / 2);
	}
	ret.reverse();
	return ret;
}

/**
 * Calculates the 32-bit output of the Substitution/choice function based on 48-bit input
 * @param input 48-bit input that needs to be substituted using S-box
 * @returns 32-bit output after substitution/choice
 */
function applySBox(input: Bit[]){
	const res: Bit[] = [];
	for(let i = 0; i < 8; i++){
		const tableRow = i * 6;
		// Calculates which row to read by getting the first and last bit in the ith row
		const row = input[tableRow] * 2 + input[tableRow + 5];
		const column = input[tableRow + 1] * 8 + input[tableRow + 2] * 4 + input[tableRow + 3] * 2 + input[tableRow + 4];
		const substituted = SBox[i][row * 16 + column];
		const bin = intToBin(substituted);
		while(bin.length < 4) bin.unshift(0);
		res.push(...bin);
	}
	return res;
}

/**
 * Calculates the output of the function F in Feistel cipher model
 * @param right Right half of the previous round output
 * @param subkey Subkey to be used in this round
 * @returns The 32-bit output of the function F
 */
function functionF(right: Bit[], subkey: Bit[]){
	const expanded = expansionPermutation(right);
	const xored = xor(expanded, subkey);
	const substituted = applySBox(xored);
	return permutation(substituted);
}

/**
 * Calculates the state after applying a single round of encryption/decryption
 * @param input The 64-bit input to this round
 * @param subKey The 48-bit subkey that will be used for this round
 * @returns The 64-bit result after applying a single round to the input
 */
function singleRound(input: Bit[], subKey: Bit[]){
	// Left half after a single round is the same as the right half of the input
	const right = input.slice(32);
	const functionFOutput = functionF(right, subKey);
	const xored = xor(input.slice(0, 32), functionFOutput);
	return [...right, ...xored] as Bit[];
}

/**
 * Swap two halves around
 * @param input 64-bit binary array
 * @returns 64-bit binary array with the first half and the second half swapped around
 */
function swap(input: Bit[]){
	return [...input.slice(32), ...input.slice(0, 32)];
}

/**
 * Encrypt/decrypt the input using the key
 * @param input 64-bit plaintext/ciphertext
 * @param key 64-bit key to encrypt/decrypt the input with
 * @param isDecryption If true, this will decrypt the input instead of encrypting it
 * @returns The 64-bit plaintext/ciphertext, depending on whether isDecryption was true or not
 */
function DESAlgorithm(input: Bit[], key: Bit[], isDecryption: boolean){
	let current = initialPermutation(input);
	key = permutedChoice1(key);
	if(verbose){
		const output = binToHex(current);
		console.log(`After initial permutation: ${output.slice(0, 8)} ${output.slice(8)}`);
	}
	// Determines in which order the subkey should be generated in
	const keyOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
	// Note that difference between encryption and decryption is that key usage is reversed
	if(isDecryption) keyOrder.reverse();
	// This variable exists purely for verbose output
	let count = 1;
	for(const round of keyOrder){
		const subKey = genKey(key, round);
		current = singleRound(current, subKey);
		if(verbose) {
			console.log(`\nRound ${count}`);
			console.log(`Subkey used for this round: ${binToHex(subKey)}`);
			const output = binToHex(current);
			console.log(`Output of round ${count}: ${output.slice(0, 8)} ${output.slice(8)}`);
		}
		count++;
	}
	// The output of round 16 needs to be swapped around to be preoutput
	current = swap(current);
	if(verbose) console.log(`\nPreoutput: ${binToHex(current)}`);
	// Inverse of IP is applied just before getting the final output
	return inverseInitialPermutation(current);
}

/**
 * Converts hexadecimal string into binary
 * @param hex Hexadecimal string, may be in uppercase or lowercase
 * @returns Binary array of the hexadecimal string
 */
function hexToBin(hex: string){
	const res: Bit[] = [];
	for(const c of hex){
		let ascii = c.charCodeAt(0);
		if (ascii < 58) {
			const bin = intToBin(ascii - 48);
			while(bin.length < 4) bin.unshift(0);
			res.push(...bin);
		}
		else {
			if (ascii > 96) ascii -= 32;
			res.push(...intToBin(ascii - 55));
		}
	}
	return res;
}

/**
 * Converts binary array to hexadecimal
 * @param bit Binary array
 * @returns Hexadecimal corresponding to the input in lowercase
 */
function binToHex(bit: Bit[]){
	const output: string[] = [];
	for(let i = 0; i < bit.length; i += 4){
		const val = bit[i] * 8 + bit[i + 1] * 4 + bit[i + 2] * 2 + bit[i + 3];
		output.push(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'][val]);
	}
	return output.join('');
}

/**
 * Encrypt a 64-bit hexadecimal input with 64-bit key
 * @param input 64-bit plaintext
 * @param key 64-bit key
 * @returns 64-bit ciphertext
 */
function encrypt(input: string, key: string){
	return binToHex(DESAlgorithm(hexToBin(input), hexToBin(key), false));
}

/**
 * Decrypt a 64-bit hexadecimal input with 64-bit key
 * @param input 64-bit ciphertext
 * @param key 64-bit key
 * @returns 64-bit plaintext
 */
function decrypt(input: string, key: string){
	return binToHex(DESAlgorithm(hexToBin(input), hexToBin(key), true));
}

// This example has been taken from Cryptography and Network Security 6th GLOBAL edition, page 94.
// Output should be 'da02ce3a89ecac3b'.
console.log(encrypt('02468aceeca86420', '0f1571c947d9e859'));

// Output shoulf be '02468aceeca86420', the original text
console.log(decrypt('da02ce3a89ecac3b', '0f1571c947d9e859'));

// This example has been taken from https://page.math.tu-berlin.de/~kant/teaching/hess/krypto-ws2006/des.htm
// Output should be '85e813540f0ab405'.
console.log(encrypt('0123456789ABCDEF', '133457799BBCDFF1'));

// Output should be '0123456789abcdef'.
console.log(decrypt('85E813540F0AB405', '133457799BBCDFF1'));