app.service('appService', ['Card', function (Card) {
    this.GetCardDeck = function () {
        var allShapes = ['oval', 'squiggle', 'diamond'],
            allColors = ['red', 'green', 'purple'],
            allNumbers = [1, 2, 3],
            allShadings = ['solid', 'striped', 'hollow'],
            combinations = combineArrays(allShapes, allColors, allNumbers, allShadings),
            cardDeck = [];

        angular.forEach(combinations, function (combination) {
            cardDeck.push(new Card(combination[0], combination[1], combination[2], combination[3]));
        });

        return cardDeck;
    };

    this.getShadingType = function (card) {
        var shadingType = '';

        if (!!card) {
            switch (card.shading) {
                case 'hollow':
                    shadingType = 'none';
                    break;

                case 'solid':
                    shadingType = card.color;
                    break;

                default:
                    shadingType = 'striped';
                    break;

            };
        }

        return shadingType;
    };

    this.GetRandomCards = function (cardDeck, amountWanted) {
        var randomCardsIndexes = [],
            randomCardsArray = [],
            randomNumber;

        if (!!cardDeck && !!amountWanted) {
            while (randomCardsArray.length !== amountWanted) {
                randomNumber = Math.floor((Math.random() * cardDeck.length));
                //if random number doesn't exists in randomCardsIndexes
                if (randomCardsIndexes.indexOf(randomNumber) === -1 && !cardDeck[randomNumber].isFlipped && cardDeck[randomNumber].isActivate) {
                    randomCardsIndexes.push(randomNumber);
                    randomCardsArray.push(cardDeck[randomNumber]);
                }
            }
        }
        return randomCardsArray;
    };

    this.flipCards = function (isFlipped, cards) {
        angular.forEach(cards, function (card) {
            card.isFlipped = isFlipped;
        });
    };

    this.activateCards = function (cards, isActivate) {
        angular.forEach(cards, function (card) {
            card.isActivate = isActivate;
            card.isSelected = false;
        });
    };

    this.deSelectCards = function (cards) {
        angular.forEach(cards, function (card) {
            card.isSelected = false;
        });
    };

    // input: n cards, output: true/false - if SET or not
    this.isSET = function (cards) {
        var isSET = true,
            propertiesToCheck = ['shape', 'color', 'number', 'shading'],
            isAllEqualOrAllDifferent = function (property, cards) {
                var firstCard,
                    isAllEqual = isAllDifferent = true;

                if (!!cards && !!property) {
                    firstCard = cards[0];
                    //Compare all cards to firstCard
                    angular.forEach(cards, function (card, index) {
                        if (index > 0) {
                            if (!(firstCard[property] === card[property])) {
                                isAllEqual = false;
                            }
                            if (!(firstCard[property] !== card[property])) {
                                isAllDifferent = false;
                            }
                        }
                    });

                    return isAllEqual || isAllDifferent;
                } else {
                    return false;
                }
            };

        if (!!cards) {
            angular.forEach(propertiesToCheck, function (property) {
                result = isAllEqualOrAllDifferent(property, cards);
                if (!result) {
                    isSET = false;
                }
            });
        } else {
            isSET = false;
        }

        return isSET;
    };

    this.getSelectedCards = function (gameCards) {
        return !!gameCards ? gameCards.filter(function (card) { return !!card.isSelected }) : [];
    };

    this.getActivatedCards = function (gameCards) {
        return !!gameCards ? gameCards.filter(function (card) { return !!card.isActivate }) : [];
    };

    this.isSetsExists = function (gameCards) {
        var result = false;

        for (var i = 0; i < gameCards.length; i++) {
            for (var j = 1; j < gameCards.length; j++) {
                for (var z = 2; z < gameCards.length; z++) {
                    if (i !== j && i !== z && j !== z) {
                        if (this.isSET([gameCards[i], gameCards[j], gameCards[z]])) {
                            result = true;
                        }
                    }
                }
            }
        }

        return result;
    }

    this.isGameOver = function(cardDeck) {
        var result = false, amountOfCardsLeft = cardDeck.filter(function(card) {
            return card.isActivate && !card.isFlipped;
        }).length;

        if(amountOfCardsLeft === 0) {
            result = true;
        }

        return result;
    };

    // input: n arrays, output: returns all combinations possible from arrays items
    function combineArrays() {
        var resultArray = [],
            inputArraysToCombine = arguments,
            max;

        if (!!inputArraysToCombine) {
            max = inputArraysToCombine.length - 1,
                combineRecursiveFunc = function (arr, i) {
                    var combinationItem;

                    for (var j = 0, l = inputArraysToCombine[i].length; j < l; j++) {
                        combinationItem = arr.slice(0); // clone arr
                        combinationItem.push(inputArraysToCombine[i][j]);
                        if (i == max)
                            resultArray.push(combinationItem);
                        else
                            combineRecursiveFunc(combinationItem, i + 1);
                    }
                };

            combineRecursiveFunc([], 0);
        }

        return resultArray;
    }
}]);