class Utils {
    constructor() {
        let createXHR = function () {
            let xhrs = [
                function () { return new XMLHttpRequest () },
                function () { return new ActiveXObject ("Msxml2.XMLHTTP") },
                function () { return new ActiveXObject ("Msxml3.XMLHTTP") },
                function () { return new ActiveXObject ("Microsoft.XMLHTTP") }
            ];
            let xhr = null;
            for (let i = 0; i < xhrs.length; ++i) {
                try {
                    xhr = xhrs[i]();
                } catch(e) {
                    continue;
                }
                break;
            }
            return xhr;
        };

        this.xhrSend = function (method, url, header, data, callback) {
            let xhr = createXHR();
            xhr.onload = function () {
                callback(xhr);
            };//callback(null);
            xhr.open(method, url, true);
            for (let key in header) {
                xhr.setRequestHeader(key, header[key]);
            }
            try {
                xhr.send(data);
            }catch (e) {
                callback(null);
            }
        };

        this.parseUrlQuery = function (query) {
            let obj = {};
            let params = query.split('&');
            let param_count = params.length;
            for(let i = 0; i < param_count; ++i) {
                let param = params[i];
                let kv = param.split('=');
                obj[kv[0]] = kv[1];
            }
            return obj;
        };
    }
}