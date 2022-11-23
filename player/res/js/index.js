//_server_url = 'http://jukebox.fgifast1.vipnps.vip';
_server_url = 'http://127.0.0.1';


let utils = new Utils();
let jukebox = new Jukebox(_server_url);
serverStatus = {
    total: true,
    main: false,
    qq: false,
    netease: true
};

jukeboxRuntime = {
    songs: {
        data: null,
        url: null,
        urls: null,
        cookie: null
    },
    runtime: {
        checkInterval: null,
        getInterval: null
    },
    player: null
};

updateStatus('load', '正在连接服务器...');

let checkServer = function () {
    jukebox.checkServer(function (ret) {
        if(ret === 0) {
            serverStatus['main'] = true;
            statusMsg('ok', '成功连接点歌服务器');
        }else {
            alert('无法连接至服务器');
            serverStatus['main'] = true;
            serverStatus['total'] = false;
        }
    });
}

let checkQQ = function () {
    let url = 'https://ws.stream.qqmusic.qq.com/';
        utils.xhrSend('POST', url, null, null, function (ret) {
            if(ret['status']) {
                serverStatus['qq'] = true;
                statusMsg('ok', '成功连接QQ音乐服务器');
            }else {
                alert('无法连接至QQ音乐服务器');
                serverStatus['qq'] = true;
                serverStatus['total'] = false;
            }
        });

};

let createPage = function () {
    document.getElementById('play_box').style.display = 'flex';
    statusMsg('ok', '面板初始化完成');
};

let logMsg = function (type, text) {
    let date = new Date();
    let time = {
        h: date.getHours(),
        m: date.getMinutes(),
        s: date.getSeconds()
    };
    time = {
        h: (time.h < 10) ? '0' + time.h : time.h,
        m: (time.m < 10) ? '0' + time.m : time.m,
        s: (time.s < 10) ? '0' + time.s : time.s
    };
    let ft = time.h + ':' + time.m + ':' + time.s;
    let log = null;
    let dom = document.getElementById('log_list');
    let dom_log = document.createElement('div');
    dom_log.className = 'log';
    switch (type) {
        case 'error':
            log = '\u26A0'+'['+ft+']'+text;
            dom_log.setAttribute('tag', 'error');
            break;
        case 'warn':
            log = '\u26A0'+'['+ft+']'+text;
            dom_log.setAttribute('tag', 'warn');
            break;
        case 'ok':
            log = '\u2714'+'['+ft+']'+text;
            dom_log.setAttribute('tag', 'ok');
            break;
        case 'info': default:
            log = '['+ft+']'+text;
            break;
    }
    dom_log.innerText = log;
    dom.appendChild(dom_log);
};

let formatTime = function(second) {
    if(isNaN(second)) {
        return null;
    }
    second = Math.floor(second);
    let min = Math.floor(second/60);
    let sec = Math.floor(second%60);
    sec = (sec >= 10) ? sec : '0' + sec;
    let time = min + ':' + sec;
    return time;
};

let playerStep = function () {
    if(!jukeboxRuntime.player) {
        return;
    }
    let seek = jukeboxRuntime.player.seek() || 0;
    let progressWidth = (((seek / jukeboxRuntime.player.duration()) * 100) || 0) + '%';
    //console.warn(progressWidth);
    document.getElementById('player_process').style.width = progressWidth;
    document.getElementById('player_time_seek').innerText = formatTime(seek);
    if(jukeboxRuntime.player.playing()) {
        requestAnimationFrame(playerStep);
    }
};

let playerBtn = function (btn) {
    //console.log(btn);
    if(!jukeboxRuntime.player) {
        return;
    }
    let play_btn = document.getElementById('player_btn_play');
    switch (btn) {
        case 'play':
            jukeboxRuntime.player.play();
            requestAnimationFrame(playerStep);
            play_btn.setAttribute('tag', 'pause');
            break;
        case 'pause':
            jukeboxRuntime.player.pause();
            play_btn.setAttribute('tag', 'play');
            break;
    }
};

let emptySong = function () {
    Howler.unload();
    jukeboxRuntime.songs.url = null;
    jukeboxRuntime.songs.urls = null;
    jukeboxRuntime.songs.data = null;
    jukeboxRuntime.songs.cookie = null;
    jukeboxRuntime.player = null;
    document.getElementById('player_title').innerText = '暂未播放';
    document.getElementById('player_time_seek').innerText = '0:00';
    document.getElementById('player_time_total').innerText = '0:00';
    document.getElementById('player_process').style.width = '';
    logMsg('warn', '运行时数据清空');
};

document.getElementById('player_process_wrapper').onmousemove = function (event) {
    if(!jukeboxRuntime.player) {
        return;
    }
    event = event || window.event;
    let pos = event.offsetX;
    let total_pos = this.offsetWidth;
    let pre = pos/total_pos;
    let total_time = jukeboxRuntime.player.duration();
    let new_time = total_time*pre || 0;
    let new_time_text = formatTime(new_time);
    document.getElementById('player_seek_time').innerText = new_time_text;
    let time_width = document.getElementById('player_seek_time').offsetWidth;
    let pos_pre_1 = (pos-(time_width/2))/total_pos;
    let pos_pre_2 = 1-((pos+(time_width/2))/total_pos);
    pos_pre_1 = (pos_pre_1 > 0) ? pos_pre_1 : 0;
    pos_pre_2 = (pos_pre_2 > 0) ? pos_pre_2 : 0;
    let dom_pre = ((pos_pre_1)*100) + '%';
    let dom_rpre = (pos_pre_2*100) + '%';
    document.getElementById('player_seek_wrapper').style.display = 'block';
    if(pre > 0.5) {
        document.getElementById('player_seek_time').style.left = '';
        document.getElementById('player_seek_time').style.right = dom_rpre;
    }else {
        document.getElementById('player_seek_time').style.left = dom_pre;
        document.getElementById('player_seek_time').style.right = '';
    }
    this.onclick = function () {
        if(!jukeboxRuntime.player) {
            return;
        }
        jukeboxRuntime.player.seek(new_time);
    }
};

document.getElementById('player_process_wrapper').onmouseout = function () {
    document.getElementById('player_seek_wrapper').style.display = 'none';
}

let flushPlayer = function () {
    if(!jukeboxRuntime.player) {
        return;
    }
    let total_time = jukeboxRuntime.player.duration();
    total_time = formatTime(total_time);
    let song_name = jukeboxRuntime.songs.data['mname'];
    document.getElementById('player_time_total').innerText = total_time;
    document.getElementById('player_title').innerText = song_name;
    if(jukeboxRuntime.player.playing()) {
        let play_btn = document.getElementById('player_btn_play');
        play_btn.setAttribute('tag', 'pause');
    }
};

let createPlay = function () {
    let cookie = jukeboxRuntime.songs.cookie[0];
    if(jukeboxRuntime.songs.cookie[0] == '') {
        for(let i in jukeboxRuntime.songs.cookie) {
            if(jukeboxRuntime.songs.cookie[i] != '') {
                cookie = jukeboxRuntime.songs.cookie[i];
                break;
            }
        }
    }
    //console.log(cookie);
    let howl_data = {
        src: jukeboxRuntime.songs.urls,
        html5: true,
        autoplay: false,
        preload: true,
        rate: 1.1,

        xhr: {
            headers: {
                Cookie: cookie
            }
        },

        /*
        onplay: function () {

        },
        
        onload: function () {
            if(jukeboxRuntime.player.duration() < 40) {
                emptySong();
                setGetInv();
                return;
            }
            flushPlayer();
            requestAnimationFrame(playerStep);

            statusMsg('load', '加载歌曲中');
            logMsg('info', '正在加载');
            let play_inv = setInterval(function () {
                let status = jukeboxRuntime.player.state();
                switch (status) {
                    case Howl.loaded: case Howler.loaded: case 'loaded':
                        jukeboxRuntime.player.play();
                        requestAnimationFrame(playerStep);
                        clearInterval(play_inv);
                        break;
                    case 'unloaded':
                        jukeboxRuntime.player.load();
                        break;
                    default:
                        break;
                }
            }, 1000);
        },
         */

        onloaderror: function () {
            emptySong();
            setGetInv();
            logMsg('error', '加载失败，进入下一曲');
        },

        onplayerror: function () {
            //emptySong();
            //setGetInv();
            //logMsg('error', '播放失败，进入下一曲');
        },
        
        onseek: function () {
            requestAnimationFrame(playerStep);
        },
        
        onend: function () {
            emptySong();
            setGetInv();
            logMsg('info', '完成播放');
            let rpt_data =  {
                code: -1
            };
            utils.xhrSend('POST', _server_url + '/api/report_play_status', null, JSON.stringify(rpt_data), function (xhr) {
                if(xhr.status === 200 && xhr.responseText != null){
                    try{
                        let data = JSON.parse(xhr.responseText);
                        if(data['code'] === 0) {
                            logMsg('info', '报告播放状态成功');
                        }else {
                            logMsg('warn', '报告播放状态失败');
                        }
                    }catch (e) {
                        logMsg('warn', '报告播放状态失败');
                    }
                }else{
                    logMsg('warn', '报告播放状态失败');
                }
            });
        }

    };
    jukeboxRuntime.player = new Howl(howl_data);
    jukeboxRuntime.player.once('load', function () {
        /*
        if(jukeboxRuntime.player.duration() < 40) {
            emptySong();
            setGetInv();
            return;
        }
         */
        flushPlayer();
        requestAnimationFrame(playerStep);

        statusMsg('load', '加载歌曲中');
        logMsg('info', '正在加载');
        let play_inv = setInterval(function () {
            let status = jukeboxRuntime.player.state();
            switch (status) {
                case Howl.loaded: case Howler.loaded: case 'loaded':
                    jukeboxRuntime.player.play();
                    requestAnimationFrame(playerStep);
                    clearInterval(play_inv);
                    break;
                case 'unloaded':
                    jukeboxRuntime.player.load();
                    break;
                default:
                    break;
            }
        }, 1000);
    });
    jukeboxRuntime.player.once('play', function () {
        statusMsg('ok', '开始播放');
        logMsg('info', '开始播放');
        let rpt_data =  {
            code: 0,
            song: jukeboxRuntime.songs.data
        };
        utils.xhrSend('POST', _server_url + '/api/report_play_status', null, JSON.stringify(rpt_data), function (xhr) {
            if(xhr.status === 200 && xhr.responseText != null){
                try{
                    let data = JSON.parse(xhr.responseText);
                    if(data['code'] === 0) {
                        logMsg('info', '报告播放状态成功');
                    }else {
                        logMsg('warn', '报告播放状态失败');
                    }
                }catch (e) {
                    logMsg('warn', '报告播放状态失败');
                }
            }else{
                logMsg('warn', '报告播放状态失败');
            }
        });
    });
    let play_btn = document.getElementById('player_btn_play');
    jukeboxRuntime.player.once('play', function () {
        play_btn.setAttribute('tag', 'pause');
    });
    jukeboxRuntime.player.once('pause', function () {
        play_btn.setAttribute('tag', 'play');
    });
    jukeboxRuntime.player.load();
};

let replay = function () {
    if(!jukeboxRuntime.player) {
        return;
    }
    let conf = confirm('是否重新开始播放本歌？');
    if(conf) {
        jukeboxRuntime.player.seek(0);
        jukeboxRuntime.player.play();
        requestAnimationFrame(playerStep);
        document.getElementById('player_btn_play').setAttribute('tag', 'pause');
        statusMsg('default', '重新播放');
        logMsg('info', '重新播放');
    }
};

let nextPlay = function () {
    let conf = confirm('是否切歌，直接进入下一曲？');
    if(conf) {
        emptySong();
        setGetInv();
        statusMsg('default', '切歌');
        logMsg('info', '切歌');
    }
}

let playUrl = function () {
    if(!jukeboxRuntime.songs.url) {
        return;
    }
    console.log(jukeboxRuntime.songs.url);
    let urls = [];
    let cookies = [];
    let platform = jukeboxRuntime.songs.url['platform'];
    logMsg('info', '获取链接完成，平台:'+platform);
    switch (platform) {
        case 'netease':
            if(jukeboxRuntime.songs.url['code'] !== 0) {
                logMsg('error', '本歌不存在播放链接，将跳过');
                emptySong();
                setGetInv();
                return;
            }
            let data_arr = jukeboxRuntime.songs.url['data'];
            for(let i in data_arr) {
                let data = data_arr[i];
                if(data['code'] !== 0) {
                    continue;
                }
                switch (data['line']) {
                    case 1: case 2:
                        let url_data = data['data']['body']['data'][0]['url'];
                        let cookie_data = data['data']['cookie'][0];
                        urls.push(url_data);
                        cookies.push(cookie_data);
                        break;
                    case 3:
                        let url_data_3 = data['data'];
                        let cookie_data_3 = '';
                        urls.push(url_data_3);
                        cookies.push(cookie_data_3);
                        break;
                    default:
                        break;
                }
            }
            break;
        case 'qq':
            if(jukeboxRuntime.songs.url['code'] !== 0) {
                logMsg('error', '本歌不存在播放链接，将跳过');
                emptySong();
                setGetInv();
                return;
            }
            let url_data = jukeboxRuntime.songs.url['data'];
            urls.push(url_data)
            break;
        default:
            emptySong();
            setGetInv();
            break;
    }

    if(urls.length < 1) {
        emptySong();
        setGetInv();
        return;
    }

    jukeboxRuntime.songs.urls = urls;
    jukeboxRuntime.songs.cookie = cookies || [''];
    logMsg('info', '创建播放器...');
    createPlay();
}

let getUrl = function () {
    statusMsg('load', '获取歌曲播放链接中...');
    let url = _server_url + '/api/get_play_url';
    utils.xhrSend('POST', url, null, JSON.stringify(jukeboxRuntime.songs.data), function (ret) {
        //console.log(ret);
        if(ret['status'] === 200) {
            let res = ret['response'];
            try {
                res = JSON.parse(res);
            }catch (e) {
                jukeboxRuntime.songs.data = null;
                logMsg('error', '服务器数据异常返回');
            }
            console.log(res);
            if(res['code'] === 0){
                jukeboxRuntime.songs.url = res;
                playUrl();
                logMsg('ok', '获取链接成功');
            }else {
                logMsg('error', '本歌无法获取链接');
                statusMsg('error', '本歌无法获取链接');
                jukeboxRuntime.songs.data = null;
            }
        }else {
            logMsg('error', '获取连接失败(服务器异常)');
            statusMsg('error', '获取连接失败(服务器异常)');
            jukeboxRuntime.songs.data = null;
        }
    });
}

let getSong = function () {
    let url = _server_url + '/api/get_song';
    //emptySong();
    utils.xhrSend('GET', url, null, null, function (ret) {
        //console.log(ret);
        if(ret['status'] === 200) {
            let res = ret['response'];
            try {
                res = JSON.parse(res);
            }catch (e) {
                logMsg('error', '服务器数据异常返回');
                return;
            }
            console.log(res);
            if(res['code'] === 0){
                jukeboxRuntime.songs.data = res['data'];
                getUrl();
                logMsg('ok', '成功获取歌曲:'+res['data']['mname']);
                statusMsg('ok', '获取歌曲成功');
                //console.log('ok');
            }else {

            }
        }
    });
};

let setGetInv = function () {
    if(!jukeboxRuntime.songs.data) {
        statusMsg('load', '获取歌曲中...');
        getSong();
    }else {
        clearInterval(jukeboxRuntime.runtime.getInterval);
        jukeboxRuntime.runtime.getInterval = null;
    }
    if(!jukeboxRuntime.runtime.getInterval) {
        jukeboxRuntime.runtime.getInterval = setInterval(function () {
            if(!jukeboxRuntime.songs.data) {
                statusMsg('load', '获取歌曲中...');
                getSong();
            }else {
                clearInterval(jukeboxRuntime.runtime.getInterval);
                jukeboxRuntime.runtime.getInterval = null;
            }
        }, 8000);
    }else{
        clearInterval(jukeboxRuntime.runtime.getInterval);
        jukeboxRuntime.runtime.getInterval = null;
        setGetInv();
    }
};

let songMain = function () {
    emptySong();
    setGetInv();
    /*
    jukeboxRuntime.runtime.checkInterval = setInterval(function () {
        if(!jukeboxRuntime.runtime.getInterval && !jukeboxRuntime.songs.data) {
            //this.setGetInv();
            clearInterval(jukeboxRuntime.runtime.checkInterval);
        }
    }, 12000);
     */
};

let errpage = function () {
    updateStatus('error', '无法连接服务器');
    alert('连接服务器失败');
};

let init = function () {
    updateStatus('load', '初始化面板...');
    //updateStatus('default', '空闲');
    statusMsg('ok', '服务器初始化完成');
    createPage();
    updateStatus('default', '准备就绪');
    songMain();
};

checkServer();
checkQQ();

let statusChecker = setInterval(function () {
    if(serverStatus['main'] && serverStatus['qq'] && serverStatus['netease']) {
        clearInterval(statusChecker);
        if(!serverStatus['total']) {
            errpage();
            //init();
        }else {
            init();
        }
    }
}, 1000);

document.addEventListener('keypress', function (ev) {
    switch (ev.keyCode) {
        case 32:
            playerBtn(document.getElementById('player_btn_play').getAttribute('tag'));
            break;
    }
});