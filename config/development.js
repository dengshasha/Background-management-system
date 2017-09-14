/**
 * Created by Fred.Lu on 2016/11/9.
 */
module.exports = {
    port: 4003,
    session: {
        secret:'site',
        resave:false,
        saveUninitialized:false,
        secure:false,
        cookie: { maxAge: 1800 }
    },
    communityAPIUrl:'http://cmadmin.api.v.vidahouse.com:81/v1/'
};