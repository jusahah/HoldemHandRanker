var _ = require('lodash');
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

describe("Hand resolve (FOUR OF A KIND)", function() {


	it("Should resolve to four of a kind", function() {
		var handValue = handRanker.valueOfHand(['Ac', 'As', '5d', 'Kc', 'Ts'], ['Ah', 'Ad']);
		console.log("Hand value");
		console.log(handValue)
		expect(handValue).to.deep.equal({
			cards: ['Ac', 'As', 'Ad', 'Ah', 'Kc'],
			handType: 'fourOfAKind',
			kickers: [14, 14, 14, 14, 13]
		});
	})

	it("Should resolve to four of a kind (2)", function() {
		var handValue = handRanker.valueOfHand(['7h', '7c', '7s', 'Tc', 'Ts'], ['Td', '7d']);
		console.log("Hand value");
		console.log(handValue)
		expect(handValue).to.deep.equal({
			cards: ['Tc', '7h', '7c', '7s', '7d'],
			handType: 'fourOfAKind',
			kickers: [10, 7, 7, 7, 7]
		});
	})	

	it("Should resolve to four of a kind (3)", function() {
		var handValue = handRanker.valueOfHand(['7h', '7c', '7s', 'Jc', '7d'], ['2h', '3h']);
		console.log("Hand value");
		console.log(handValue)
		expect(handValue).to.deep.equal({
			cards: ['Jc', '7h', '7c', '7s', '7d'],
			handType: 'fourOfAKind',
			kickers: [11, 7, 7, 7, 7]
		});
	})	

});

describe("Hand resolve (FULL HOUSE)", function() {

	it("Should resolve to full house", function() {
		var handValue = handRanker.valueOfHand(['2h', '2c', '3h', '3s', '6d'], ['3d', 'Qh']);
		console.log("Hand value");
		console.log(handValue)
		expect(handValue).to.deep.equal({
			cards: ['3h', '3s', '3d', '2h', '2c'],
			handType: 'fullHouse',
			kickers: [3,3,3,2,2]
		});
	})

	it("Should resolve to full house (2)", function() {
		var handValue = handRanker.valueOfHand(['2h', '2c', '3h', '2s', '3d'], ['3c', 'Ah']);
		console.log("Hand value");
		console.log(handValue)
		expect(handValue).to.deep.equal({
			cards: ['3h', '3c', '3d', '2h', '2c'],
			handType: 'fullHouse',
			kickers: [3,3,3,2,2]
		});
	})

	it("Should resolve to full house (3)", function() {
		var handValue = handRanker.valueOfHand(['Th', 'Tc', 'Qh', 'Ts', 'Qd'], ['5c', '6c']);
		console.log("Hand value");
		console.log(handValue)
		expect(handValue).to.deep.equal({
			cards: ['Qh', 'Qd', 'Th', 'Tc', 'Ts'],
			handType: 'fullHouse',
			kickers: [12,12,10,10,10]
		});
	})	

	it("Should resolve to full house (4)", function() {
		var handValue = handRanker.valueOfHand(['Th', 'Tc', 'Kh', 'Ts', 'Kd'], ['Ac', 'As']);
		console.log("Hand value");
		console.log(handValue)
		expect(handValue).to.deep.equal({
			cards: ['As', 'Ac', 'Th', 'Tc', 'Ts'],
			handType: 'fullHouse',
			kickers: [14,14,10,10,10]
		});
	})

	it("Should resolve to full house (5)", function() {
		var handValue = handRanker.valueOfHand(['9h', 'Ad', 'Jc', 'Jd', '8d'], ['Js', '8s']);
		console.log("Hand value");
		console.log(handValue)
		expect(handValue).to.deep.equal({
			cards: ['Jc', 'Js', 'Jd', '8s', '8d'],
			handType: 'fullHouse',
			kickers: [11,11,11,8,8]
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

	it("Should resolve to flush (4)", function() {
		var handValue = handRanker.valueOfHand(['3d', '4s', '5d', '6s', '7d'], ['8d', '9d']);
		console.log("Hand value");
		console.log(handValue)
		expect(handValue).to.deep.equal({
			cards: ['9d', '8d', '7d', '5d', '3d'],
			handType: 'flush',
			kickers: [9,8,7,5,3]
		});
	})			
});

describe("Hand resolve (STRAIGHT)", function() {

	it("Should resolve to straight (1)", function() {
		var handValue = handRanker.valueOfHand(['Ah', '5c', '3c', '4c', 'Kc'], ['Js', '2s']);
		console.log("Hand value");
		console.log(handValue)
		expect(handValue).to.deep.equal({
			cards: ['Ah', '5c', '4c', '3c', '2s'],
			handType: 'straight',
			kickers: [5,4,3,2,1]
		});
	})

	it("Should resolve to straight (2)", function() {
		var handValue = handRanker.valueOfHand(['Ah', 'Tc', 'Jc', 'Qc', 'Kc'], ['Jd', 'Js']);
		console.log("Hand value");
		console.log(handValue)
		expect(handValue).to.deep.equal({
			cards: ['Ah', 'Kc', 'Qc', 'Jc', 'Tc'],
			handType: 'straight',
			kickers: [14,13,12,11,10]
		});
	})

	it("Should resolve to straight (3)", function() {
		var handValue = handRanker.valueOfHand(['5h', '6s', '7d', 'Qc', 'Kc'], ['8s', '4c']);
		console.log("Hand value");
		console.log(handValue)
		expect(handValue).to.deep.equal({
			cards: ['8s', '7d', '6s', '5h', '4c'],
			handType: 'straight',
			kickers: [8,7,6,5,4]
		});
	})		
});

describe("Hand resolve (THREE OF A KIND)", function() {

	it("Should resolve to trips (1)", function() {
		var handValue = handRanker.valueOfHand(['Ah', 'Ac', 'As', 'Qc', 'Kc'], ['Jd', '3s']);
		console.log("Hand value");
		console.log(handValue)
		expect(handValue).to.deep.equal({
			cards: ['Ah', 'Ac', 'As', 'Kc', 'Qc'],
			handType: 'threeOfAKind',
			kickers: [14,14,14,13,12]
		});
	})

	it("Should resolve to trips (2)", function() {
		var handValue = handRanker.valueOfHand(['Ah', 'Ac', '2s', 'Qc', 'Kc'], ['Jd', 'As']);
		console.log("Hand value");
		console.log(handValue)
		expect(handValue).to.deep.equal({
			cards: ['Ah', 'Ac', 'As', 'Kc', 'Qc'],
			handType: 'threeOfAKind',
			kickers: [14,14,14,13,12]
		});
	})	

	it("Should resolve to trips (3)", function() {
		var handValue = handRanker.valueOfHand(['Ah', '3c', 'Qc', '2s', 'Kc'], ['Ad', 'As']);
		console.log("Hand value");
		console.log(handValue)
		expect(handValue).to.deep.equal({
			cards: ['Ah', 'As', 'Ad', 'Kc', 'Qc'],
			handType: 'threeOfAKind',
			kickers: [14,14,14,13,12]
		});
	})	


});

describe("Hand resolve (TWO PAIR)", function() {

	it("Should resolve to two pairs (1)", function() {
		var handValue = handRanker.valueOfHand(['Ah', '3c', '2s', 'Qc', 'Jc'], ['Ad', 'Qd']);
		console.log("Hand value");
		console.log(handValue)
		expect(handValue).to.deep.equal({
			cards: ['Ah', 'Ad', 'Qd', 'Qc', 'Jc'],
			handType: 'twoPairs',
			kickers: [14,14,12,12,11]
		});
	})

	it("Should resolve to two pairs (2)", function() {
		var handValue = handRanker.valueOfHand(['7h', '3c', '2s', '7c', '5c'], ['3d', '2d']);
		console.log("Hand value");
		console.log(handValue)
		expect(handValue).to.deep.equal({
			cards: ['7h', '7c', '5c', '3c', '3d'],
			handType: 'twoPairs',
			kickers: [7,7,5,3,3]
		});
	})

	it("Should resolve to two pairs (3)", function() {
		var handValue = handRanker.valueOfHand(['7h', '5s', '2s', '7c', '5c'], ['Ad', 'Kd']);
		console.log("Hand value");
		console.log(handValue)
		expect(handValue).to.deep.equal({
			cards: ['Ad', '7h', '7c', '5s', '5c'],
			handType: 'twoPairs',
			kickers: [14,7,7,5,5]
		});
	})

	it("Should resolve to two pairs (4)", function() {
		var handValue = handRanker.valueOfHand(['7h', '5s', 'Qs', '7c', '5c'], ['Kh', 'Kd']);
		console.log("Hand value");
		console.log(handValue)
		expect(handValue).to.deep.equal({
			cards: ['Kd', 'Kh', 'Qs', '7h', '7c'],
			handType: 'twoPairs',
			kickers: [13, 13, 12, 7,7]
		});
	})	

	it("Should resolve to two pairs (5)", function() {
		var handValue = handRanker.valueOfHand(['Jh', '5s', 'Qs', '7c', 'Jc'], ['5c', 'As']);
		console.log("Hand value");
		console.log(handValue)
		expect(handValue).to.deep.equal({
			cards: ['As', 'Jh', 'Jc', '5s', '5c'],
			handType: 'twoPairs',
			kickers: [14, 11, 11, 5,5]
		});
	})	
});

describe("Hand resolve (PAIR)", function() {

	it("Should resolve to pair (1)", function() {
		var handValue = handRanker.valueOfHand(['Jh', '5s', '2d', '7c', 'Th'], ['Qs', 'Qc']);
		console.log("Hand value");
		console.log(handValue)
		expect(handValue).to.deep.equal({
			cards: ['Qc', 'Qs', 'Jh', 'Th', '7c'],
			handType: 'pair',
			kickers: [12, 12, 11, 10, 7]
		});
	})	

	it("Should resolve to pair (2)", function() {
		var handValue = handRanker.valueOfHand(['Ah', '5s', '2d', 'Kc', 'Th'], ['Qs', 'Qc']);
		console.log("Hand value");
		console.log(handValue)
		expect(handValue).to.deep.equal({
			cards: ['Ah', 'Kc', 'Qc', 'Qs', 'Th'],
			handType: 'pair',
			kickers: [14, 13, 12, 12, 10]
		});
	})	

	it("Should resolve to pair (3)", function() {
		var handValue = handRanker.valueOfHand(['Ah', '5s', '2d', 'Kc', '9h'], ['3d', '2c']);
		console.log("Hand value");
		console.log(handValue)
		expect(handValue).to.deep.equal({
			cards: ['Ah', 'Kc', '9h', '2d', '2c'],
			handType: 'pair',
			kickers: [14, 13, 9, 2, 2]
		});
	})	

	it("Should resolve to pair (4)", function() {
		var handValue = handRanker.valueOfHand(['5s', '4s', 'Kd', '9c', '9h'], ['3d', 'Jc']);
		console.log("Hand value");
		console.log(handValue)
		expect(handValue).to.deep.equal({
			cards: ['Kd', 'Jc', '9c', '9h', '5s'],
			handType: 'pair',
			kickers: [13, 11, 9, 9, 5]
		});
	})
});

describe("Hand resolve (HIGH CARD)", function() {

	it("Should resolve to high card (1)", function() {
		var handValue = handRanker.valueOfHand(['5s', '4s', 'Kd', '9c', 'Qh'], ['3d', 'Jc']);
		console.log("Hand value");
		console.log(handValue)
		expect(handValue).to.deep.equal({
			cards: ['Kd', 'Qh', 'Jc', '9c', '5s'],
			handType: 'highCard',
			kickers: [13, 12, 11, 9, 5]
		});
	})

	it("Should resolve to high card (2)", function() {
		var handValue = handRanker.valueOfHand(['4h', '5h', '6h', '7h', '9s'], ['As', '2s']);
		console.log("Hand value");
		console.log(handValue)
		expect(handValue).to.deep.equal({
			cards: ['As', '9s', '7h', '6h', '5h'],
			handType: 'highCard',
			kickers: [14,9,7,6,5]
		});
	})

	it("Should resolve to high card (2)", function() {
		var handValue = handRanker.valueOfHand(['Th', '5h', '6h', '7h', '9s'], ['3s', '2s']);
		console.log("Hand value");
		console.log(handValue)
		expect(handValue).to.deep.equal({
			cards: ['Th', '9s', '7h', '6h', '5h'],
			handType: 'highCard',
			kickers: [10,9,7,6,5]
		});
	})		
});


describe("Hand comparisons", function() {
	it("All should draw with flush", function() {
		var winningHands = handRanker.rankHands(
			['2h', '3h', '5h', '6h', 'Kh'], // BOARD
			[
				{id: 1, cards: ['3s', 'Ac']}, // P1
				{id: 2, cards: ['Ks', 'Qd']}, // P2
				{id: 3, cards: ['2s', '6c']}  // P2
			]
		);
		console.log("Winning hands");
		console.log(winningHands)
		expect(winningHands.length).to.equal(3);

		var winnerIDs = _.map(winningHands, function(winningEval) {
			return winningEval.id;
		})
		expect(winnerIDs).to.deep.equal([1,2,3]);
	})

	it("Pair should win highCard", function() {
		var winningHands = handRanker.rankHands(
			['2h', '3c', '5h', '6h', '8s'], // BOARD
			[
				{id: 1, cards: ['3s', 'Ad']}, // P1
				{id: 2, cards: ['Ks', 'Qd']}  // P2
			]
		);
		console.log("Winning hand");
		console.log(winningHands)
		// One winner
		expect(winningHands.length).to.equal(1);
		// P1 wins
		expect(winningHands[0].id).to.equal(1);
	})	

	it("Higher straight should win lower straight and trips", function() {
		var winningHands = handRanker.rankHands(
			['Ah', 'Kc', 'Qh', '2h', '3s'], // BOARD
			[
				{id: 1, cards: ['4d', '5d']}, // P1
				{id: 2, cards: ['Td', 'Jd']}, // P2
				{id: 3, cards: ['3c', '3h']}, // P3
			]
		);
		console.log("Winning hands");
		console.log(winningHands)
		// One winner
		expect(winningHands.length).to.equal(1);
		// P2 wins
		expect(winningHands[0].id).to.equal(2);
	})	

	it("Quads should win lower flush and full house", function() {
		var winningHands = handRanker.rankHands(
			['Kh', 'Kc', 'Qh', 'Qc', '3c'], // BOARD
			[
				{id: 1, cards: ['4c', 'Ac']}, // P1 -> flush
				{id: 2, cards: ['5c', '6c']}, // P2 -> flush
				{id: 3, cards: ['Kd', '6s']}, // P3 -> full house
				{id: 4, cards: ['Qs', 'Qd']}, // P4 -> quads
			]
		);
		console.log("Winning hands");
		console.log(winningHands)
		// One winner
		expect(winningHands.length).to.equal(1);
		// P2 wins
		expect(winningHands[0].id).to.equal(4);
	})

	it("Two pairs with same kickers draw", function() {
		var winningHands = handRanker.rankHands(
			['Th', 'Kc', '3h', '4c', 'Tc'], // BOARD
			[
				{id: 1, cards: ['Jd', 'Jh']}, // P1 -> two pairs winning
				{id: 2, cards: ['Jc', 'Js']}, // P2 -> two pairs winning
				{id: 3, cards: ['4d', '6s']}, // P3 -> two pairs losing
				{id: 4, cards: ['As', '2c']}, // P4 -> pair
			]
		);
		console.log("Winning hands");
		console.log(winningHands)

		// Two winners
		expect(winningHands.length).to.equal(2);

		var winnerIDs = _.map(winningHands, function(winningEval) {
			return winningEval.id;
		})
		// P1 and P2 win
		expect(winnerIDs).to.deep.equal([1,2]);
	})

	it("Pair with good kicker wins over pair with lousy kicker", function() {
		var winningHands = handRanker.rankHands(
			['6h', 'Kc', '3d', '8d', 'Jh'], // BOARD
			[
				{id: 1, cards: ['3s', 'As']}, // P1 -> small pair
				{id: 2, cards: ['Js', '4h']}, // P3 -> big pair with lousy kicker
				{id: 3, cards: ['Jc', 'Qd']}, // P2 -> big pair with good kicker
				{id: 4, cards: ['2d', '2c']}, // P4 -> small pair
			]
		);
		console.log("Winning hands");
		console.log(winningHands)

		// One winner
		expect(winningHands.length).to.equal(1);
		// P3 wins
		expect(winningHands[0].id).to.equal(3);
	})

});