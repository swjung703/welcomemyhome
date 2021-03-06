var app = angular.module('estimateAnswer', []);

// 화면 전환 시 login check 기능
app.controller('logincheckCtrl', function($scope, $http, $window) {
  $scope.load = function() {
    $http.get('/logincheck').success(function(response) {
      console.log(response.RESULT);
      if (response.RESULT == "1") {
        $scope.div_login = {
          "width": "13%"
        };
        $scope.showHide_login = true;
      } else if (response.RESULT == "2") {
        var msg = "알수없는 오류로 로그인이 끊겼습니다.";
        $window.alert(msg);
        $window.location.href = '/login';
        scope.showHide_logout = true;
      } else {
        var msg = "알수없는 오류가 발생하여 메인페이지로 이동합니다.";
        $window.alert(msg);
        $window.location.href = '/';
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

// 사업자 답변 관련 controller
app.controller('estimateAnswerCtrl', function($scope, $http, $window) {
  var cookie = document.cookie.split("click_idx=");
  var temp_cookie = cookie[1].split("-");
  var click_idx = temp_cookie[0];
    //어느 글의 답변인지 정보 가져오기
    // 답변 등록 기능
    $scope.pushEstimateAnswerData = function() {
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
              url: '/addestimateanswer',
              headers: {
                'Content-Type': 'application/json'
              },
              data: ({
                estimate_idx : click_idx,
                title: $scope.title,
                content: $scope.content,
                image: images
              })
            }).success(function(response) {
              if (response.RESULT == "1") {
                var msg = "답변 작성에 성공하셨습니다.";
                $window.alert(msg);
                $window.location.href = '/estimatelist';
              } else {
                var msg = "알 수 없는 오류로 답변 작성에 실패하였습니다.";
                $window.alert(msg);
                $window.location.href = '/estimatelist';
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
    //estimate answer작성 취소
    $scope.cancelEstimateAnswer = function() {
      var msg = "작성을 취소하여 리스트 페이지로 이동합니다.";
      $window.alert(msg);
      $window.location.href = '/estimatelist';
    };
  });
  