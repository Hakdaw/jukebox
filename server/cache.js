const uuid  = require('uuid');
const fs = require('fs');

const namespace_uuid = 'e7ebe78d-37b8-4dbc-a954-8d84a018bd9a';
const cache_dir = './cache/';
const cache_path_index = cache_dir+'index';

class Cache {
    constructor() {
        let genUUID = function (kw) {
            let ret = uuid.v3(kw, namespace_uuid);
            return ret;
        };
        let readIndex = function () {
            
        };
        this.setIndex = function () {

        };
        this.setCache = function (type, data, keyword) {
            switch (type) {
                case 'search_result':
                    let kw_sr = '_cache_search-result:' + keyword + '@' + String(Date.now());
                    let cuid_sr = genUUID(kw_sr);
                    console.log(cuid_sr);
                    break;
                case 'queue':
                    break;
                default:
                    return null;
                    break;
            }
        };
        let deleteCache = function (type, uuid) {

        };
        this.cacheQueue = function (queue) {
            let path = './cache/queue.json';
            let data = JSON.stringify(queue);
            fs.writeFileSync(path, data);
        }
        this.cacheCustom = function (cus) {
            let path = './cache/custom.json';
            let data = JSON.stringify(cus);
            fs.writeFileSync(path, data);
        }
        this.readQueue = function () {
            let path = './cache/queue.json';
            let data = fs.readFileSync(path);
            return JSON.parse(data);
        }
        this.init = function() {
            if(!fs.existsSync(cache_dir)) {
                fs.mkdir(cache_dir);
                this.init();
                return;
            }
            if(!fs.existsSync(cache_path_index)) {
                fs.mkdir(cache_path_index);
                this.init();
                return;
            }
        };
    }
}

module.exports = {
    Cache
}