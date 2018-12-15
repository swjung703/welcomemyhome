var app = angular.module('magazinedetail', []);

app.controller('logincheckCtrl', function ($scope, $http, $window) {
  $scope.load = function () {
    $http.get('/logincheck').success(function (response) {
      if (response.RESULT == "1") {
        $scope.div_login = {
          "width": "12%"
        };
        $scope.showHide_login = true;
      } else if (response.RESULT == "0") {
        var msg = "알수없는 오류로 로그인이 끊겼습니다.";
        $window.alert(msg);
        $window.location.href = '/';
      } else {
        $scope.showHide_logout = true;
      }
    });
  };
});

app.controller('magazinedetailcard', function ($scope, $http, $window) {
  var cookie = document.cookie.split("=");
  var click_idx = cookie[2];
  console.log(document.cookie, "cookie");
  console.log(click_idx, "click_idx");
  $http.get('/getmagazinedetail', {
    params: {
      magazine_idx: click_idx
    }
  }).success(function (response) {
    if (response.RESULT == 1) {
      console.log(response, "success");
      $scope.magazinedetail = response.INFO
      
      console.log($scope.magazinedetail);
      $scope.title = response.INFO.magazine_title;
      document.cookie = "click_idx=";

      /*
              var ol = document.getElementById('ol_indicators');
              for(var i = 0; i < response.INFO.encodedimage.length; i++){
                //<li data-target="#Indicators" data-slide-to="0" class="active">
                var li = document.createElement('li');
                li.setAttribute
              }
      */
    } else {
      console.log(response, "falt");
    }
  }).error(function () {
    console.log(error);
  });

  $scope.pushCommentData = function () {
    console.log($scope.content);
    $http({
      method: 'POST',
      url: '/addmagazinecomment',
      headers: {
        'Content-Type': 'application/json'
      },
      data: ({
        magazine_idx: click_idx,
        content: $scope.content
      })
    }).success(function (response) {
      if (response.RESULT == "1") {
        var msg = "댓글이 등록됐습니다.";
        $window.alert(msg);
        $window.location.href = '/magazines';
      } else if(response.RESULT == "0"){
        var msg = "알 수 없는 오류로 댓글 작성에 실패하였습니다.";
        $window.alert(msg);
        $window.location.href = '/magazines'
      }
    }).error(function () {
      console.log("error");
    });
  }

  $http.get('/getmagazinecomment', {
    params: {
      magazine_idx: click_idx
    }
  }).success(function (response) {
      if (response.RESULT == 1) {
        $scope.comment = response.INFO
        console.log(response.INFO);
      } else {
        console.log(response, "falt");
      }
    }).error(function () {
      console.log(error);
    });
});