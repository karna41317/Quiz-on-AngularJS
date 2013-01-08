"use strict";

quizApp.controller('QuizCtrl', function QuizCtrl($rootScope, $scope, $resource, $location, quizModel, userModel) {
    $resource('fixtures/questions.json').get(function (data) {
        $scope.quiz = quizModel.initialize(data);
        $scope.currentPosition = -1;

        $scope.user = userModel.initialize($rootScope.userName);

        if ($scope.quiz.isRandom) {
            $scope.quiz.questionnaire = $scope.shuffle($scope.quiz.questionnaire);
        }

        $rootScope.$on('timer_ended', function () {
            $scope.next();
        });

        $scope.updatePage();
    });

    $scope.hasNext = function () {
        return !($scope.currentPosition >= $scope.quiz.questionnaire.length - 1);
    };

    $scope.updatePage = function () {
        $scope.currentQuestion = $scope.quiz.questionnaire[++$scope.currentPosition];
    };

    $scope.submitAns = function (id) {
        var question = $scope.quiz.questionnaire.filter(function (value) {
            return value.id === id;
        });

        if ($scope.currentResponse === question[0].answer) {
            $scope.user.correct = $scope.user.correct + 1;
            $scope.user.score = $scope.user.score + question[0].weightage;
        }
        $scope.next();
    };

    $scope.shuffle = function (arg) {
        for (var j, x, i = arg.length; i; j = parseInt(Math.random() * i), x = arg[--i], arg[i] = arg[j], arg[j] = x);
        return arg;
    };

    $scope.isAnswered = function () {
        return ($scope.currentResponse !== "" && $scope.currentResponse !== undefined)
    };

    $scope.next = function () {
        var valid = $scope.hasNext();
        if (valid === true) {
            $scope.currentResponse = "";
            $scope.updatePage();
            $rootScope.$broadcast('restart_timer');
        } else {
            $rootScope.$broadcast('game_over');
            $rootScope.quizSize = $scope.quiz.questionnaire.length;
            $rootScope.user = $scope.user;
            $location.path('/result');
        }
    };

    $scope.quit = function () {
        $rootScope.userName = "";
        $location.path('/');
    };
});
