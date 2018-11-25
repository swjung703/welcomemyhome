var app = angular.module('Main', []);

// 화면 전환 시 login check 기능
app.controller('logincheckCtrl', function($scope, $http, $window) {
  $scope.load = function() {
    $http.get('/logincheck').success(function(response) {
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

// estimate 제출 시 정보 서버로 보내는 기능
app.controller('estimateCtrl', function($scope, $http, $window) {
  $scope.pushEstimateData = function() {


    var images = [];
    //    var files = input.files;
//    let flag = true;

    var recourcive = function(index){
      var input = document.getElementById('fileselector');
      let fr = new FileReader();
      fr.readAsDataURL(input.files[index]);
      fr.onload = function() {
        let str = fr.result.split(',')[1];
        let image = {
          image: str
        };
        images.push(image);

        console.log(index, input.files.length);
        if(index == input.files.length){
          console.log(JSON.stringify(images));
          /*
          $http({
            method: 'POST',
            url: '/addestimate',
            headers: {
              'Content-Type': 'application/json'
            },
            data: ({
              title: $scope.title,
              address: $scope.address,
              content: $scope.content,
              image: images
            })
          }).success(function(response) {
            if (response.RESULT == "1") {
              var msg = "견적 작성에 성공하셨습니다.";
              $window.alert(msg);
              $window.location.href = '/estimatelist';
            } else {
              var msg = "알 수 없는 오류로 견적 작성에 실패하였습니다.";
              $window.alert(msg);
            }
          }).error(function() {
            console.log("error");
          });
          */
        } else {
          recourcive(index+1);
        }

      }


    }

    recourcive(0);
    /*
    for (var i = 0; i < input.files.length; i++) {

      fr.onload = function() {
        let str = fr.result.split(',')[1];
        let image = {
          image: str
        };
        images.push(image);

        console.log("heooooo",i,input.files.length);
        if (flag) {
          flag = false;
          console.log(images);
          console.log(JSON.stringify(images));

          $http({
            method: 'POST',
            url: '/addestimate',
            headers: {
              'Content-Type': 'application/json'
            },
            data: ({
              title: $scope.title,
              address: $scope.address,
              content: $scope.content,
              image: images
            })
          }).success(function(response) {
            if (response.RESULT == "1") {
              var msg = "견적 작성에 성공하셨습니다.";
              $window.alert(msg);
              $window.location.href = '/estimatelist';
            } else {
              var msg = "알 수 없는 오류로 견적 작성에 실패하였습니다.";
              $window.alert(msg);
            }
          }).error(function() {
            console.log("error");
          });
        }
      }
    }*/
    //    fr = JSON.stringify(encodedimage);
  }
  //estimate 작성 취소
  $scope.cancelEstimate = function() {
    var msg = "작성을 취소하여 리스트 페이지로 이동합니다.";
    $window.alert(msg);
    $window.location.href = '/estimatelist';
  };
});

// Estimate answer 작성 취소
app.controller('estimateAnswerCtrl', function($scope, $window) {
  $scope.cancelEstimateAnswer = function() {
    var msg = "작성을 취소하여 리스트 페이지로 이동합니다.";
    $window.alert(msg);
    $window.location.href = '/estimatelist';
  };
});


// Estimate list 출력
app.controller('estimateListCtrl', function($scope, $http, $window) {
  $scope.currentPage = 1;
  $scope.pageSize = 5;
  var cookie_auth = document.cookie.split("%2F");
  var cookie_user = document.cookie.substring(0, 8).split("=");
  var auth = cookie_auth[1];
  var usercheck = cookie_user[1];
  var offset = ($scope.currentPage - 1) * 5;
  var total;
  var total_user;
  var total_my;
  var data_user;
  var data_my;
  // auth(사용자, 사업자)에 따른 list 변화
  if (auth == "0") { // 사용자
    $scope.HideUser = true;
    $http.get('/getestimatelist', {
      params: {
        offset: offset
      }
    }).success(function(response) {
      if (response.RESULT == 1) {
        $scope.data = response.INFO;
        total = 10; // response.total;
      } else {
        var msg = "알 수 없는 에러로 나의 견적 요청 리스트를 불러 올 수 없습니다.";
        $window.alert(msg);
        $window.location.href = '/';
      }
    });
  } else if (auth == "1") { // 사업자
    $scope.answercount = true;
    $http.get('/getestimatelist', {
      params: {
        offset: offset
      }
    }).success(function(response) {
      if (response.RESULT == 1) {
        data_user = response.INFO;
        $scope.data = data_user;
        total_user = 10; // response.total_user;
        total = total_user;
      } else {
        var msg = "알 수 없는 에러로 사용자 견적 리스트를 불러 올 수 없습니다.";
        $window.alert(msg);
        $window.location.href = '/';
      }
    });
    $http.get('/getestimateanswerlist', {
      params: {
        offset: offset
      }
    }).success(function(response) {
      if (response.RESULT == 1) {
        data_my = response.INFO;
        total_my = 15; // response.total_my
        total = total_my;
      } else {
        var msg = "알 수 없는 에러로 답변 리스트를 불러 올 수 없습니다.";
        $window.alert(msg);
        $window.location.href = '/';
      }
    });
  } else { //로그인 안 했을 시
    var msg = "User 정보가 명확치 않습니다. 로그인을 해주세요";
    $window.alert(msg);
    $window.location.href = '/';
  }
  $scope.numberOfPages = function() {
    return Math.ceil(total / $scope.pageSize);
  };
  $scope.viewUserWrite = function() {
    console.log(data_user, "user");
    console.log(total_user, "total");
    $scope.data = data_user;
    total = total_user;
  };
  $scope.viewMyWrite = function() {
    console.log(data_my, "user2");
    console.log(total_my, "total2");
    $scope.data = data_my;
    total = total_my;
  };
  $scope.check = function() {
    //if() {
    //$window.location.href = "/estimateanswer";
    //} else if(auth == 1 ) {
    $window.location.href = "/estimatedetail";
    //}
  };
});

app.controller('estimatedetailCtrl', function($scope, $http, $window) {
  $http.get('/getestimatedetail', {
    params: {
      estimate_idx: "55"
    }
  }).success(function(response) {
    if (response.RESULT == 1) {
      $scope.title = response.INFO.estimate_title;
      $scope.date = response.INFO.estimate_date;
      $scope.address = response.INFO.estimate_address;
      $scope.content = response.INFO.estimate_content;
      $scope.image = response.INFO.encodedimage;
      console.log(response.INFO.encodedimage, "encodedimage");
      console.log($scope.image, "image");
    } else {
      var msg = "알 수 없는 에러로 detail 페이지를 불러 올 수 없습니다.";
      $window.alert(msg);
      $window.location.href = '/estimatelist';
    }
  }).error(function() {
    console.log("error");
  });
});
