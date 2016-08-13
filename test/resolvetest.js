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

describe("Hand resolve (ROYAL FLUSH)", function() {


	it("Should resolve to royal flush", function() {
		var handValue = handRanker.valueOfHand(['Ah', 'Kh', 'Qh', 'Jh', '6d'], ['Tc', 'Th']);
		console.log("Hand value");
		console.log(handValue)
		expect(handValue).to.deep.equal({
			cards: ['Ah', 'Kh', 'Qh', 'Jh', 'Th'],
			handType: 'royalFlush',
			kickers: [14, 13, 12, 11, 10]
		});
	})

	it("Should resolve to royal flush (2)", function() {
		var handValue = handRanker.valueOfHand(['Ah', 'Kh', 'Qh', '8h', '9h'], ['Jh', 'Th']);
		console.log("Hand value");
		console.log(handValue)
		expect(handValue).to.deep.equal({
			cards: ['Ah', 'Kh', 'Qh', 'Jh', 'Th'],
			handType: 'royalFlush',
			kickers: [14, 13, 12, 11, 10]
		});
	})

	it("Should resolve to royal flush (3)", function() {
		var handValue = handRanker.valueOfHand(['As', 'Tc', 'Qc', 'Jc', 'Kc'], ['Ad', 'Ac']);
		console.log("Hand value");
		console.log(handValue)
		expect(handValue).to.deep.equal({
			cards: ['Ac', 'Kc', 'Qc', 'Jc', 'Tc'],
			handType: 'royalFlush',
			kickers: [14, 13, 12, 11, 10]
		});
	})

	it("Should resolve to royal flush (4)", function() {
		var handValue = handRanker.valueOfHand(['Ac', 'Tc', 'Qc', 'Jc', 'Kc'], ['2c', '2s']);
		console.log("Hand value");
		console.log(handValue)
		expect(handValue).to.deep.equal({
			cards: ['Ac', 'Kc', 'Qc', 'Jc', 'Tc'],
			handType: 'royalFlush',
			kickers: [14, 13, 12, 11, 10]
		});
	})	
});

describe("Hand resolve (STRAIGHT FLUSH)", function() {


	it("Should resolve to straight flush", function() {
		console.log("A low straight flush!")
		var handValue = handRanker.valueOfHand(['Ad', '3d', '5d', 'Kc', 'Ts'], ['4d', '2d']);
		console.log("Hand value");
		console.log(handValue)
		expect(handValue).to.deep.equal({
			cards: ['Ad', '5d', '4d', '3d', '2d'],
			handType: 'straightFlush',
			kickers: [14, 5, 4, 3, 2]
		});
	})

	it("Should resolve to straight flush (2)", function() {
		var handValue = handRanker.valueOfHand(['Kd', '9d', 'Qd', 'Jd', 'Td'], ['Ac', 'As']);
		console.log("Hand value");
		console.log(handValue)
		expect(handValue).to.deep.equal({
			cards: ['Kd', 'Qd', 'Jd', 'Td', '9d'],
			handType: 'straightFlush',
			kickers: [13, 12, 11, 10, 9]
		});
	})

	it("Should resolve to straight flush (3)", function() {
		var handValue = handRanker.valueOfHand(['6d', '3d', '5d', 'Kc', 'Ts'], ['4d', '2d']);
		console.log("Hand value");
		console.log(handValue)
		expect(handValue).to.deep.equal({
			cards: ['6d', '5d', '4d', '3d', '2d'],
			handType: 'straightFlush',
			kickers: [6, 5, 4, 3, 2]
		});
	})
	
});

describe("Hand resolve (FLUSH)", function() {


	it("Should resolve to flush", function() {
		var handValue = handRanker.valueOfHand(['Ah', '2h', '3h', '4h', '6d'], ['Kh', 'Qh']);
		console.log("Hand value");
		console.log(handValue)
		expect(handValue).to.deep.equal({
			cards: ['Ah', 'Kh', 'Qh', '4h', '3h'],
			handType: 'flush',
			kickers: [14, 13, 12, 4, 3]
		});
	})

	it("Should resolve to flush (2)", function() {
		var handValue = handRanker.valueOfHand(['4s', '4d', '3d', 'Th', '9d'], ['Ad', 'Td']);
		console.log("Hand value");
		console.log(handValue)
		expect(handValue).to.deep.equal({
			cards: ['Ad', 'Td', '9d', '4d', '3d'],
			handType: 'flush',
			kickers: [14, 10, 9, 4, 3]
		});
	})	

	it("Should resolve to flush (3)", function() {
		var handValue = handRanker.valueOfHand(['Kc', '7c', '2c', 'Tc', 'Jc'], ['As', 'Td']);
		console.log("Hand value");
		console.log(handValue)
		expect(handValue).to.deep.equal({
			cards: ['Kc', 'Jc', 'Tc', '7c', '2c'],
			handType: 'flush',
			kickers: [13, 11, 10, 7, 2]
		});
	})			
});