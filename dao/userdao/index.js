var mysql = require('mysql');
var dto = require('../../dto/userdto');

var client = mysql.createConnection({
    host: 'stweb.ccmxaq6oosug.ap-northeast-2.rds.amazonaws.com'
    , port: 3306
    , user: 'stweb'
    , password: 'stwebstweb'
    , database: 'stweb'
});

client.connect(function (err) {
    if (err) throw err;
});

module.exports = connection;

/********************
        GET
********************/
exports.getuseridauth = function (id, callback) {
    client.query('SELECT * FROM stweb.stweb_users where user_id = ?', [id], function (error, result) {
        callback(error, result);
    });
};
exports.getuserinformation = function (useridx, callback) {
    client.query('SELECT * FROM stweb.stweb_users where user_idx = ?', [useridx], function (error, result) {
        callback(error, result);
    });
};
exports.getidcheck = function (user_id, callback) {
    client.query('SELECT * FROM stweb.stweb_users where user_id = ?', [user_id], function (error, result) {
        callback(error, result);
    });
};
exports.getnicknamecheck = function (user_nickname, callback) {
    client.query('SELECT * FROM stweb.stweb_users where user_nickname = ?', [user_nickname], function (error, result) {
        callback(error, result);
    });
};

/********************
        POST
********************/
exports.signup = function (user, callback) {
    client.query('INSERT INTO stweb.stweb_users (user_id, user_pw, user_nickname, user_join_date, user_subscription, user_auth) VALUES (?, ?, ?, ?, ?, ?)', [user.id, user.pw, user.nickname, user.join_date, user.subscription, user.auth], function (error, result) {
        callback(error, result);
    });
};

/********************
        PUT
********************/
exports.edituserconnectdate = function (date, user_idx, callback) {
    client.query('UPDATE stweb.stweb_users set user_recent_date = ? where user_idx = ?', [date, user_idx], function (error) {
        callback(error);
    });
};

/********************
       DELETE
********************/