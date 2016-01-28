'use strict';

angular.module('sywStyleXApp')
.controller('DiscoverCtrl', ['$scope', '$compile', '$timeout', 'UtilityService', 'UserMediaService', function($scope, $compile, $timeout, UtilityService, UserMediaService) {
  var apiLocker = false;
  var pageNumber = 0;
  var indexMarker = -1;
  $scope.activePost = -1;
  $scope.showcaseCounter = 3;
  $scope.hasMoreData = true;
  $scope.discoverMedias = [];

  var getDiscoverPosts = function() {
    if (apiLocker) {
      return;
    }

    apiLocker = true;

    UserMediaService.getLatestMedia(pageNumber).then(function(result) {
      if (UtilityService.validateResult(result)) {

        if (result.data.payload.MEDIAS.length === 0) {
          $scope.hasMoreData = false;
        } else {
          if (pageNumber == 0) {
            var firstDiscoverMedia = result.data.payload.MEDIAS[0];
            $timeout(function() {
              $scope.invokeDiscoverShowcase(firstDiscoverMedia, 0);
            }, 10);
          }

          pageNumber++;
          $scope.hasMoreData = true;
          var discoverMedias = result.data.payload.MEDIAS;
          $scope.discoverMedias.push.apply($scope.discoverMedias, discoverMedias);
        }
      } else {
        $scope.hasMoreData = false;
        console.log('error');
      }

      apiLocker = false;
    });
  };

  $scope.loadMore = function() {
    if (!$scope.hasMoreData) {
      return;
    }
    getDiscoverPosts();
  };

  $scope.invokeDiscoverShowcase = function(discoverMedia, index) {
    var docWidth = $('.fount-discover-page .page-content').width();

    if (docWidth <= 598 || index == indexMarker) {
      return;
    }

    indexMarker = index;
    $scope.activePost = -1;
    $('#discover-only-showcase').remove();
    if (!!discoverMedia.products) {
      $scope.showcaseProducts = discoverMedia.products;
      var appendContent = angular.element('<div fount-discover-showcase showcase-products="showcaseProducts" id="discover-only-showcase"></div>');
      $compile(appendContent)($scope);
      var appendIndex = 4 * Math.floor(index/4) + 3;
      if (docWidth <= 767) {
        appendIndex = 3 * Math.floor(index/3) + 2;
      }
      var beforeContent = $('#fount-showcase-post_' + appendIndex);
      beforeContent.after(appendContent);
      $scope.activePost = index;
    }
  };

  getDiscoverPosts();

}]);
