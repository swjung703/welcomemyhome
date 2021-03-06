var app = angular.module('communityposting', []);

app.controller('logincheckCtrl', function ($scope, $http, $window) {
    $scope.load = function () {
      $http.get('/logincheck').success(function (response) {
        console.log(response.RESULT);
        if (response.RESULT == "1") {
          $scope.div_login = {
            "width": "13%"
          };
          $scope.showHide_login = true;
        } else if (response.RESULT == "0") {
          var msg = "알수없는 오류로 로그인이 끊겼습니다.";
          $window.alert(msg);
          $window.location.href = '/';
        } else {
          var msg = "로그인 후 이용할 수 있습니다.";
          $window.alert(msg);
          $window.location.href = '/community';
          $scope.showHide_logout = true;
        }
      });
    };
    $scope.logout = function() {
      $http.get('/logout').success(function(response) {
        console.log(response.RESULT);
        if (response.RESULT == "1") {
          var msg = "로그아웃되었습니다.";
          $window.alert(msg);
          $window.location.href = '/';
          $scope.showHide_logout = true;
        }
      }).error(function(){
        console.log(error);
      });
    };
  });

  app.controller('communityPostingCtrl', function($scope, $http, $window) {
    $scope.pushCommunityData = function() {
      var images = [];
  
      var recourcive = function(index) {
        var input = document.getElementById('fileselector');
        var fr = new FileReader();
        fr.readAsDataURL(input.files[index]);
        fr.onload = function() {
          var str = fr.result.split(',')[1];
          var image = {
            image: str
          };
          images.push(image);
          if (index == input.files.length - 1) {
            console.log(JSON.stringify(images));
            $http({
              method: 'POST',
              url: '/addcommunity',
              headers: {
                'Content-Type': 'application/json'
              },
              data: ({
                title: $scope.title,
                content: $scope.content,
                image: images
              })
            }).success(function(response) {
              if (response.RESULT == "1") {
                var msg = "글이 등록됐습니다.";
                $window.alert(msg);
                $window.location.href = '/community';
              } else {
                var msg = "알 수 없는 오류로 글 작성에 실패하였습니다.";
                $window.alert(msg);
                $window.location.href='/community'
              }
            }).error(function() {
              console.log("error");
            });
          } else {
            recourcive(index + 1);
          }
        }
      }
      recourcive(0);
    }
    //작성 취소
    $scope.cancelPosting = function() {
      var msg = "작성을 취소하여 리스트 페이지로 이동합니다.";
      $window.alert(msg);
      $window.location.href = '/community';
    };
  });