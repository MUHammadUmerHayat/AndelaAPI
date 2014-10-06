'use strict';

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.
var ModalInstanceCtrl = function ($http, $scope, $route, $modalInstance, categories) {

    $scope.categories = categories;
    $scope.data = {};
    $scope.data.category = categories[0];
    $scope.createCategory = false;

    $scope.ok = function () {
        $modalInstance.close('close');
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.createSkillCategory = function(){
        $http.post('/admin/skillCategories', $scope.data).success(function(response) {
            $scope.categories.push(response);
            $scope.createCategory = false;
            $scope.data.name = '';
        }).error(function(response) {
            $scope.error = response.message;
        });
    };

    $scope.createSkill = function(){
        var url = '/admin/skillCategories/' + $scope.data.category._id + '/skills';
        $http.post(url, $scope.data).success(function(response) {

            $route.reload();
        }).error(function(response) {
            $scope.error = response.message;
        });
    };

    $scope.showCreateCategory = function(){
        $scope.createCategory = true;
    };
};



