/**
 * Created by Melody.Deng on 2016/12/20.
 */
var httpClient={

    GET:function (url,data,successCallback,errorCallback) {
        var httpUrl = configUrl + url;
        $.ajax({
            url:httpUrl,
            type:'GET',
            data:data,
            success:successCallback,
            error:errorCallback
        })
    },
    POST:function (url,data,successCallback,errorCallback) {
        var httpUrl = configUrl + url;
        $.ajax({
            url:httpUrl,
            type:'POST',
            data:data,
            success:successCallback,
            error:errorCallback
        })
    },
    DELETE:function (url,data,successCallback,errorCallback) {

    },
    PATCH:function (url,data,successCallback,errorCallback) {
        var httpUrl = configUrl + url;
        $.ajax({
            url:httpUrl,
            type:'PATCH',
            data:data,
            success:successCallback,
            error:errorCallback
        })
    },
    PUT:function (url,data,successCallback,errorCallback) {

    }
};
