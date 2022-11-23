class Utils {
    constructor() {
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
        
        this.getRequestData = function (req) {
            return new Promise((resolve, reject) => {
                let data = '';
                req.on('data', data_chunk => {
                    data += data_chunk;
                });
                req.on('end', () => {
                    resolve(data);
                });
            });
        }
    }
}

module.exports = {
    Utils
}