const NMusicApi = require("NeteaseCloudMusicApi");
const QMusicApi = require("qq-music-api");

const fs = require('fs');
const jsonfile = require('jsonfile');
const request = require('request');
const {Log} = require("./log");

_model_name = 'Api';
let log = new Log(_model_name);

let cookie = {
    "netease": null
};

class Api {
    constructor() {
        const QMusicApi = require('qq-music-api');
        const NMusicApi = require('NeteaseCloudMusicApi');

        this.init = async function () {
            log.info('Initialize Api');
            let cookie_data = null;
            if(fs.existsSync('./config/cookie.json')) {
                try {
                    cookie_data = jsonfile.readFileSync('./config/cookie.json');
                }catch (e) {
                    log.warn('警告:无法读取Cookie配置，这意味着歌曲无法正常播放');
                }
            }else {
                log.warn('警告:无法读取Cookie配置，这意味着歌曲无法正常播放');
            }
            let qq_cookie = cookie_data['qq'];
            let netease_cookie = cookie_data['netease']['data'];
            if(!qq_cookie) {
                log.warn('警告:无法获取QQ音乐Cookie配置');
            }
            if(!netease_cookie) {
                log.warn('警告:无法获取网易云音乐Cookie配置');
            }else {
                cookie.netease = netease_cookie;
            }
            //console.log(qq_cookie);
            await QMusicApi.setCookie(qq_cookie['data']);
            //console.log(QMusicApi.cookie);
            /*
            await QMusicApi.api('/user/refresh')
                .catch((err) => {
                    console.log(err);
                });
             */
        }

        //QQ音乐搜索匿名函数
        let QM_search = async function (kw, type, page, size) {
            /*
                kw:搜索关键词
                type:搜索模式（0:单曲, 2:歌单, 7:歌词, 8:专辑, 9:歌手, 12:MV）
                page:页码
                size:每页包含结果数
             */
            return await QMusicApi.api('search', {key: kw, pageNo: page, t: type, pageSize: size})
                .catch((err) => {
                    log.error(err);
                });
            /* //性能优化，原Promise写法废弃，直接await Api返回
            return new Promise((resolve, reject) => {
                QMusicApi.api('search', {key: kw, pageNo: page, t: type, pageSize: size})
                    .then((res) => {
                        resolve(res);
                    }
                    )
                    .catch(error => {
                        reject(error);
                    });
            });
            */
        }
        
        let NM_search = async function (kw, type, page, size) {
            return await NMusicApi.search({keywords: kw, type: type, limit: size, offset: (page-1)*size})
                .catch((err) => {
                    log.error(err);
                });
            //写法优化，调试变量res删除
            /*
            let res = await NMusicApi.search({keywords: kw, type: type, limit: size, offset: (page-1)*size});
            //console.log(res);
            return res;
            */
        }
        
        let QM_play = async function (mid, mediaid ,quality) {
            //let ret = await QMusicApi.api('/song/urls', {id: mid, mediaid: mediaid});
            //console.log(ret);
            //return ret;
            //音频质量类型kv表

            let qtype = {
                'mp3_128': 128,
                'mp3_320': 320,
                'flac': 'flac',
                'ape': 'ape'
            };
            let data = {
                code: 1,
                platform: 'qq'
            };
            data['code'] = 0;
            let qret = await QMusicApi.api('/song/url', {id: mid, mediaId: mediaid, isRedirect: 1})
                .catch(err => function () {
                    data['code'] = 1;
                });
            console.log(qret);
            if(!qret || !qret['mid']) {
                data['code'] = 1;
                log.warn('QQ音乐当前Cookie疑似已过期，将无法获取播放链接');
            }
            //console.log(qret);
            let url = qret['mid'] || null;
            data['data'] = url;

            return data;


            /* //性能优化，原Promise写法废弃，直接await Api返回
            return new Promise((resolve, reject) => {
                QMusicApi.api('/song/url', {id: mid, mediaId: mediaid, type: qtype[quality[0]]})
                    .then((res) => {
                        console.log(res);
                        resolve(res);
                    })
                    .catch(error => {
                        console.log(error);
                        reject(error);
                    });
            });
             */
        };

        let NM_play = async function (sid) {
            let qtype = ['lossless', 'exhigh', 'higher', 'standard'];
            let line = [
                async (sid, qtype) => {
                    for(let i in qtype) {
                        let ret = await NMusicApi.song_url_v1({id: sid, level: qtype[i], cookie: cookie.netease})
                            .catch((err) => {
                                return null;
                            });
                        //console.log(qtype[i]);
                        //console.log(ret['body']['data'][0]);
                        if(Number(ret['status']) !== 200) {
                            return null;
                        }
                        if(ret && ret['body']['data']['url']) {
                            return {
                                code: 0,
                                line: 1,
                                data: ret
                            };
                        }
                    }
                },
                async (sid, qtype) => {
                    let res = await NMusicApi.song_url({id: sid});
                    if(Number(res['status']) !== 200) {
                        return null;
                    }
                    return {
                        code: 0,
                        line: 2,
                        data: res
                    };
                },
                async (sid, qtype) => {
                    let url = "https://music.163.com/song/media/outer/url?id="+sid+".mp3";
                    return {
                        code: 0,
                        line: 3,
                        data: url
                    };
                }
            ];

            let res = [];
            let data = {
                code: 1,
                platform: 'netease'
            };
            for(let i in line) {
                let ret = await line[i](sid, qtype);
                if(ret != null) {
                    switch (ret['line']) {
                        case 1: case 2:
                            if(ret['data']['body']['data'][0]['freeTrialInfo'] !== null) {
                                //data['code'] = 1;
                                //data['msg'] = 'This is Free Trial Song.';
                                break;
                            }else {
                                res.push(ret);
                                data['code'] = 0;
                            }
                            break;
                        case 3:
                            res.push(ret);
                            data['code'] = 0;
                            break;
                    }

                }
            }
            data['data'] = res;
            return data;

            //let res = await NMusicApi.song_url({id: sid});
            //console.log('song_url');
            //console.log(res['body']['data'][0]);
            //return ;
            //if(Number(res['status']) !== 200) {
            //    return null;
            //}
            //console.log(res['body']['data'])
            //return res['body']['data'][0]['url'];
        }
        
        this.searchSongs = async function (kw, page) {
            let size = 100;
            let songs = [];

            let nres = await NM_search(kw, 1, page, size);

            if(Number(nres.status) === 200) {
                //console.log(nres.body.result);
                let sarr = nres.body.result.songs;
                if(nres.body.result.songs){
                    let scount = sarr.length;
                    for(let i = 0; i < scount; ++i) {
                        let sa = sarr[i];
                           //console.log(sa);
                        let oarts = sa.artists;
                        let arts_count = oarts.length;
                        let arts = [];
                        for (let j = 0; j < arts_count; ++j) {
                            arts.push(oarts[j].name);
                        }
                        let song = {
                            platform: 'netease',
                            sid: sa.id,
                            mname: sa.name,
                            marts: arts,
                            malbum: sa.album.name,
                            mtime: sa.duration,
                            mcr: sa.copyright,
                        };
                        songs.push(song);
                    }
                }
            }

            //console.log(qres.code);

            //let qres = await QM_search(kw, 0, page, size);
            let qres = {
                code: -1
            }
            //console.log(qres);
            if(Number(qres.code) === 0) {
                let sarr = qres.list;
                if(qres.list) {
                    let scount = sarr.length;

                    let squality = [
                        {key: 'mp3_128', size_key: 'size128'},
                        {key: 'mp3_320', size_key: 'size320'},
                        {key: 'flac', size_key: 'sizeflac'},
                        {key: 'ape', size_key: 'sizeape'}
                    ];

                    for(let i = 0; i < scount; ++i) {
                        let sa = sarr[i];
                        let oarts = sa.singer;
                        let arts_count = oarts.length;
                        let arts = [];
                        for (let j = 0; j < arts_count; ++j) {
                            arts.push(oarts[j].name);
                        }

                        //console.log(sa);

                        let allow_quality = [];
                        for (let k = 3; k >= 0; --k) {
                            let quality = squality[k];
                            let q_size = sa[quality.size_key];
                            if(q_size > 0) {
                                allow_quality.push(quality.key);
                            }
                        }

                        let song = {
                            platform: 'qq',
                            sid: sa.songid,
                            mid: sa.songmid,
                            mediaid: sa.strMediaMid,
                            mname: sa.name,
                            marts: arts,
                            malbum: sa.albumname,
                            quality: allow_quality
                        };
                        songs.push(song);
                    }
                }
            }

            let ret = {
                page: page,
                size: size,
                ncount: nres['songCount'],
                qcount: 1,//qres['total'],
                songs: songs
            }

	    //console.log(ret);

            return ret;
        }

        this.playMusic = async function (songData) {
            if(!songData['platform']) {
                return null;
            }
            let platform = songData['platform'];
            switch (platform) {
                case 'qq':
                    let qq_play = await QM_play(songData['mid'], songData['mediaid'], songData['quality']);
                    console.log(qq_play);
                    return qq_play;
                    break;

                case 'netease':
                    let nm_play = await NM_play(songData['sid']);
                    //console.log(nm_play);
                    return nm_play;
                    break;

                default:
                    return null;
                    break;
            }
        }
    }
}

module.exports = {
    Api
};