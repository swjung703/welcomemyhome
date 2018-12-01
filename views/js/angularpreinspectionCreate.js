var app = angular.module('preinspectionCreate', []);

app.controller('logincheckCtrl', function ($scope, $http, $window) {
    $scope.load = function () {
        $http.get('/logincheck').success(function (response) {
            console.log(response.RESULT);
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

app.controller('preinspectionCreateCtrl', function ($scope, $http, $window) {
    // preinspection 작성 취소
    $scope.cancelpreinspectionCreate = function () {
        var msg = "작성을 취소하여 사전 점검로 이동합니다.";
        $window.alert(msg);
        $window.location.href = '/preinspection';
    };

    // preinspection 도면 등록
    $scope.pushpreinspectionData = function () {
        var input = document.getElementById('fileselector');
        var fr = new FileReader();
        fr.readAsDataURL(input.files[0]);
        fr.onload = function() {
            var str = fr.result.split(',')[1];
            console.log(str);
            var image= {
                image: str
            };
        };
        $http({
            method: 'POST',
            url: '/addpreinspectionimg',
            headers: {
              'Content-Type': 'application/json'
            },
            data: ({
              image: image
            })
          }).success(function(response) {
            if (response.RESULT == "1") {
              var msg = "도면 등록에 성공하셨습니다.";
              $window.alert(msg);
              $window.location.href = '/preinspection';
            } else {
              var msg = "알 수 없는 오류로 도면 등록에 실패하였습니다.";
              $window.alert(msg);
              $window.location.href='/preinspection'
            }
          }).error(function() {
            console.log("error");
          });
    };
});