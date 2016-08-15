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

	// We test separately for A->2->3->4->5 straight so we can convert ace to 1
	if (isLowestStraight(combo)) {
		return {
			handType: 'straight',
			handRank: 6, 
			kickers: [5,4,3,2,1]
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

function isLowestStraight(combo) {
	var kickers = getKickersOfHand(combo);

	return (kickers[0] === 14 
	&& kickers[1] === 5
	&& kickers[2] === 4 
	&& kickers[3] === 3
	&& kickers[4] === 2)
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
			return b-a;
		})

		return kickersInDecreasingOrder(kickers) || kickersInDecreasingOrder(sndVersion);
	}

	return kickersInDecreasingOrder(kickers);
}

function isThreeOfAKind(combo) {
	var kickers = getKickersOfHand(combo);

	console.log("Kickers");
	console.log(kickers)

	// Possible trips (after sorted): xxx00, 0xxx0, 00xxx
	var first = _.take(kickers, 3);
	var middle = _.tail(_.take(kickers, 4));
	var last = _.takeRight(kickers, 3);

	return (allTheSameInArray(first) || allTheSameInArray(middle) || allTheSameInArray(last));
}

function isTwoPairs(combo) {
	var kickers = getKickersOfHand(combo);

	// Possible two pairs (after sorted): xxyy0, xx0yy, 0xxyy
	console.log(kickers);
	// xxyy0
	var firstPair = _.take(kickers,2);
	var sndPair   = _.takeRight(_.initial(kickers), 2);
	if (allTheSameInArray(firstPair) && allTheSameInArray(sndPair)) return true;

	// xx0yy
	sndPair = _.takeRight(kickers, 2);
	if (allTheSameInArray(firstPair) && allTheSameInArray(sndPair)) return true;

	// 0xxyy
	firstPair = _.take(_.tail(kickers), 2);
	if (allTheSameInArray(firstPair) && allTheSameInArray(sndPair)) return true;

	return false;

}

function isPair(combo) {
	// Possible pairs: xx000, 0xx00, 00xx0, 000xx
	var kickers = getKickersOfHand(combo);

	if (allTheSameInArray(_.take(kickers, 2))) return true;
	if (allTheSameInArray(_.take(_.tail(kickers), 2))) return true;
	if (allTheSameInArray(_.takeRight(_.initial(kickers), 2))) return true;	
	if (allTheSameInArray(_.takeRight(kickers, 2))) return true;
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
function findOutBestByKickersDrawPossible(evalObjs) {
	// Multiply highest by 10^8, next 10^6, next 10^4, next 10^2, next 10^0 and sum up.
	var bestEvalInfos =_.chain(evalObjs)
	.map(function(evalObj) {
		var kickers = evalObj.evalInfo.kickers;
		return {
			id: evalObj.id,
			kickersWorth: 
				// Kickers are already in decreasing order
				kickers[0] * Math.pow(10, 8) + 
				kickers[1] * Math.pow(10, 6) + 
				kickers[2] * Math.pow(10, 4) + 
				kickers[3] * Math.pow(10, 2) + 
				kickers[4] * Math.pow(10, 0)
			,
			evalInfo: evalObj.evalInfo	
		}
	})
	.sortBy(function(summedEvaluation) {
		return (-1) * summedEvaluation.kickersWorth;
	})
	.value();

	// Check if multiple hands are drawing the best kickers

	var checkedAgainst = bestEvalInfos[0];

	return _.filter(bestEvalInfos, function(evalInfo) {
		return evalInfo.kickersWorth === checkedAgainst.kickersWorth;
	})

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


/*
* METHODS FOR RESOLVING ORDER BASED ON KICKERS
*
*/
// Dispatcher
function resolveBestKickerUsage(kickers, rank) {
	// Should probably use a mapping of rank -> function instead here
	// And convert those magic numbers into constants for god's sake.
	if (rank === 10) return resolveBetweenHighCards(kickers);
	if (rank === 9) return resolveBetweenPairs(kickers);
	if (rank === 8) return resolveBetweenTwoPairs(kickers);
	if (rank === 7) return resolveBetweenTrips(kickers);
	if (rank === 6) return resolveBetweenStraights(kickers);
	if (rank === 5) return resolveBetweenFlushes(kickers);
	if (rank === 4) return resolveBetweenFullHouses(kickers);
	if (rank === 3) return resolveBetweenQuads(kickers);
	if (rank === 2) return resolveBetweenStraightFlushes(kickers);
	if (rank === 1) return resolveBetweenRoyalFlushes(kickers);

	throw new Error("Resolving best kicker failed - no resolve method to call?");
}

function resolveBetweenRoyalFlushes(kickers) {
	// Well there can be just one or else all players share the board royal flush
	return 1; // Only way to share royal flush is to have one on board
	
}
function resolveBetweenStraightFlushes(kickers) {
	return _.reduce(kickers, function(s, kicker) {
		return s + kicker;
	}, 0);
	
}
function resolveBetweenQuads(kickers) {
	var kickersToCounts = _.countBy(kickers, function(kicker) { return kicker});
	var quadVal = 0;
	var kickerVal = 0;
	_.forOwn(kickersToCounts, function(count, kicker) {
		if (count === 4) {
			quadVal = kicker;
		}
		else if (count === 1) {
			kickerVal = kicker;
		} 
	});

	return quadVal * 100 + kickerVal;
}
function resolveBetweenFullHouses(kickers) {
	var kickersToCounts = _.countBy(kickers, function(kicker) { return kicker});
	var threeVal = 0;
	var twoVal = 0;
	_.forOwn(kickersToCounts, function(count, kicker) {
		if (count === 3) {
			threeVal = kicker;
		}
		else if (count === 2) {
			twoVal = kicker;
		} 
	});

	return threeVal * 100 + twoVal;
}
function resolveBetweenFlushes(kickers) {
	return (kickers[0] * Math.pow(10, 8)
	+ kickers[1] * Math.pow(10, 6)
	+ kickers[2] * Math.pow(10, 4)
	+ kickers[3] * Math.pow(10, 2)
	+ kickers[4] * Math.pow(10, 0));	
}

function resolveBetweenStraights(kickers) {
	return _.reduce(kickers, function(s, kicker) {
		return s + kicker;
	}, 0);	
}
function resolveBetweenTrips(kickers) {
	var kickersToCounts = _.countBy(kickers, function(kicker) { return kicker});
	var threeVal = 0;
	var extras = [];
	_.forOwn(kickersToCounts, function(count, kicker) {
		if (count === 3) {
			threeVal = kicker;
		}
		else if (count === 1) {
			extras.push(kicker);
		} 
	});

	extras = extras.sort(function(a,b) {
		return b-a;
	})

	return threeVal * 10000 + extras[0] * 100 + extras[1];	
}
function resolveBetweenTwoPairs(kickers) {
	var kickersToCounts = _.countBy(kickers, function(kicker) { return kicker});
	var twoPairFormingVals = [];
	var extra = 0
	_.forOwn(kickersToCounts, function(count, kicker) {
		if (count === 2) {
			twoPairFormingVals.push(kicker);
		}
		else if (count === 1) {
			extra = kicker;
		} 
	});

	twoPairFormingVals = twoPairFormingVals.sort(function(a,b) {
		return b-a;
	})

	return twoPairFormingVals[0] * 10000 + twoPairFormingVals[1] * 100 + extra;	
}
function resolveBetweenPairs(kickers) {
	var kickersToCounts = _.countBy(kickers, function(kicker) { return kicker});
	var pair = 0;
	var extras = [];

	_.forOwn(kickersToCounts, function(count, kicker) {
		if (count === 2) {
			pair = kicker;
		}
		else if (count === 1) {
			extras.push(kicker);
		} 
	});

	extras = extras.sort(function(a,b) {
		return b-a;
	})

	return (
	       pair * 1000000
	+ extras[0] * 10000	
	+ extras[1] * 100
	+ extras[2] * 1
	)
}
function resolveBetweenHighCards(kickers) {
	return (kickers[0] * Math.pow(10, 8)
	+ kickers[1] * Math.pow(10, 6)
	+ kickers[2] * Math.pow(10, 4)
	+ kickers[3] * Math.pow(10, 2)
	+ kickers[4] * Math.pow(10, 0));
}



// PUBLIC API METHOD
function valueOfHand(boardCards, holeCards, includeHandRank) {
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

	var o = {
		cards: rankCards(best.combo),
		handType: best.evaluation.handType,
		kickers:  best.evaluation.kickers
	}

	if (includeHandRank) o.handRank = best.evaluation.handRank;
	return o;

}

// PUBLIC API METHOD
function rankEvaluations(evals) {

	// Resolve best winning hand type
	var bestRank = 10;
	_.forEach(evals, function(evalObj) {
		if (bestRank > evalObj.evalInfo.handRank) bestRank = evalObj.evalInfo.handRank;
	})
	console.log("--Best rank found: " + bestRank);
	// Only remain those which have the best handRank
	var bests = _.filter(evals, function(evalObj) {
		return evalObj.evalInfo.handRank === bestRank;
	});

	// Resolve among winning hand types the one with best kickers
	var bestEvalInfos =_.chain(bests)
	.map(function(evalObj) {
		var kickers = evalObj.evalInfo.kickers;
		return {
			id: evalObj.id,
			kickersWorth: resolveBestKickerUsage(kickers, bestRank),
			evalInfo: evalObj.evalInfo	
		}
	})
	.sortBy(function(summedEvaluation) {
		return (-1) * summedEvaluation.kickersWorth;
	})
	.value();

	// Check if multiple hands are drawing the best kickers

	var checkedAgainst = bestEvalInfos[0];

	return _.filter(bestEvalInfos, function(evalInfo) {
		return evalInfo.kickersWorth === checkedAgainst.kickersWorth;
	})

}

function getRankVal(evalInfo) {

	if (evalInfo.handType === 'roaylFlush') return Math.pow(10, 12);
	if (evalInfo.handType === 'straightFlush') {

	}
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
	valueOfHand: valueOfHand,

	/*
	* Resolves the ranking between multiple hands
	* @param {Array} boardCards - The five shared board cards
	* @param {Array} arrayOfHoleCards - Array of holecard arrays
	* @returns {Array} - Array where holecards are ranked in order (most valued 1st)
	*/	
	rankHands: function(boardCards, arrayOfHoleCardObjects) {

		// holeCardObject = {id (optional): INT/STRING, cards: ARRAY[2]}

		var evals = _.map(arrayOfHoleCardObjects, function(holeCardObject) {
			var holeCards = holeCardObject.cards;
			return {
				id: holeCardObject.id,
				evalInfo: valueOfHand(boardCards, holeCards, true)
			}
		});
		console.log("RANK HAND EVALS");
		console.log(evals);

		var bests = rankEvaluations(evals);

		console.log("BEST RANKED HAND");
		console.log(bests);

		return bests;

	},
	/*
	* Resolves the ranking between multiple eval-objects (as returned by valueOfHand)
	* @param {Array} evals - Array of evaluation objects
	* @returns {Array} - Array where evaluations are ranked best first
	*/	
	rankEvaluations: rankEvaluations
}