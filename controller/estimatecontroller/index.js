var estimatedao = require('../../dao/estimatedao');
var estimatedto = require('../../dto/estimatedto');
var async = require('async');
var fs = require('fs');
var mkdirp = require('mkdirp');
require('date-utils');

/********************
        GET
********************/
exports.getestimatelist = function (request, response) {
    var req_user_check = request.body.check;
    var req_offset = request.param('offset');
    var info = [];
    async.waterfall([
        function (nextCallback) {
            if (req_user_check == "1") {
                estimatedao.getestimatelistforuser(req_offset, request.session.user_idx, nextCallback);
            } else {
                estimatedao.getestimatelist(req_offset, nextCallback);
            }
        }
    ], function (error, result) {
        if (error) {
            console.log(error);
            response.json({
                RESULT: "0"
            });
        } else {
            response.json({
                RESULT: "1"
                , INFO: result
            });
        }
    });
};
exports.getestimatedetail = function (request, response) {
    var req_estimate_idx = request.param('estimate_idx');
    var info = {};
    async.waterfall([
        function (nextCallback) {
            estimatedao.getestimatedetail(req_estimate_idx, nextCallback);
        }, function (estimatedata, nextCallback) {
            var encodedimage = [];
            var count = 0;
            estimatedata[0].estimate_picture_path = estimatedata[0].estimate_picture_path.split(',');
            async.whilst(function () {
                return count < (estimatedata[0].estimate_picture_path.length - 1);
            }, function (callback) {
                fs.readFile(estimatedata[0].estimate_picture_path[count], function (error, data) {
                    encodedimage.push(new Buffer(data).toString('base64'));
                    count++;
                    callback();
                });
            }, function (error) {
                if (error) {
                    console.log(error);
                    response.json({
                        RESULT: "0"
                    });
                } else {
                    info = estimatedata[0];
                    nextCallback();
                }
            });
        }
    ], function (error) {
        if (error) {
            console.log(error);
            response.json({
                RESULT: "0"
            });
        } else {
            response.json({
                RESULT: "1"
                , INFO: info
            });
        }
    });
};
exports.getestimateanswerlist = function (request, respon) {

};

/********************
        POST
********************/
exports.addestimate = function (request, response) {
    var req_user_idx = request.session.user_idx;
    var req_user_nickname = request.session.user_nickname;
    var req_estimate_title = request.body.title;
    var req_estimate_content = request.body.content;
    var req_estimate_image = request.body.image;
    var date = new Date();
    date = date.toFormat('YYYY-MM-DD HH24:MI:SS');
    var dirdate = new Date();
    dirdate = dirdate.toFormat("YYYYMMDDHH24MISS");
    var imagepath = '';
    var thumbnailpath = '';
    var dirname = "./public/" + req_user_nickname + "/estimate";
    var newPath;
    async.waterfall([
        function (nextCallback) {
            mkdirp(dirname, nextCallback);
        }, function (url, nextCallback) {
            dirname = dirname + "/" + dirdate;
            mkdirp(dirname, nextCallback);
        }, function (url, nextCallback) {
            count = 0;
            async.whilst(function () {
                return count < req_estimate_image.length;
            }, function (callback) {
                var bitmap = new Buffer(req_estimate_image[count].image, 'base64');
                newPath = dirname + "/" + dirdate + "_" + count + ".png";
                imagepath = imagepath + newPath + ',';
                count++;
                fs.writeFile(newPath, bitmap, 'base64', callback);
            }, function (error) {
                if (error) {
                    console.log(error);
                    response.json({
                        RESULT: "0"
                    });
                } else {
                    estimatedto.estimate(req_user_idx, req_estimate_title, req_estimate_content, date, imagepath, 0, nextCallback);
                }
            });
        }, function (estimate, nextCallback) {
            estimatedao.addestimate(estimate, nextCallback);
        }
    ], function (error) {
        if (error) {
            console.log(error);
            response.json({
                RESULT: "0"
            });
        }
        else {
            response.json({
                RESULT: "1"
            });
        }
    });
};

exports.addestimateanswer = function (request, response) {
    var req_user_idx = request.session.user_idx;
    var req_estimate_idx = request.body.estimate_idx;
    var req_user_nickname = request.session.user_nickname;
    var req_estimate_content = request.body.content;
    var req_estimate_image = request.body.image;
    var date = new Date();
    date = date.toFormat('YYYY-MM-DD HH24:MI:SS');
    var dirdate = new Date();
    dirdate = dirdate.toFormat("YYYYMMDDHH24MISS");
    var imagepath = '';
    var thumbnailpath = '';
    var dirname = "./public/" + req_user_nickname + "/estimate";
    var newPath;
    async.waterfall([
        function (nextCallback) {
            mkdirp(dirname, nextCallback);
        }, function (url, nextCallback) {
            dirname = dirname + "/" + dirdate;
            mkdirp(dirname, nextCallback);
        }, function (url, nextCallback) {
            count = 0;
            async.whilst(function () {
                return count < req_estimate_image.length;
            }, function (callback) {
                var bitmap = new Buffer(req_estimate_image[count].image, 'base64');
                newPath = dirname + "/" + dirdate + "_" + count + ".png";
                imagepath = imagepath + newPath + ',';
                count++;
                fs.writeFile(newPath, bitmap, 'base64', callback);
            }, function (error) {
                if (error) {
                    console.log(error);
                    response.json({
                        RESULT: "0"
                    });
                } else {
                    estimatedto.estimateanswer(req_user_idx, req_estimate_idx, req_estimate_content, date, imagepath, nextCallback);
                }
            });
        }, function (estimate, nextCallback) {
            estimatedao.addestimateanswer(estimate, nextCallback);
        }, function (nextCallback) {
            estimatedao.editanswercount(req_estimate_idx);
        }
    ], function (error) {
        if (error) {
            console.log(error);
            response.json({
                RESULT: "0"
            });
        }
        else {
            response.json({
                RESULT: "1"
            });
        }
    });
};