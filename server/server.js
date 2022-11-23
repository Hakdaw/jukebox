const {Api} = require('./api');
let {Utils} = require('./utils');
const fs = require('fs');
const md5 = require('md5');
const {Cache} = require('./cache');

class Pages {
    constructor() {
        let apic = new Api();
        let utils = new Utils();
        this.root = function (req, res) {
            let doc_root_path = './res/pages/index.html';
            let doc = fs.readFileSync(doc_root_path, 'utf8');
            res.writeHead(200, {"Content-Type": "text/html;charset=utf-8;"});
            res.write(doc);
            res.end();

        };
        this.retError = function (res, code, err_code, msg) {
            res.writeHead(200, {"Content-Type": "application/json;charset=utf-8;"});
            res.write(JSON.stringify({'code': code, 'status': 'error', 'error': err_code, 'msg': msg}));
            res.end();
        };
        this.retCode = function (res, code, msg) {
            res.writeHead(200, {"Content-Type": "application/json;charset=utf-8;"});
            res.write(JSON.stringify({'code': code, 'status': 'code', 'msg': msg}));
            res.end();
        };
        this.page404 = function (req, res) {
            res.writeHead(404, {"Content-Type": "application/json;charset=utf-8;"});
            res.write(JSON.stringify({'code': 404, 'status': 'error', 'error': 'error_not_found', 'msg': 'Not Found'}));
            res.end();
        };
        this.manager = function (url ,req, res, pathArr) {
            let data = null;
            let path = null;
            switch (pathArr[2]) {
                case 'control':
                    path = './res/manager/control.html';
                    break;
                case 'audit':
                    path = './res/manager/audit.html'
                    break;
                case 'res':
                    let file = pathArr[4];
                    switch (pathArr[3]) {
                        case 'js':
                            let jsname = './res/manager/res/js/' + file;
                            let data_js = null;
                            try {
                                data_js = fs.readFileSync(jsname, 'utf8');
                            }catch (e) {
                                this.page404(req, res);
                                return;
                            }
                            res.writeHead(200, {"Content-Type": "application/javascript;charset=utf-8;"});
                            res.write(data_js);
                            res.end();
                            return;
                            break;
                        case 'css':
                            let cssname = './res/manager/res/css/' + file;
                            let data_css = null;
                            try {
                                data_css = fs.readFileSync(cssname, 'utf8');
                            }catch (e) {
                                this.page404(req, res);
                                return;
                            }
                            res.writeHead(200, {"Content-Type": "text/css;charset=utf-8;"});
                            res.write(data_css);
                            res.end();
                            return;
                            break;
                        case 'img':
                            let imgname = './res/manager/res/img/' + file;
                            let data_img = null;
                            try {
                                data_img = fs.readFileSync(imgname, 'binary');
                            }catch (e) {
                                this.page404(req, res);
                                return;
                            }
                            res.writeHead(200, {"Content-Type": "image/jpeg"});
                            res.write(data_img, 'binary');
                            res.end();
                            return;
                            break;
                        case 'json':
                            let jsonname = './res/manager/res/json/' + file;
                            let data_json = null;
                            try {
                                data_json = fs.readFileSync(jsonname, 'utf8');
                            }catch (e) {
                                this.page404(req, res);
                                return;
                            }
                            res.writeHead(200, {"Content-Type": "application/json"});
                            res.write(data_json);
                            res.end();
                            return;
                            break;
                        default:
                            this.page404(req, res);
                            return;
                            break;
                    }
                    break;
                default:
                    this.page404(req, res);
                    return;
                    break;
            }
            data = fs.readFileSync(path);
            res.writeHead(200, {"Content-Type": "text/html;charset=utf-8;"});
            res.write(data);
            res.end();
        };
        this.page = function (url, req, res, file) {
            let data = null;
            let path = null;
            switch (file) {
                case 'search':
                    path = './res/pages/search.html';
                    break;
                case 'album':
                    path = './res/pages/album.html'
                    break;
                default:
                    this.page404(req, res);
                    return;
                    break;
            }
            data = fs.readFileSync(path);
            res.writeHead(200, {"Content-Type": "text/html;charset=utf-8;"});
            res.write(data);
            res.end();
        };
        this.res = function (url, req, res, type, file) {
            switch (type) {
                case 'appdata':
                    let data_appdata = fs.readFileSync('./app.json', 'utf8');
                    res.writeHead(200, {"Content-Type": "application/json;charset=utf-8;"});
                    res.write(data_appdata);
                    res.end();
                    return;
                    break;
                case 'js':
                    let jsname = './res/js/' + file;
                    let data_js = null;
                    try {
                        data_js = fs.readFileSync(jsname, 'utf8');
                    }catch (e) {
                        this.page404(req, res);
                        return;
                    }
                    res.writeHead(200, {"Content-Type": "application/javascript;charset=utf-8;"});
                    res.write(data_js);
                    res.end();
                    break;
                case 'css':
                    let cssname = './res/css/' + file;
                    let data_css = null;
                    try {
                        data_css = fs.readFileSync(cssname, 'utf8');
                    }catch (e) {
                        this.page404(req, res);
                        return;
                    }
                    res.writeHead(200, {"Content-Type": "text/css;charset=utf-8;"});
                    res.write(data_css);
                    res.end();
                    break;
                case 'img':
                    let imgname = './res/img/' + file;
                    let data_img = null;
                    try {
                        data_img = fs.readFileSync(imgname, 'binary');
                    }catch (e) {
                        this.page404(req, res);
                        return;
                    }
                    res.writeHead(200, {"Content-Type": "image/jpeg"});
                    res.write(data_img, 'binary');
                    res.end();
                    break;
                case 'json':
                    let jsonname = './res/json/' + file;
                    let data_json = null;
                    try {
                        data_json = fs.readFileSync(jsonname, 'utf8');
                    }catch (e) {
                        this.page404(req, res);
                        return;
                    }
                    res.writeHead(200, {"Content-Type": "application/json"});
                    res.write(data_json);
                    res.end();
                    break;
                case 'raw':
                    let rawname = './res/raw/' + file;
                    let data_raw = null;
                    try {
                        data_raw = fs.readFileSync(rawname, 'binary');
                    }catch (e) {
                        this.page404(req, res);
                        return;
                    }
                    res.writeHead(200, {"Content-Type": "application/octet-stream"});
                    res.write(data_raw);
                    res.end();
                    break;
                default:
                    this.page404(req, res);
                    return;
                    break;
            }
        };
        this.search = async function (url, req, res) {
            let param = url['query'];
            if(! param['key']) {
                this.retError(res, 2001, 'param_error', 'Param Error');
                return;
            }
            let page = 1;
            let kw = param['key'];
            if(param['page']) {
                if(Math.floor(param['page']) > 1) {
                    page = Math.floor(param['page']);
                }
            }
            let songobj = await apic.searchSongs(kw, page);

            res.writeHead(200, {"Content-Type": "application/json;charset=utf-8;"});
            res.write(JSON.stringify(songobj));
            res.end();
        };
        this.pushSong = async function (url, req, res) {
            let param = url['query'];
            let data = await utils.getRequestData(req);
            let odata = null;
            try {
                odata = JSON.parse(String(data));
            }catch (e) {
                this.retError(res, 2003, 'post_data_error', 'Post Data Error');
                return;
            }
            if(!odata) {
                this.retError(res, 2003, 'post_data_error', 'Post Data Error');
                return;
            }
            let push_ret = runtime.pushSong(odata);
            if(push_ret === null) {
                this.retError(res, 2003, 'post_data_error', 'Post Data Error');
                return;
            }
            res.writeHead(200, {"Content-Type": "application/json;charset=utf-8;"});
            res.write(JSON.stringify({'code': 0, 'status': 'ok', 'msg': 'Successful Push Song', 'count': push_ret}));
            res.end();
        };

        this.repeatCheck = async function (url, req, res) {
            let data = await utils.getRequestData(req);
            let odata = null;
            try {
                odata = JSON.parse(String(data));
            }catch (e) {
                this.retError(res, 2003, 'post_data_error', 'Post Data Error');
                return;
            }
            if(!odata) {
                this.retError(res, 2003, 'post_data_error', 'Post Data Error');
                return;
            }
            if(!odata.platform || !odata.sid) {
                this.retError(res, 2003, 'post_data_error', 'Post Data Error');
                return;
            }
            let index_id = odata.platform + '_' + odata.sid;
            let ret = runtime.repeatCheck(index_id);
            if(ret === null) {
                this.retError(res, 2003, 'post_data_error', 'Post Data Error');
                return;
            }
            res.writeHead(200, {"Content-Type": "application/json;charset=utf-8;"});
            res.write(JSON.stringify({'code': 0, 'status': 'ok', 'msg': 'Successful Return Check Data', 'ret': ret}));
            res.end();
        };

        this.queueNumber = function(url, req, res) {
            let data = runtime.queueNumber();
            res.writeHead(200, {"Content-Type": "application/json;charset=utf-8;"});
            res.write(JSON.stringify({'code': 0, 'status': 'ok', 'msg': 'Successful Return Queue Number', 'ret': data}));
            res.end();
        };

        this.queryQueue = function(url, req, res) {
            let param = url['query'];
            if(! param['type']) {
                this.queueNumber(url, req, res);
                return;
            }
            let queue = runtime.getQueue();
            let data = {'code': 1, 'status': 'ok', 'msg': 'Successful Return Queue Data', 'data': -1};
            switch(param['type']){
                case 'last':
                    data['code'] = 0;
                    data['data'] = queue.queue[queue.length - 1] || -1;
                    break;
                case 'next':
                    data['code'] = 0;
                    data['data'] = queue.queue[0] || -1;
                    break;
                case 'next_play':
                    data['code'] = 0;
                    let song_index = 0;
                    for(let i in queue.queue) {
                        if(queue.queue[i]['status']) {
                            song_index = i;
                            break;
                        }
                    }
                    data['data'] = queue.queue[song_index] || -1;
                    break;
                case 'queue':
                    data['code'] = 0;
                    data['data'] = queue;
                    break;
                case 'audit':
                    data['code'] = 0;
                    let offset = param['offset'];
                    offset = (offset === undefined)?0:(isNaN(offset))?0:Math.floor(offset);
                    let song = null;
                    let index = null;
                    for(let i in queue['queue']) {
                        if(queue.queue[i].status === false) {
                            if(offset > 0) {
                                offset --;
                                continue;
                            }
                            song = queue.queue[i];
                            index = i;
                            break;
                        }
                    }
                    data['data'] = song || -1;
                    data['index'] = index || -1;
                    break;
                default:
                     this.queueNumber(url, req, res);
                     return;
                     break;
            }
            res.writeHead(200, {"Content-Type": "application/json;charset=utf-8;"});
            res.write(JSON.stringify(data));
            res.end();
        };

        this.getSong = function (url ,req ,res) {
            let song = runtime.getSong();
            let data = {
                code: 1,
            };
            if(song) {
                data['code'] = 0;
                data['data'] = song;
            }
            res.writeHead(200, {"Content-Type": "application/json;charset=utf-8;"});
            res.write(JSON.stringify(data));
            res.end();
        };

        this.getPlayUrl = async function (url, req, res) {
            let data = await utils.getRequestData(req);
            let odata = null;
            try {
                odata = JSON.parse(String(data));
            }catch (e) {
                this.retError(res, 2003, 'post_data_error', 'Post Data Error');
                return;
            }
            if(!odata) {
                this.retError(res, 2003, 'post_data_error', 'Post Data Error');
                return;
            }
            if(!odata.platform) {
                this.retError(res, 2003, 'post_data_error', 'Post Data Error');
                return;
            }

            let ret = await apic.playMusic(odata);
            res.writeHead(200, {"Content-Type": "application/json;charset=utf-8;"});
            res.write(JSON.stringify(ret));
            res.end();
        };

        this.reportPlayStatus = async function (url, req, res) {
            let data = await utils.getRequestData(req);
            let odata = null;
            try {
                odata = JSON.parse(String(data));
            }catch (e) {
                this.retError(res, 2003, 'post_data_error', 'Post Data Error');
                return;
            }
            if(!odata) {
                this.retError(res, 2003, 'post_data_error', 'Post Data Error');
                return;
            }
            if(odata.code === undefined) {
                this.retError(res, 2003, 'post_data_error', 'Post Data Error');
                return;
            }

            if(odata.code === -1) {
                runtime.delPlayStatus();
                res.writeHead(200, {"Content-Type": "application/json;charset=utf-8;"});
                res.write(JSON.stringify({code: 0}));
                res.end();
                return;
            }

            if(!odata.song || !odata.song.mname) {
                this.retError(res, 2003, 'post_data_error', 'Post Data Error');
                return;
            }
            let song = odata['song'];
            let ts = Date.now();
            let ret = runtime.reportPlayStatus(song, ts);
            let ret_data = {
                code: 1,
                data: -1
            };
            if(ret) {
                ret_data['code'] = 0;
                ret_data['data'] = ret
            }
            res.writeHead(200, {"Content-Type": "application/json;charset=utf-8;"});
            res.write(JSON.stringify(ret_data));
            res.end();
        };

        this.getPlayStatus = function (url, req ,res) {
            let data = {
                code: 0,
                data: runtime.playingSong
            };
            res.writeHead(200, {"Content-Type": "application/json;charset=utf-8;"});
            res.write(JSON.stringify(data));
            res.end();
        };

        this.moveSongPosition = function (url, req, res) {
            let param = url['query'];
            if(! param['uiid'] || param['index'] === undefined || isNaN(param['index'])) {
                this.retError(res, 2003, 'post_data_error', 'Post Data Error');
                return;
            }
            let ret = runtime.moveSongPosition(param['uiid'], param['index']);
            let ret_data = {
                code: -1,
                data: -1
            };
            if(ret) {
                ret_data['code'] = 0;
                ret_data['data'] = ret
            }
            res.writeHead(200, {"Content-Type": "application/json;charset=utf-8;"});
            res.write(JSON.stringify(ret_data));
            res.end();
        }

        this.changeSongStatus = async function (url, req ,res) {
            let data = await utils.getRequestData(req);
            let odata = null;
            try {
                odata = JSON.parse(String(data));
            }catch (e) {
                this.retError(res, 2003, 'post_data_error', 'Post Data Error');
                return;
            }
            if(!odata) {
                this.retError(res, 2003, 'post_data_error', 'Post Data Error');
                return;
            }
            if(!odata.uiid || odata.status === undefined) {
                this.retError(res, 2003, 'post_data_error', 'Post Data Error');
                return;
            }
            let index = (odata.index !== undefined) ? odata.index : null;
            let ret_data = runtime.changeSongStatus(odata.uiid, odata.status, index);
            let ret = {
                code: (ret_data) ? 0 : 1,
                ret: ret_data
            };
            res.writeHead(200, {"Content-Type": "application/json;charset=utf-8;"});
            res.write(JSON.stringify(ret));
            res.end();
        };

        this.delSong = async function (url, req ,res) {
            let param = url['query'];
            if(!param['uiid']) {
                this.retError(res, 1, 1, 'error');
                return;
            }
            let ret_data = runtime.deleteSong(param['uiid']);
            let ret = {
                code: (ret_data) ? 0 : 1,
                ret: ret_data
            };
            res.writeHead(200, {"Content-Type": "application/json;charset=utf-8;"});
            res.write(JSON.stringify(ret));
            res.end();
        };

        this.pushCustom = async function (url, req ,res) {
            let param = url['query'];
            if(!param['name']) {
                this.retError(res, 1, 1, 'error');
                return;
            }
            let ret_data = runtime.pushCustom(param['name']);
            let ret = {
                code: ret_data
            };
            res.writeHead(200, {"Content-Type": "application/json;charset=utf-8;"});
            res.write(JSON.stringify(ret));
            res.end();
        };

        this.init = async function () {
            await apic.init();
        }

    }
}

class Route {
    constructor() {
        let pages = new Pages();
        this.api = function (pathArr, url, req, res) {
            switch (pathArr[2]) {
                case '': case null: case undefined:
                    this.code(req, res, 0, 'Api OK');
                    break;
                case 'search':
                    pages.search(url, req, res);
                    break;
                case 'push_song':
                    pages.pushSong(url, req, res);
                    break;
                case 'repeat_check':
                    pages.repeatCheck(url, req, res);
                    break;
                case 'get_play_url':
                    pages.getPlayUrl(url, req, res);
                    break;
                case 'get_song':
                    pages.getSong(url, req, res);
                    break;
                case 'queue_number':
                    pages.queueNumber(url, req, res);
                    break;
                case 'query_queue':
                    pages.queryQueue(url, req, res);
                    break;
                case 'change_song_status':
                    pages.changeSongStatus(url, req, res);
                    break;
                case 'del_song':
                    pages.delSong(url, req, res);
                    break;
                case 'report_play_status':
                    pages.reportPlayStatus(url ,req, res);
                    break;
                case 'get_play_status':
                    pages.getPlayStatus(url ,req, res);
                    break;
                case 'move_song':
                    pages.moveSongPosition(url, req, res);
                    break;
                case 'push_custom':
                    pages.pushCustom(url, req ,res);
                    break;
                default:
                    this.error(pathArr, url, req, res, 404);
                    break;
            }
        };
        
        this.page = function (pathArr, url, req, res) {
            pages.page(url, req, res, pathArr[2]);
        };

        this.manager = function (pathArr, url, req, res) {
            pages.manager(url, req, res, pathArr);
        }
        
        this.res = function (pathArr, url, req, res) {
            pages.res(url, req, res, pathArr[2], pathArr[3]);
        };

        this.error = function (pathArr, url, req, res, code) {
            switch (code) {
                case 404:
                    pages.page404(req, res);
                    break;
                default:
                    pages.page404(req, res);
                    break;
            }
        };

        this.code = function (req, res, code, msg) {
            pages.retCode(res, code, msg);
        };
    }
}

class Server {
    constructor() {
        let pages = new Pages();
        let routes = new Route();
        this.init = async function () {
            await pages.init();
            init_status.server = true;
        }
        this.route = function (path, url, req, res) {
            let pathArr = path.split('/');
            if(path === '/') {
                return pages.root(req, res)
            }
            switch (pathArr[1]) {
                case 'api':
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.setHeader('Access-Control-Allow-Credentials', 'true');
                    res.setHeader('Access-Control-Allow-Headers' ,'content-type');
                    if(req.method === 'OPTIONS'){
                        res.end();
                        break;
                    }
                    routes.api(pathArr, url, req, res);
                    break;

                case 'res':
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.setHeader('Access-Control-Allow-Credentials', 'true');
                    res.setHeader('Access-Control-Allow-Headers' ,'content-type');
                    if(req.method === 'OPTIONS'){
                        res.end();
                        break;
                    }
                    routes.res(pathArr, url, req, res);
                    break;

                case 'page':
                    //res.setHeader('Access-Control-Allow-Origin', '*');
                    routes.page(pathArr, url, req, res);
                    break;

                case 'manager':
                    routes.manager(pathArr, url, req, res);
                    break;

                default:
                    //res.setHeader('Access-Control-Allow-Origin', '*');
                    routes.error(pathArr, url, req, res, 404);
                    break;
            }
        }
    }
}

class Runtime {
    constructor() {
        this.songQueue = [];
        this.songIndex = new Map();
        this.currentSong = null;
        this.cache = new Cache();
        this.custom = [];
        this.playingSong = null;

        this.init = function() {
            this.songQueue = this.cache.readQueue() || [];
            this.songIndex.clear();
        }

        this.pushCustom = function (name) {
            if(!name) {
                return 1;
            }
            this.custom.push(name);
            this.cache.cacheCustom(this.custom);
            return 0;
        };
        
        this.pushSong = function (song) {

            if(!song['platform']) {
                return null;
            }

            let data =null;

            switch (song['platform']) {
                case 'netease':
                    if(!song['sid'] || !song['mname']) {
                        return null;
                    }
                    data = {
                        platform: song['platform'],
                        sid: song['sid'],
                        mname: song['mname'],
                        marts: song['marts']
                    };
                    break;
                case 'qq':
                    if(!song['sid'] || !song['mid'] || !song['mediaid'] || !song['quality'] || !song['mname']) {
                        return null;
                    }
                    data = {
                        platform: song['platform'],
                        sid: song['sid'],
                        mid: song['mid'],
                        mediaid: song['mediaid'],
                        quality: song['quality'],
                        mname: song['mname'],
                        marts: song['marts']
                    };
                    break;
                default:
                    return null;
                    break;
            }

            if(! data) {
                return null;
            }
            let index_id = data.platform + '_' + data.sid;
            let ts = Date.now();
            let uiid = md5(index_id + '@' + ts);
            console.log(data.mname + ':' + uiid);
            data['uiid'] = uiid;
            data['status'] = false;
            this.songQueue.push(data);
            let index_count = this.songIndex.get(index_id) || 0;
            this.songIndex.set(index_id, index_count + 1);
            //console.log(this.songIndex.get(index_id));
            this.cache.cacheQueue(this.songQueue);
            return this.songQueue.length;
        }

        this.getSong = function () {

            let queueLen = this.songQueue.length;
            if(queueLen <= 0) {
                return null;
            }
            let index = -1;
            for(let i = 0; i < queueLen; ++i){
                if(this.songQueue[i].status) {
                    index = i;
                    break;
                }
            }

            if(index === -1) {
                return null;
            }

            let song = this.songQueue[index];
            let index_id = song.platform + '_' + song.sid;

            let index_count = this.songIndex.get(index_id);
            if(index_count > 1) {
                this.songIndex.set(index_id, index_count - 1);
            }else {
                this.songIndex.delete(index_id);
            }
            let ret = this.songQueue.splice(index, 1)[0];
            this.cache.cacheQueue(this.songQueue);
            ret['uiid'] = null;
            return ret;
        }
        
        this.reportPlayStatus = function (song, timestamp) {
            if(!song) {
                return null;
            }
            this.playingSong = song;
            return this.playingSong;
        }

        this.delPlayStatus = function () {
            this.playingSong = null;
            return;
        }

        this.getPlayStatus = function () {
            return this.playingSong;
        }
        
        this.getPlayUrl = function (song) {
            if(!song['platform']) {
                return null;
            }

            let data =null;

            switch (song['platform']) {
                case 'netease':

                    break;
                case 'qq':

                    break;
                default:
                    return null;
                    break;
            }
        }
        
        this.changeSongStatus = function (uiid, status, index) {
            let index_range = [0, this.songQueue.length];
            status = (status == true);
            if(this.songQueue.length <= 0) {
                return null;
            }
            if(index != null && !isNaN(index)) {
                index_range[0] = (index - 3 > 0) ? index - 3 : 0;
                index_range[1] = (index + 5 < this.songQueue.length - 1) ? index + 5 : this.songQueue.length - 1;
            }
            for(let i = index_range[0]; i <= index_range[1]; ++i) {
                if(this.songQueue[i].uiid == uiid) {
                    this.songQueue[i].status = status;
                    this.cache.cacheQueue(this.songQueue);
                    return this.songQueue[i];
                }
            }
            if(index == null || isNaN(index)) {
                return null;
            }
            for(let i = 0; i < this.songQueue.length; ++i) {
                if(i >= index_range[0] && i <= index_range[1]) {
                    break;
                }
                if(this.songQueue[i].uiid == uiid) {
                    this.songQueue[i].status = status;
                    this.cache.cacheQueue(this.songQueue);
                    return this.songQueue[i];
                }
            }
            return null;
        };

        this.getQueue = function () {
            let data = {
                length: this.songQueue.length,
                queue: this.songQueue
            };
            return data;
        }

        this.deleteSong = function (uiid) {
            let index = null;
            for(let i = 0; i < this.songQueue.length; ++i) {
                if(this.songQueue[i].uiid == uiid) {
                    index = i;
                    break;
                }
            }
            if (index === null) {
                return null;
            }
            let song = this.songQueue[index];
            let index_id = song.platform + '_' + song.sid;
            let index_count = this.songIndex.get(index_id);
            if(index_count > 1) {
                this.songIndex.set(index_id, index_count - 1);
            }else {
                this.songIndex.delete(index_id);
            }
            let ret_data = this.songQueue.splice(index, 1)[0];
            this.cache.cacheQueue(this.songQueue);
            return ret_data;
        }

        this.moveSongPosition = function (uiid, newIndex) {
            let index = -1;
            for(let i in this.songQueue) {
                if(this.songQueue[i]['uiid'] === uiid) {
                    index = i;
                    break;
                }
            }

            if(index < 0) {
                return null;
            }

            if(!this.songQueue[index]) {
                return null;
            }
            newIndex = (newIndex >= this.songQueue.length)?this.songQueue.length:newIndex;
            newIndex = (newIndex < 0)?0:newIndex;
            let song = this.songQueue.splice(index, 1);
            let new_song = this.songQueue.splice(newIndex, 0, song[0]);
            this.cache.cacheQueue(this.songQueue);
            return new_song;
        }

        this.repeatCheck = function (index_id) {
            return this.songIndex.get(index_id) || 0;
        }

        this.queueNumber = function() {
            return this.songQueue.length;
        }

    }
}

module.exports = {
    Pages,
    Route,
    Server,
    Runtime
};