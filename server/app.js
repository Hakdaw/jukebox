const http = require('http');
const https = require('https');
const http2 = require('http2');
const url = require('url');
const fs = require('fs');
const jsonfile = require('jsonfile');
const socketio = require('socket.io');

const {Log} = require("./log");
const {Server, Runtime} = require("./server");
const {Api} = require('./api');
const {Cache} = require('./cache')

//元信息读取
let app_exist = fs.existsSync('./app.json');

if(!app_exist) {
    console.log('[0x11]App Startup Exception!');
    process.exit(0x11);
}
let app_data = null;
try {
    app_data = jsonfile.readFileSync('./app.json');
}catch (e) {
    console.log('[0x11]App Startup Exception!');
    process.exit(0x11);
}

if(!app_data) {
    console.log('[0x11]App Startup Exception!');
    process.exit(0x11);
}

//app元信息
_app_code = app_data['app_code'];
_app_version = app_data['app_version'];
_app_author = app_data['app_author'];
_app_copyright = app_data['copyright'];

//此模块文件名
_model_name = 'App';

//服务器端口
_server_port = 80;
_websocket_port = 0;

let log = new Log(_model_name);
global.server = new Server();
global.runtime = new Runtime();
global.init_status = {
    server: false
};
let _http_server = null;
let _ws_io = null;

async function module_init() {
    await server.init();
}

log.info('App Starts Running.')
log.info(_app_code + '\n' + 'version:' + _app_version + '\n' + _app_copyright);

//Http-Server响应回调
function onRequest(request, response) {
    //url解析
    let path = url.parse(request.url).pathname;
    let urlobj = url.parse(request.url, true);
    //传输数据至路由
    //response.setHeader('Access-Control-Allow-Origin', '*');
    server.route(path, urlobj, request, response);
    log.log('Request:' + url.parse(request.url).path);
}

module_init();

//入口函数
function init() {
    log.info('App Starts to Initialize.');
    //初始化Runtime类
    runtime.init();
    //初始化http server
    _http_server = http.createServer(onRequest).listen(_server_port);
    _ws_io = new socketio.Server(_http_server);
    _ws_io.on('connection', (socket) => {

    });
    _ws_io.on('disconnect', () => {

    });
    log.info('App is Running on Port '+_server_port);
    _http_server.on('error', function () {
});
}

//一些测试代码，不用在意
let api = new Api();
//api.searchSongs('ok', 1);
//api.playMusic({platform: 'netease', sid: '1913478990', mid: '000k8mOm02GBDs', mediaid: '000k8mOm02GBDs', quality: ['ape', 'flac']});
//runtime.pushSong({platform: 'qq', sid: 372680372, mid: '000cL4zf1yfL1y', mediaid: '000HA6Ps0MiEz2', mname: 'All That Glitters 明霄升海平', quality: ['flac', 'mp3_320', 'mp3_128']})
//console.log(runtime.pushSong({platform: 'qq', sid: 372680372, mid: '000cL4zf1yfL1y', mediaid: '000HA6Ps0MiEz2', mname: 'All That Glitters 明霄升海平', quality: ['flac', 'mp3_320', 'mp3_128']}));
//let cache = new Cache();
//cache.setCache('search_result', 'data', 'ok');
//api.playMusic({"platform":"netease","sid":1915598656,"mname":"广寒宫","marts":["何杰玲"],"malbum":"广寒宫","mtime":212636});
let test = function() {
    api.playMusic({"platform":"qq","sid":202826403,"mid":"003NZ1lc2Sk8hD","mediaid":"004b1HBl1MmiiL","mname":"樱色轮回","marts":["米哈游"],"malbum":"","quality":["mp3_128"]});
}
//入口函数调用，使用以上测试代码请注释起来
//init();

let init_checker = setInterval(function () {
    let status_arr = Object.values(init_status);
    let check_res = true;
    for(let i in status_arr) {
        if(status_arr[i] == false) {
            check_res = false;
            break;
        }
    }
    if(check_res) {
        clearInterval(init_checker);
        //test();
        init();
    }
}, 1000);