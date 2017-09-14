/**
 * Created by Fred.Lu on 2016/11/9.
 */
module.exports = {
    port: 40011,
    session: {
        secret:'site',
        resave:false,
        saveUninitialized:false,
        secure:false,
        cookie: { maxAge: 1800 }
    },
    communityAPIUrl:'http://api.cmadmin.vidahouse.com/v1/'
};