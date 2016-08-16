### Texas Holdem Hand Ranker

This component ranks poker hands. For example, you can give it an array of hands and it resolves the winning one for you.

### Usage

HoldemRanker presents very simple API. The API has two methods:

> **HoldemRanker.valueOfHand**
> * Returns a representation of the value of given hand *
>
> **HoldemRanker.getWinner**
> * Given an array of hands, returns the winning hand. *

---

MIT License and so on

### Todo:

1. Ranking hands from best -> worst (currently only returns best hand(s))
2. Async hand resolving?
3. Omaha hand resolving?