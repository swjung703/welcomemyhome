var dao = require('../../dao/mypagedao');
var dto = require('../../dto/mypagedto');
var async = require('async');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var mkdirp = require('mkdirp');
var fs = require('fs');
require('date-utils');

/********************
        GET
********************/
exports.logincheck = function (request, response) {
	if (typeof request.cookies.token != 'undefined') {
		var checkData = request.cookies.token.split('/');
		if (typeof request.session.check_status == 'undefined') {
			response.json({
				RESULT: "2"
			});
		} else if (checkData[0] == request.session.user_idx && checkData[2] == request.sessionID) {
			response.json({
				RESULT: "1",
				auth: request.session.user_auth
			});
		} else {
			response.json({
				RESULT: "0"
			});
		}
	} else {
		response.json({
			RESULT: "2"
		});
	}
};

exports.nicknamecheck = function (request, response) {
	var req_user_nickname = request.param("user_nickname");
	async.waterfall([
		function (nextCallback) {
			dao.getnicknamecheck(req_user_nickname, nextCallback);
		}
	], function (error, result) {
		if (error) {
			console.log(error);
			response.json({
				RESULT: "0"
			});
		} else if (result.length != 0) {
			response.json({
				RESULT: "1"
			});
		} else {
			response.json({
				RESULT: "2"
			});
		}
	});
};

exports.logout = function (request, response) {
	request.session.destroy(
		function (error) {
			if (error) {
				console.log(error);
				response.json({
					RESULT: "0"
				});
			} else {
				response.json({
					RESULT: "1"
				});
			}
		}
	)
};

/********************
        POST
********************/
exports.mypagepwcheck = function (request, response) {
	var req_user_pw = request.body.pw;
	async.waterfall([
		function (nextCallback) {
			dao.getpwcheck(req_user_pw, nextCallback);
		}, function (data, nextCallback) {
			if (data.length == 0) {
				nextCallback("NO PW", null, 2)
			} else {
				nextCallback(undefined, data);
			}
		}, function (data, nextCallback) {
			if (data[0].user_pw == req_user_pw) {
				response.json({
                    RESULT: "1"
                });
			} else {
				nextCallback("WRONG PW", null, 3);
			}
		}
	], function (error, result, fail) {
		if (error) {
			response.json({
				RESULT: fail
			});
		} else {
			response.json({
				RESULT: "1"
			});
		}
	});
};

exports.mypagesetting = function (request, response) {

	console.log(request.session);

	var req_user_picture = request.body.image;
	var req_user_pw = request.body.pw;
	var req_user_nickname = request.body.nickname;
	var dirname = './public/user/' + req_user_nickname;

	async.waterfall([
		function (nextCallback) {
			mkdirp(dirname, nextCallback);
		}, function (url, nextCallback) {
			async.waterfall([
				function (nextCallback) {
					var bitmap = new Buffer(req_user_picture, 'base64');
					newPath = dirname + "/" + req_user_nickname  +  ".jpg";
					fs.writeFile(newPath, bitmap, 'base64', callback);
					nextCallback(null);
				},
				function (nextCallback) {
					dao.edituserthumbnail(dir, request.session.user_idx);
					nextCallback(null);
				},
				function (nextCallback) {
					dao.editusernickname(req_user_nickname , request.session.user_idx);
					nextCallback(null);
				},
				function(nextCallback) {
					dao.edituserpassword(req_user_pw, request.session.user_idx);
					nextCallback(null);
				}
			], function (error) {
				if (error) {
					console.log(error);
					response.json({
						RESULT: "0"
					});
				} else {
					nextCallback(null);
				}
			});
		}
	], function (error) {
		response.json({
			RESULT: "1"
		});
	});
};

exports.test = function (request, response) {
	console.log('aaaaa');
	console.log(request.session.user_idx);
	console.log(request.session.user_auth);
	console.log(request.sessionID);
	console.log(request.session.cookie.sessionID);
	response.json({
		RESULT: 1
	});
};