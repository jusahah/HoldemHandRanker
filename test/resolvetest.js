// Testing dev deps
var chai = require('chai');
var expect = chai.expect;
// Domain deps
var handRanker = require('../ranker');

var CARDS = [
	['Ah', '2h', '3h', '4h', '5h', '6h', '7h', '8h', '9h', 'Th', 'Jh', 'Qh', 'Kh'],
	['As', '2s', '3s', '4s', '5s', '6s', '7s', '8s', '9s', 'Ts', 'Js', 'Qs', 'Ks'],
	['Ac', '2c', '3c', '4c', '5c', '6c', '7c', '8c', '9c', 'Tc', 'Jc', 'Qc', 'Kc'],
	['Ad', '2d', '3d', '4d', '5d', '6d', '7d', '8d', '9d', 'Td', 'Jd', 'Qd', 'Kd']
];

describe("INTERNAL: Get combos", function() {

	it("Should get all combos", function() {
		var combos = handRanker.getCombos(['Ah', '2h', '3h', '4h', '5h'], ['6h', '7h']);
		console.log(combos);
	})
})

describe("Hand resolve", function() {
	it("Should resolve to full house", function() {
		var handValue = handRanker.valueOfHand(['Ah', '2h', '3h', '4h', '6d'], ['Ks', 'Qh']);
		expect(handValue).to.deep.equal({
			handType: 'highCard',
			kickers: [14, 13, 12, 6, 4]
		});
	})
});