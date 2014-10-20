'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$location', 'Authentication', 'Menus', 'anchorSmoothScroll',
    function($scope, $location, Authentication, Menus, anchorSmoothScroll) {
        $scope.authentication = Authentication;
        $scope.user = $scope.authentication;
        $scope.isCollapsed = false;
        $scope.menu = Menus.getMenu('topbar');

        $scope.toggleCollapsibleMenu = function() {
            $scope.isCollapsed = !$scope.isCollapsed;
        };

        // Collapsing the menu after navigation
        $scope.$on('$stateChangeSuccess', function() {
            $scope.isCollapsed = false;
        });

        $("#nav li a").click(function(e) {
            e.preventDefault();
            var $this = $(this);
            var $nav = $(this).parent();
            $nav.siblings('li').removeClass('active');
            $nav.removeClass().addClass('active');
        });

        var scrollTimeout;

        $('a.scroll-top').click(function() {
            $('html,body').animate({
                scrollTop: 0
            }, 500);
            return false;
        });

        $(window).scroll(function() {
            clearTimeout(scrollTimeout);
            if ($(window).scrollTop() > 400) {
                scrollTimeout = setTimeout(function() {
                    $('a.scroll-top:hidden').fadeIn()
                }, 100);
            } else {
                scrollTimeout = setTimeout(function() {
                    $('a.scroll-top:visible').fadeOut()
                }, 100);
            }
        });


        $scope.gotoElement = function(eID) {

            // call $anchorScroll()
            anchorSmoothScroll.scrollTo(eID);
        };
    }
]);
