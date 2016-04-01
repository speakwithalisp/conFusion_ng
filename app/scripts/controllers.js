'use strict';
angular.module('confusionApp')
    .controller('MenuController', ['$scope', 'menuFactory', function($scope, menuFactory) {
            
            $scope.tab = 1;
            $scope.filtText = '';
        $scope.showDetails = false;
        $scope.showMenu = false;
        $scope.message= "Loading...";
        $scope.dishes = menuFactory.getDishes().query(function(response) {
                    $scope.dishes = response;
                    $scope.showMenu = true;
                },
                function(response) {
                    $scope.message = "Error: "+response.status + " " + response.statusText;
                });
                        
            $scope.select = function(setTab) {
                $scope.tab = setTab;
                
                if (setTab === 2) {
                    $scope.filtText = "appetizer";
                }
                else if (setTab === 3) {
                    $scope.filtText = "mains";
                }
                else if (setTab === 4) {
                    $scope.filtText = "dessert";
                }
                else {
                    $scope.filtText = "";
                }
            };

            $scope.isSelected = function (checkTab) {
                return ($scope.tab === checkTab);
            };
    
            $scope.toggleDetails = function() {
                $scope.showDetails = !$scope.showDetails;
            };
        }])

        .controller('ContactController', ['$scope', function($scope) {

            $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
            
            var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];
            
            $scope.channels = channels;
            $scope.invalidChannelSelection = false;
                        
        }])

    .controller('FeedbackController', ['$scope', 'feedbackFactory',function($scope, feedbackFactory) {
        $scope.message = "Loading...";
        $scope.hasError = false;
        $scope.sendFeedback = function() {
                
                console.log($scope.feedback);
                
                if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
                    $scope.invalidChannelSelection = true;
                    console.log('incorrect');
                }
                else {
                    feedbackFactory.getFeedback().save({feedback: $scope.feedback})
                        .$promise.then(
                            function(response){
                                $scope.hasError = false;
                                console.log(response);
                                $scope.invalidChannelSelection = false;
                                $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
                                $scope.feedback.mychannel="";
                                $scope.feedbackForm.$setPristine();
                            },
                            function(response){
                                $scope.hasError = true;
                                $scope.message = "Error: "+response.status + " " + response.statusText;
                        
                    });
                }
            };
        }])

    .controller('DishDetailController', ['$scope', 'menuFactory', '$stateParams', function($scope, menuFactory,$stateParams) {

        $scope.showDish = false;
        $scope.message="Loading...";
        $scope.dish = menuFactory.getDishes().get({id:parseInt($stateParams.id,10)})
            .$promise.then(
                  function(response) {
                      $scope.dish= response;
                      $scope.showDish= true;
                  },
                function(response) {
                    $scope.message = "Error: "+response.status + " " + response.statusText;
                }
                
            );
            
        }])

    .controller('DishCommentController', 'menuFactory', ['$scope', function($scope,menuFactory) {
            
            //Step 1: Create a JavaScript object to hold the comment from the form
            $scope.feedback = {name: "", myRating:5};
            $scope.ratings = [1,2,3,4,5];
            
            $scope.submitComment = function () {
                $scope.feedback.date = new Date().toISOString();
                console.log($scope.feedback);
                var pushComment = {rating:$scope.feedback.myRating,
                                   comment:$scope.feedback.comment,
                                   author:$scope.feedback.name,
                                   date:$scope.feedback.date};
                
                //Step 2: This is how you record the date
//                "The date property of your JavaScript object holding the comment" = new Date().toISOString();
                
                // Step 3: Push your comment into the dish's comment array
                $scope.dish.comments.push(pushComment);
                
                menuFactory.getDishes().update({id:$scope.dish.id},$scope.dish);
                //Step 4: reset your form to pristine
                $scope.feedback = {name:"", myRating:5, comment:"" };
                $scope.commentForm.$setPristine();
                console.log($scope.feedback);
                //Step 5: reset your JavaScript object that holds your comment
            };
        }])
    .controller('IndexController',['$scope', 'menuFactory', 'corporateFactory', function($scope, menuFactory, corporateFactory){
        $scope.showDish = false;
        $scope.message = "Loading...";
        $scope.dish = menuFactory.getDishes().get({id:0})
            .$promise.then(
              function(response) {
                    $scope.dish= response;
                    $scope.showDish = true;
                },
                function(response) {
                    $scope.message = "Error: "+response.status + " " + response.statusText;
                }

            );
        $scope.showChef = false;
        $scope.chef = corporateFactory.getLeaders().get({id:3})
            .$promise.then(function(response){
                $scope.showChef = true;
                $scope.chef = response;
                
            },
                           function(response){
                               $scope.message = "Error: "+response.status + " " + response.statusText;
                           });
        $scope.showPromo = false;
        $scope.promotion = menuFactory.getPromotion().get({id:0})
            .$promise.then(
                function(response){
                    $scope.promotion = response;
                    $scope.showPromo = true;
                    
                },
                function(response){
                    $scope.message = "Error: "+response.status + " " + response.statusText;
                }
            );
        
    }])
    .controller('AboutController',['$scope', 'corporateFactory', function($scope, corporateFactory){
        $scope.showLeaders = false;
        $scope.message = "Loading...";
        $scope.leaders = corporateFactory.getLeaders().query(function(response){
            $scope.leaders = response;
            $scope.showLeaders = true;
        },
        function(response){
                    $scope.message = "Error: "+response.status + " " + response.statusText;
        });
        
    }])

;






