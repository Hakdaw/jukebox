class Jukebox {
    constructor(server_url) {
        let utils = new Utils();
        this.checkServer = function (callback) {
            let url = server_url + '/api';
            let data = null;
            utils.xhrSend('POST', url, null, null, function (xhr) {
                if(xhr.status === 200 && xhr.responseText != null){
                    try{
                        data = JSON.parse(xhr.responseText);
                    }catch (e) {
                        callback(1);
                    }
                    if(data['code'] === 0) {
                        callback(0);
                        return;
                    }else {
                        callback(1);
                    }
                }else{
                    callback(1);
                    return;
                }
            });
        };
        this.getSong = function (callback) {
            let url = server_url + '/api/get_song';

        };
    }
}