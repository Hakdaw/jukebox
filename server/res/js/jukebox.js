class Jukebox {
    constructor() {
        let utils = new Utils();
        this.orderSong = function (song, callback) {
            let url = '/api/push_song';
            let data = null;
            utils.xhrSend('POST', url, null, JSON.stringify(song), function (xhr) {
                if(xhr.status === 200 && xhr.responseText != null){
                    try{
                        data = JSON.parse(xhr.responseText);
                    }catch (e) {
                        callback(null);
                    }
                    if(data['code'] === 0 && data['count'] !== null) {
                        callback(data['count']);
                        return;
                    }else {
                        callback(null);
                    }
                }else{
                    callback(null);
                    return;
                }
            });

        };
        
        this.repeatCheck = function (song, callback) {
            let url = '/api/repeat_check';
            let data = null;
            utils.xhrSend('POST', url, null, JSON.stringify(song), function (xhr) {
                if(xhr.status === 200 && xhr.responseText != null){
                    try{
                        data = JSON.parse(xhr.responseText);
                    }catch (e) {
                        callback(null);
                    }
                    if(data['code'] === 0 && data['ret'] !== null) {
                        callback(data['ret']);
                        return;
                    }else {
                        callback(null);
                    }
                }else{
                    callback(null);
                    return;
                }
            });
        };
    }
}