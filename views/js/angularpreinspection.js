var app = angular.module('preinspection', []);

app.factory('clones', function () {
    var cloneCount = 0;
    var pin_info = {
        id: null,
        x: null,
        y: null
    };
    var pin_arr = new Array();
    var cloneService = {};

    cloneService.setcloneCount = function (Count) {
        cloneCount = Count;
    }

    cloneService.getcloneCount = function () {
        return cloneCount;
    }

    cloneService.setPinInfo = function (pininfo) {
        pin_info.id = pininfo.id;
        pin_info.x = pininfo.x;
        pin_info.y = pininfo.y;
    }

    cloneService.getPinInfo = function () {
        return pin_info;
    }

    cloneService.Countup = function () {
        cloneCount ++;
    }

    cloneService.getPinArray = function (count) {
        return pin_arr[count];
    }

    return cloneService;
});

app.controller('logincheckCtrl', function ($scope, $http, $window) {
    var cookie_auth = document.cookie.split("%2F");
    var auth = cookie_auth[1];
    $scope.load = function () {
        if (auth == 0) {
            $http.get('/logincheck').success(function (response) {
                console.log(response.RESULT);
                if (response.RESULT == "1") {
                    $scope.div_login = {
                        "width": "13%"
                    };
                    $scope.showHide_login = true;
                } else if (response.RESULT == "2") {
                    var msg = "사전점검은 로그인후에 이용가능합니다.";
                    $window.alert(msg);
                    $window.location.href = '/login';
                } else {
                    var msg = "알수없는 오류가 발생하여 메인페이지로 이동합니다.";
                    $window.alert(msg);
                    $window.location.href = '/';
                    $scope.showHide_logout = true;
                }
            })
        }
        else if (auth == 1) {
            var msg = "사전점검은 사용자만 가능합니다"
            $window.alert(msg);
            $window.location.href = '/';
        }
        else {
            var msg = "사전점검은 로그인후에 이용가능합니다.";
            $window.alert(msg);
            $window.location.href = '/login';
        }
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

app.controller('preinspectionCtrl', function ($scope, $http, $window, clones) {
    var pin_img = new Array();
    var pin_arr = new Array();
    var cloneCount = 0;

    // 도면 이미지 받아오기
    $http.get('/getpreinspectionblueprint').success(function (response) {
        if (response.RESULT == "1") {
            $scope.image = response.INFO.encodedimage[0];
            preinspection_idx = response.INFO.preinspection_idx;
             // 핀 정보 받아오기
            $http.get('/getpreinspectionpin', {
                params: {
                  preinspection_idx: response.INFO.preinspection_idx
                }
              }).success(function (response) {
                if (response.RESULT == "1") {
                    total = response.INFO.length;

                    for(count=0; count<total; count++){
                        console.log(count);
                        temp_x = response.INFO[count].pin_X;
                        temp_y = response.INFO[count].pin_Y;
                        temp_idx = response.INFO[count].pin_idx;
                        console.log(temp_idx);
                        pin_img[count] = $('.pin-img').clone();
                        $("#my_pin").after(pin_img[count].draggable());
                        pin_img[count].attr({"name": temp_idx});
                        pin_img[count].css({
                            'position': 'absolute',
                            'z-index': '5',
                            'left' : temp_x,
                            'top' : temp_y
                        });
                        $(".pin-img").click(function (event) {
                            $http.get('/getpreinspectionmodal', {
                                params: {
                                    pin_idx: $(this).attr("name")
                                }
                            }).success(function (response) {
                                if (response.RESULT == "1") {
                                    console.log(response.INFO);
                                    $scope.content = response.INFO.pin_content;
                                    $scope.type = response.INFO.pin_type;
                                    $scope.encoded_image_modal = response.INFO.encodedimage;
                                    var src = "data:image/jpg;base64," + response.INFO.encodedimage;
                                    var img_modal = $('#img-modal');
                                    if(img_modal){
                                        img_modal.remove();
                                    }
                                    $("#check").val($scope.type);
                                    $("#content").val($scope.content);
                                    $("<img>").attr({"width": "500", "height": "300", "id": "img-modal", "src": src}).appendTo("#append");
                                    
                                } else {
                                    var msg = "핀 정보를 불러 올 수 없습니다.";
                                    $window.alert(msg);
                                    $window.location.href = '/';
                                }
                            }).error(function () {
                                console.log("error");
                            });
                            $("#dialog").css({
                                'display': 'block'
                            });
                        });
                        $(".close").click(function () {
                            $("#dialog").css({
                                'display': 'none'
                            });
                        });
                        $("html").click(function (event) {
                            if (event.target.id === "dialog") {
                                console.log(event.target);
                                $("#dialog").css({
                                    'display': 'none'
                                });
                            }
                        });
                    }
                } else {
                    var msg = "핀 정보를 불러 올 수 없습니다.";
                    $window.alert(msg);
                    $window.location.href = '/';
                }
            }).error(function () {
                console.log("error");
            });
        } else {
            var msg = "알 수 없는 에러로 preinspection 페이지를 불러 올 수 없습니다.";
            $window.alert(msg);
            $window.location.href = '/';
        }
    }).error(function () {
        console.log("error");
    });

    // 핀 정보 받아서 도면위에 찍기


    // 핀 이동해서 찍기
    $(function () {
        // pin img 복사 이동
        $('.pin-img').draggable({ helper: "clone", cursorAt: { top: 0, left: 15 } });
        // drop 이벤트
        $('.pin-img').bind('dragstop', function (event, ui) {
            var pin_info = {
                // id: null,
                x: null,
                y: null
            }
            pin_img[cloneCount] = $(ui.helper).clone();
            $(this).after(pin_img[cloneCount].draggable());
            // pin_img[cloneCount].attr("id", "pin" + cloneCount);
            pin_info.x = pin_img[cloneCount].offset().left;
            pin_info.y = pin_img[cloneCount].offset().top;
            // pin_info.id = cloneCount;
            pin_img[cloneCount].css({
                'z-index': '5'
            });
            $("#check").val('');
            $("#content").val('');
            $("#img-modal").remove();
            $("#dialog").css({
                'display': 'block'
            });
            pin_arr[cloneCount] = pin_info;
            cloneCount++;
            //pin 클릭시 모듈 정보 다시 띄우기
            $(".pin-img").click(function () {
                if($(this).attr("name")) {
                    $http.get('/getpreinspectionmodal', {
                        params: {
                            pin_idx: $(this).attr("name")
                        }
                    }).success(function (response) {
                        if (response.RESULT == "1") {
                            console.log(response.INFO);
                            $scope.content = response.INFO.pin_content;
                            $scope.type = response.INFO.pin_type;
                            $scope.encoded_image_modal = response.INFO.encodedimage;
                            var src = "data:image/jpg;base64," + response.INFO.encodedimage
                            $scope.hideimg=false;
                            console.log($scope.hideimg, "보이기")
                            if(img_modal){
                                img_modal.remove();
                            }
                            $("#check").val($scope.type);
                            $("#content").val($scope.content);
                            $("<img>").attr({"width": "500", "height": "300", "id": "img-modal", "src": src}).appendTo("#append");
                        } else {
                            var msg = "핀 정보를 불러 올 수 없습니다.";
                            $window.alert(msg);
                            $window.location.href = '/';
                        }
                    }).error(function () {
                        console.log("error");
                    });
                    console.log("click");
                    $("#dialog").css({
                        'display': 'block'
                    });
                }
                else {
                    console.log("click");
                    $("#dialog").css({
                        'display': 'block'
                    });
                }
            });
        });
        $(".close").click(function () {
            $("#dialog").css({
                'display': 'none'
            });
        });
        $("html").click(function (event) {
            if (event.target.id === "dialog") {
                $("#dialog").css({
                    'display': 'none'
                });
            }
        });
    });


    // modal에서 데이터 제출
    $scope.pushpreinspectionData = function () {
        var images = [];
        console.log(pin_arr, "check");
        var recourcive = function (index) {
            var input = document.getElementById('fileselector');
            var fr = new FileReader();
            fr.readAsDataURL(input.files[index]);
            fr.onload = function () {
                var str = fr.result.split(',')[1];
                var image = {
                    image: str
                };
                images.push(image);
                if (index == input.files.length - 1) {
                    console.log(JSON.stringify(images).substring(0.10));
                    console.log(cloneCount, "clone");
                    console.log(pin_arr, "pin");
                    console.log(pin_arr[0], "pin[0]");
                    console.log($scope.type);
                    $http({
                        method: 'POST',
                        url: '/addpreinspectionmodal',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: ({
                            preinspection_idx: preinspection_idx,
                            type: $scope.type,
                            content: $scope.content,
                            pin_x: pin_arr[cloneCount-1].x,
                            pin_y: pin_arr[cloneCount-1].y,
                            image: images
                        })
                    }).success(function (response) {
                        if (response.RESULT == "1") {
                            var msg = "사전점검을 등록하셨습니다.";
                            $window.alert(msg);
                            $window.location.href = '/preinspection';
                            pin_arr[cloneCount].attr({"name": response.RESULT})
                        } else {
                            var msg = "알 수 없는 오류로 사전점검 등록에 실패하였습니다.";
                            $window.alert(msg);
                            $window.location.href = '/preinspection';
                        }
                    }).error(function () {
                        console.log("error");
                    });
                } else {
                    recourcive(index + 1);
                }
            }
        };
        recourcive(0);
    };
});