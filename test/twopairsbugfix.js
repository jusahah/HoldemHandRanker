var _ = require('lodash');
// Testing dev deps
var chai = require('chai');
var expect = chai.expect;
// Domain deps
var handRanker = require('../index');

// As a reminder, not used in code
var CARDS = [
	['Ah', '2h', '3h', '4h', '5h', '6h', '7h', '8h', '9h', 'Th', 'Jh', 'Qh', 'Kh'],
	['As', '2s', '3s', '4s', '5s', '6s', '7s', '8s', '9s', 'Ts', 'Js', 'Qs', 'Ks'],
	['Ac', '2c', '3c', '4c', '5c', '6c', '7c', '8c', '9c', 'Tc', 'Jc', 'Qc', 'Kc'],
	['Ad', '2d', '3d', '4d', '5d', '6d', '7d', '8d', '9d', 'Td', 'Jd', 'Qd', 'Kd']
];
/*
describe("INTERNAL: Get combos", function() {

	it("Should get all combos", function() {
		var combos = handRanker.getCombos(['Ah', '2h', '3h', '4h', '5h'], ['6h', '7h']);
		//console.log(combos);
	})
})
*/

describe("Bug fix (_bugfix) - two pairs: small pairs + high kicker wins over high pairs + small kicker", function() {
	it("HIGH two pairs + SMALL kicker should win SMALL two pairs + HIGH kicker", function() {
		var winningHands = handRanker.getWinners(
			['2h', '5c', '5h', '6h', '6s'], // BOARD
			[
				{id: 1, cards: ['3s', 'Ad']}, // P1
				{id: 2, cards: ['Qs', 'Qd']}  // P2
			]
		);
		//console.log(JSON.stringify(winningHands));
		// Potential bug before 9.2.18!!
		// P1 has two pairs with A kicker
		// P2 has two pairs with low kicker, but two pairs are larger!
		// Gives win to P1??? Yes. Before 9.2. 
		// 
		
		// FIXED 9.2.18 by ensuring string casted int before adding it!

		// One winner
		expect(winningHands.length).to.equal(1);
		// P2 wins
		expect(winningHands[0].id).to.equal(2);
	})	
})
