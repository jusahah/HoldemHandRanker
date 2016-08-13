var _ = require('lodash');

var CARDS = [
	['Ah', '2h', '3h', '4h', '5h', '6h', '7h', '8h', '9h', 'Th', 'Jh', 'Qh', 'Kh'],
	['As', '2s', '3s', '4s', '5s', '6s', '7s', '8s', '9s', 'Ts', 'Js', 'Qs', 'Ks'],
	['Ac', '2c', '3c', '4c', '5c', '6c', '7c', '8c', '9c', 'Tc', 'Jc', 'Qc', 'Kc'],
	['Ad', '2d', '3d', '4d', '5d', '6d', '7d', '8d', '9d', 'Td', 'Jd', 'Qd', 'Kd']
];

var createAllFiveCombos = function(cards) {
	var combos = [];
	// Comment after shows which two are missing from the selection
	combos.push([cards[0], cards[1], cards[2], cards[3], cards[4]]); // 5,6
	combos.push([cards[0], cards[1], cards[2], cards[3], cards[5]]); // 4,6
	combos.push([cards[0], cards[1], cards[2], cards[5], cards[4]]); // 3,6
	combos.push([cards[0], cards[1], cards[5], cards[3], cards[4]]); // 2,6
	combos.push([cards[0], cards[5], cards[2], cards[3], cards[4]]); // 1,6
	combos.push([cards[5], cards[1], cards[2], cards[3], cards[4]]); // 0,6

	combos.push([cards[0], cards[1], cards[2], cards[3], cards[6]]); // 4,5
	combos.push([cards[0], cards[1], cards[2], cards[4], cards[6]]); // 3,5
	combos.push([cards[0], cards[1], cards[3], cards[6], cards[4]]); // 2,5
	combos.push([cards[0], cards[2], cards[6], cards[3], cards[4]]); // 1,5
	combos.push([cards[1], cards[6], cards[2], cards[3], cards[4]]); // 0,5

	combos.push([cards[0], cards[1], cards[2], cards[5], cards[6]]); // 3,4
	combos.push([cards[0], cards[1], cards[3], cards[6], cards[5]]); // 2,4
	combos.push([cards[0], cards[6], cards[2], cards[5], cards[3]]); // 1,4
	combos.push([cards[2], cards[1], cards[5], cards[3], cards[6]]); // 0,4
	
	combos.push([cards[0], cards[1], cards[6], cards[4], cards[5]]); // 2,3
	combos.push([cards[0], cards[6], cards[2], cards[5], cards[4]]); // 1,3
	combos.push([cards[2], cards[1], cards[5], cards[6], cards[4]]); // 0,3
		 	
	combos.push([cards[0], cards[6], cards[3], cards[5], cards[4]]); // 1,2
	combos.push([cards[6], cards[1], cards[5], cards[3], cards[4]]); // 0,2

	combos.push([cards[6], cards[2], cards[5], cards[3], cards[4]]); // 0,1	

	return combos;
}

var getKickersOfHand = function(combo) {
	var numerics = _.map(combo, function(card) {
		var char = card.charAt(0);
		if (char === 'A') return 14;
		if (char === 'K') return 13;
		if (char === 'Q') return 12;
		if (char === 'J') return 11;
		if (char === 'T') return 10;
		// Its a string of int already
		return parseInt(char);
	});

	return numerics.sort(function(a,b) {
		return b-a;
	})
}

var evaluateCombo = function(combo) {

	if (isRoyalFlush(combo)) {
		return {
			handType: 'royalFlush',
			handRank: 1, 
			kickers: [14,13,12,11,10] // Can be hard-coded, royal flush is T->A
		}
	}

	if (isStraightFlush(combo)) {
		return {
			handType: 'straightFlush',
			handRank: 2, 
			kickers: getKickersOfHand(combo)
		}
	}

	if (isFourOfAKind(combo)) {
		return {
			handType: 'fourOfAKind',
			handRank: 3, 
			kickers: getKickersOfHand(combo)
		}
	}

	if (isFullHouse(combo)) {
		return {
			handType: 'fullHouse',
			handRank: 4, 
			kickers: getKickersOfHand(combo)
		}
	}

	if (isFlush(combo)) {
		return {
			handType: 'flush',
			handRank: 5, 
			kickers: getKickersOfHand(combo)
		}
	}

	if (isStraight(combo)) {
		return {
			handType: 'straight',
			handRank: 6, 
			kickers: getKickersOfHand(combo)
		}
	}
	if (isThreeOfAKind(combo)) {
		return {
			handType: 'threeOfAKind',
			handRank: 7, 
			kickers: getKickersOfHand(combo)
		}
	}
	if (isTwoPairs(combo)) {
		return {
			handType: 'twoPairs',
			handRank: 8, 
			kickers: getKickersOfHand(combo)
		}
	}
	if (isPair(combo)) {
		return {
			handType: 'pair',
			handRank: 9, 
			kickers: getKickersOfHand(combo)
		}
	}
	// Default
	return {
		handType: 'highCard',
		handRank: 10, 
		kickers: getKickersOfHand(combo)
	}

}

function isRoyalFlush(combo) {
	return isFlush(combo) && isHighestStraight(combo); 
}

function isStraightFlush(combo) {
	return isFlush(combo) && isStraight(combo);
}

function isFourOfAKind(combo) {
	var kickers = getKickersOfHand(combo);

	var firstFour = _.initial(kickers);
	var lastFour  = _.tail(kickers);

	return allTheSameInArray(firstFour) || allTheSameInArray(lastFour);

}

function isFullHouse(combo) {
	var kickers = getKickersOfHand(combo);
	// Either its 2-3, or 3-2
	if (allTheSameInArray(_.take(kickers, 2)) && allTheSameInArray(_.takeRight(kickers, 3))) {
		return true;
	}
	if (allTheSameInArray(_.take(kickers, 3)) && allTheSameInArray(_.takeRight(kickers, 2))) {
		return true;
	}

	return false;	
}

function isFlush(combo) {

	var suits = _.map(combo, function(card) {
		return card.charAt(1);
	})

	return allTheSameInArray(suits);

}

function isHighestStraight(combo) {
	var kickers = getKickersOfHand(combo);

	return (kickers[0] === 14 
	&& kickers[1] === 13
	&& kickers[2] === 12 
	&& kickers[3] === 11
	&& kickers[4] === 10)
}

function isStraight(combo) {
	var kickers = getKickersOfHand(combo);
	//console.log("isStraight")
	// Check if has ace, we need to create two versions
	if (hasAceInKickers(kickers)) {
		// Create version where 14 is 1
		var sndVersion = _.map(kickers, function(kicker) {
			if (kicker === 14) return 1;
			return kicker;
		}).sort(function(a,b) {
			b-a;
		})

		return kickersInDecreasingOrder(kickers) || kickersInDecreasingOrder(sndVersion);
	}

	return kickersInDecreasingOrder(kickers);
}

function isThreeOfAKind(combo) {
	var kickers = getKickersOfHand(combo);

	// Possible trips (after sorted): xxx00, 0xxx0, 00xxx
	var first = _.take(kickers, 3);
	var middle = _.tail(_.take(kickers, 4));
	var last = _.takeRight(kickers, 3);

	if (allTheSameInArray(first) || allTheSameInArray(middle) || allTheSameInArray(last));
}

function isTwoPairs(combo) {
	// To be implemented
	return false;
}

function isPair(combo) {
	// To be implemented
	return false;
}

// Helper
function hasAceInKickers(kickers) {
	return !!_.find(kickers, function(kicker) {
		return kicker === 14;
	})
}

// Helper
function allTheSameInArray(arr) {

    for(var i = 1; i < arr.length; i++)
    {
        if(arr[i] !== arr[0])
            return false;
    }

    return true;	

}

// Helper
function kickersInDecreasingOrder(kickers) {
	//console.log(kickers);
	var first = kickers[0];
	var next = first - 1;

	var nofail = true;
	_.forEach(_.tail(kickers), function(kicker) {
		if (kicker !== next) nofail = false;
		next--;
	})

	return nofail;


}

// Helper
function findOutBestByKickers(evalInfos) {
	// Multiply highest by 10^8, next 10^6, next 10^4, next 10^2, next 10^0 and sum up.
	var bestEvalInfo =_.chain(evalInfos)
	.map(function(evalInfo) {
		var kickers = evalInfo.evaluation.kickers;
		return {
			kickersWorth: 
				// Kickers are already in decreasing order
				kickers[0] * Math.pow(10, 8) + 
				kickers[1] * Math.pow(10, 6) + 
				kickers[2] * Math.pow(10, 4) + 
				kickers[3] * Math.pow(10, 2) + 
				kickers[4] * Math.pow(10, 0)
			,
			evalInfo: evalInfo	
		}
	})
	.sortBy(function(summedEvaluation) {
		return (-1) * summedEvaluation.kickersWorth;
	})
	.head()
	.get('evalInfo')
	.value();

	console.log("Best eval info out of many");
	console.log(bestEvalInfo);

	return bestEvalInfo

}

// Helper
function rankCards(cards) {
	return _.chain(cards)
	.map(function(card) {
		var cardVal = card.charAt(0);
		if (cardVal === 'A') cardVal = 14;
		else if (cardVal === 'K') cardVal = 13;
		else if (cardVal === 'Q') cardVal = 12;
		else if (cardVal === 'J') cardVal = 11;
		else if (cardVal === 'T') cardVal = 10;
		else cardVal = parseInt(cardVal);

		return {
			cardVal: cardVal,
			cardSuit: card.charAt(1)
		}

	})
	.sortBy(function(cardInfo) {
		return (-1) * cardInfo.cardVal;
	})
	.map(function(cardInfo) {
		var cardValText = cardInfo.cardVal;
		if (cardValText === 14) cardValText = 'A';
		else if (cardValText === 13) cardValText = 'K';
		else if (cardValText === 12) cardValText = 'Q';
		else if (cardValText === 11) cardValText = 'J';
		else if (cardValText === 10) cardValText = 'T';

		return cardValText + cardInfo.cardSuit;
	})
	.value();
}

module.exports = {

	// Test interface
	getCombos: function(boardCards, holeCards) {
		var cardsToUse = _.flatten(_.concat(boardCards, holeCards));
		var allCombos = createAllFiveCombos(cardsToUse);

		return _.map(allCombos, function(combo) {
			return _.sortBy(combo, function(card) {
				return card;
			})
		})
	},
	/*
	* Resolves the value of the hand
	* @param {Array} boardCards - The five shared board cards
	* @param {Array} holeCards - The two private hole cards of the player
	* @returns {Object} - Object containing info about the value of the hand
	*/
	valueOfHand: function(boardCards, holeCards) {
		// Concat hole cards and board cards together
		var cardsToUse = _.flatten(_.concat(boardCards, holeCards));
		// Generate all possible five card combos
		var combos = createAllFiveCombos(cardsToUse);
		// Evaluate each combo
		var evals = _.map(combos, function(combo) {
			return {
				combo: combo,
				evaluation: evaluateCombo(combo)
			}
		})

		console.log("--Evals--");
		console.log(evals);
		// Find out best handRank within the numerous evaluation objects
		var bestRank = 10;
		_.forEach(evals, function(evalInfo) {
			if (bestRank > evalInfo.evaluation.handRank) bestRank = evalInfo.evaluation.handRank;
		})
		console.log("--Best rank found: " + bestRank);
		// Only remain those which have the best handRank
		var bests = _.filter(evals, function(evalInfo) {
			return evalInfo.evaluation.handRank === bestRank;
		})
		console.log("--Best evals--");
		console.log(bests);

		var best = bests.length === 1 ? bests[0] : findOutBestByKickers(bests);

		// Continue from here 
		// Next differentiate between combos with same handRank but different kickers!

		return {
			cards: rankCards(best.combo),
			handType: best.evaluation.handType,
			kickers:  best.evaluation.kickers
		}

	},

	/*
	* Resolves the ranking between multiple hands
	* @param {Array} boardCards - The five shared board cards
	* @param {Array} arrayOfHoleCards - Array of holecard arrays
	* @returns {Array} - Array where holecards are ranked in order (most valued 1st)
	*/	
	rankHands: function(boardCards, arrayOfHoleCards) {

	}
}