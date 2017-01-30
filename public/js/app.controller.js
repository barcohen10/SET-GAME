app.controller('AppCtrl', ['$scope', '$timeout', 'appService',

    function ($scope, $timeout, appService) {
        var DEFAULT_CARDS_AMOUNT = 12,
            DEFAULT_SET_CARDS_AMOUNT = 3,
            DEFAULT_MESSAGE = "Make as many SETS as you can! A SET must be either all the same OR all different in each individual feature",
            DEFAULT_WIN_MESSAGE = "You Win!",
            DEFAULT_START_GAME_MESSAGE = "Start",
            DEFAULT_RESTART_GAME_MESSAGE = "Restart",
            DEFAULT_SCORE_MESSAGE = "Your Score",
            DEFAULT_SET_MESSAGE = "You found a SET! your score will increase by 10",
            DEFAULT_NOT_SET_MESSAGE = "It's not a SET! your score will decrease by 5",
            changeToDefaultMessage = function () {
                $scope.message = DEFAULT_MESSAGE;
            },
            scanGameBoard = function () {
                var moreCards;
                if (!appService.isSetsExists($scope.gameCards)) {
                    if (!appService.isGameOver($scope.cardsDeck)) {
                        moreCards = appService.GetRandomCards($scope.cardsDeck, DEFAULT_SET_CARDS_AMOUNT);
                        angular.forEach(moreCards, function (card) {
                            $scope.gameCards.push(card);
                        });
                    } else {
                        $scope.message = DEFAULT_WIN_MESSAGE + ' your score is: ' + $scope.score;
                        $scope.isGameInProgress = false;
                    }
                }
            },
            handleSET = function (selectedCards) {
                var randomCards;

                $scope.score += 10;
                appService.activateCards(selectedCards, false);
                $scope.message = DEFAULT_SET_MESSAGE;
                $timeout(changeToDefaultMessage, 2000);

                if ($scope.gameCards.length > 12) {
                    $scope.gameCards = appService.getActivatedCards($scope.gameCards);
                } else {
                    randomCards = appService.GetRandomCards($scope.cardsDeck, DEFAULT_SET_CARDS_AMOUNT);
                    angular.forEach(selectedCards, function (selectedCard, index) {
                        $scope.gameCards[$scope.gameCards.indexOf(selectedCard)] = randomCards[index];
                    });
                    appService.flipCards(true, randomCards);
                }
                scanGameBoard();
            },
            handleNoSET = function (selectedCards) {
                $scope.score -= 5;
                appService.deSelectCards(selectedCards);
                $scope.message = DEFAULT_NOT_SET_MESSAGE;
                $timeout(changeToDefaultMessage, 2000);
            };


        $scope.title = "SET";
        $scope.scoreMessage = DEFAULT_SCORE_MESSAGE;
        $scope.startGameMessage = DEFAULT_START_GAME_MESSAGE;
        $scope.message = DEFAULT_MESSAGE;
        $scope.isGameInProgress = false;

        //Try to load card deck from localStorage
        if (localStorage.getItem("cardDeck") == null) {
            $scope.cardsDeck = appService.GetCardDeck();
            localStorage.setItem("cardDeck", JSON.stringify($scope.cardsDeck));
        } else {
            $scope.cardsDeck = JSON.parse(localStorage.getItem("cardDeck"));
        }

        //Clone cardsDeck + Add shading type
        $scope.cardsDeck = $scope.cardsDeck.slice(0).map(function (card) {
            card.shadingType = appService.getShadingType(card);
            return card;
        });

        $scope.gameCards = appService.GetRandomCards($scope.cardsDeck, DEFAULT_CARDS_AMOUNT);


        $scope.getRange = function (number) {
            return new Array(number);
        };

        $scope.selectedCard = function(card) {
            if($scope.isGameInProgress) {
                card.isSelected = !card.isSelected;
            }
        };

        $scope.startGame = function () {
            $scope.isGameInProgress = true;
            $scope.score = 0;
            $scope.restartGameMessage = DEFAULT_RESTART_GAME_MESSAGE;
            appService.flipCards(true, $scope.gameCards);
            scanGameBoard();
        };

        $scope.restartGame = function () {
            changeToDefaultMessage();
            $scope.isGameInProgress = true;
            $scope.score = 0;
            appService.flipCards(false, $scope.cardsDeck);
            appService.activateCards($scope.cardsDeck, true);
            $scope.gameCards = appService.GetRandomCards($scope.cardsDeck, DEFAULT_CARDS_AMOUNT);
            scanGameBoard();

            $timeout(function () {
                appService.flipCards(true, $scope.gameCards);
            }, 2000);
        };

        $scope.$watch(function () {
            return $scope.gameCards;
        }, function (nValue, oValue) {
            var selectedCards,
                isSET;

            if (!!nValue && nValue !== oValue) {
                selectedCards = appService.getSelectedCards($scope.gameCards);
                if (selectedCards.length === 3) {
                    isSET = appService.isSET(selectedCards);
                    if (isSET) {
                        handleSET(selectedCards);

                    } else {
                        handleNoSET(selectedCards);
                    }
                }
            }
        }, true);
    }

]);