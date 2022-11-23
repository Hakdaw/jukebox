let utils = new Utils();

let offset = 0;
let alldata = true;

function formatAudit() {
    let dom_title = document.getElementById('box_single_title');

    dom_title.innerText = '当前无歌曲';
}

function audit(uiid, status, index) {
    if(!uiid) {
        return;
    }
    status = (status === undefined) ? true : status;
    status = !!(status);
    index = (index === undefined) ? null : index;
    let url = window.location.origin + '/api/change_song_status';
    let data = {
        uiid: uiid,
        status: status
    }
    if(index != null) {
        data['index'] = index;
    }
    data = JSON.stringify(data);
    utils.xhrSend('POST', url, null, data, function (ret) {
        if(ret['status'] === 200) {
            let res = ret['response'];
            try {
                res = JSON.parse(res);
            }catch (e) {
                alert('审核失败,服务器异常');
            }
            //console.log(res);
            if(res['code'] === 0){
                let audit_status = (res['ret']['status'])?'已通过':'未通过';
                alert('歌曲 '+res['ret']['mname']+' 审核成功\n当前审核状态: ' + audit_status);
                getAudit('single');
                getAudit('list');
            }else {
                alert('审核失败,歌曲不存在');
            }
        }else {
            alert('审核失败,服务器异常');
        }
    });
}

function delsong(uiid) {
    if(!uiid) {
        return;
    }
    let url = window.location.origin + '/api/del_song?uiid=' + uiid;

    utils.xhrSend('POST', url, null, null, function (ret) {
        if(ret['status'] === 200) {
            let res = ret['response'];
            try {
                res = JSON.parse(res);
            }catch (e) {
                alert('审核失败,服务器异常');
            }
            //console.log(res);
            if(res['code'] === 0){
                alert('歌曲 '+res['ret']['mname']+' 审核成功\n当前审核状态: ' + '已删除');
                getAudit('single');
                getAudit('list');
            }else {
                alert('审核失败,歌曲不存在');
            }
        }else {
            alert('审核失败,服务器异常');
        }
    });
}

function flushPlayer(song) {
    console.log(song);
    let dom = {
        title: document.getElementById('player_title'),
        subtitle: document.getElementById('player_subtitle'),
        audio: document.getElementById('player_audio_box')
    };
    let mart = '';
    for(let art in song['marts']) {
        mart = mart + '/' + song['marts'][art];
    }
    mart = mart.slice(1);

    let subt = song['platform'] + '-' + mart;

    dom.title.innerText = song['mname'];
    dom.subtitle.innerText = subt;
    let url = '';
    switch (song['platform']) {
        case 'netease':
            url = "https://music.163.com/song/media/outer/url?id="+song['sid']+".mp3";
            break;
        case 'qq':

            break;
    }

    dom.audio.src = url;
    dom.audio.load();
    dom.audio.currentTime = 0;
}

function changeSingleBox(song) {
    let title_dom = document.getElementById('box_single_title');
    let btn_pass = document.getElementById('box_single_btn_pass');
    let btn_del = document.getElementById('box_single_btn_delete');
    title_dom.innerText = song['mname'];
    btn_pass.onclick = function () {
        audit(song['uiid'], true, song['index']);
    }
    btn_del.onclick = function () {
        delsong(song['uiid']);
    }
}

function moveSong(uiid) {
    let index = prompt('插队位置：', '1');
    index = parseInt(index);
    if(isNaN(index)) {
        alert('输入非数字');
        return;
    }
    index = (index < 1)?1:index;
    index = index-1;
    utils.xhrSend('GET', '/api/move_song?uiid=' + uiid + '&index=' + index, null, null, function (ret) {
        if(ret['status'] === 200) {
            let res = ret['response'];
            try {
                res = JSON.parse(res);
            }catch (e) {
                alert('插队失败,服务器异常');
            }
            //console.log(res);
            if(res['code'] === 0){
                alert('插队成功\n新位置:' + (index + 1));
                getAudit('single');
                getAudit('list');
            }else {
                alert('插队失败');
            }
        }else {
            alert('插队失败,服务器异常');
        }
    });
}

function getAudit(mode) {
    let url = null;
    let callback = null;
    switch (mode) {
        case 'single':
            url = '/api/query_queue?type=audit';
            if(offset >= 1) {
                url = url + '&offset=' + offset;
            }
            callback = function (data) {
                if(data['index'] === -1) {
                    alert('当前无待审核歌曲,请稍后刷新');
                    formatAudit();
                    return;
                }
                let single_data = data['data'];
                single_data['index'] = data['index'];
                changeSingleBox(single_data);
            }
            break;
        case 'list':
            url = '/api/query_queue?type=queue';
            callback = function (data) {
                let queue_data = data['data'];
                if(queue_data['length'] < 1) {
                    alert('当前无待审核歌曲,请稍后刷新');
                    formatAudit();
                    return;
                }
                let queue_list = queue_data['queue'];
                let list_dom = document.getElementById('box_list_songs-table-tbody');
		list_dom.innerText = '';
                for(let i in queue_list) {
                    let queue_i = queue_list[i];
                    let mart = '';
                    for(let art in queue_i['marts']) {
                        mart = mart + '/' + queue_i['marts'][art];
                    }
                    mart = mart.slice(1);
                    let need_pass = (queue_i['status'])?'display:none;':'';
                    let json_data = JSON.stringify(queue_i);
                    json_data = json_data.replace(/"/g, '\'');
                    console.log(json_data);
                    if(queue_i['status']) {
                        if(alldata) {
                            let audit_list_data2 = `<td style="display: flex;"><div id="audit_op" tag="del" onclick="audit('${queue_i['uiid']}',false, ${i})">取消通过</div><div id="audit_op" tag="op" onclick="moveSong('${queue_i['uiid']}')">插队</div><div id="audit_op" tag="del" onclick="delsong('${queue_i['uiid']}')">删除</div></td><td style="color: #328032;font-weight: bold;">${(queue_i['status'])?'已审核':'未审核'}</td><td><div onclick="flushPlayer(${json_data});" style="cursor: pointer;"> ${queue_i['mname']}</div></td><td>${mart}</td><td>${(queue_i['platform'] === 'netease')?'网易云':'QQ'}</td>`;
                            let audit_list_dom2 = document.createElement('tr');
                            audit_list_dom2.innerHTML = audit_list_data2;
                            list_dom.appendChild(audit_list_dom2);
                        }
                        continue;
                    }
                    let audit_list_data = `<td style="display: flex;"><div id="audit_op" tag="pass" onclick="audit('${queue_i['uiid']}',true, ${i})">通过</div><div id="audit_op" tag="op" onclick="moveSong('${queue_i['uiid']}')">插队</div><div id="audit_op" tag="del" onclick="delsong('${queue_i['uiid']}')">删除</div></td><td>${(queue_i['status'])?'已审核':'未审核'}</td><td><div onclick="flushPlayer(${json_data});" style="cursor: pointer;"> ${queue_i['mname']}</div></td><td>${mart}</td><td>${(queue_i['platform'] === 'netease')?'网易云':'QQ'}</td>`;
                    let audit_list_dom = document.createElement('tr');
                    audit_list_dom.innerHTML = audit_list_data;
                    list_dom.appendChild(audit_list_dom);
                }
            }
            break;
        default:
            return;
            break;
    }

    if(!url) {
        return;
    }

    utils.xhrSend('GET', url, null, null, function (ret) {
        if(ret['status'] === 200) {
            let res = ret['response'];
            try {
                res = JSON.parse(res);
            }catch (e) {
                alert('获取失败,服务器异常');
            }
            //console.log(res);
            if(res['code'] === 0){
                if(callback === null) {
                    return;
                }
                callback(res);
            }else {
                alert('当前无待审核歌曲，请稍后手动刷新');
            }
        }else {
            alert('获取失败,服务器异常');
        }
    });
}

function changeFilter(filter) {
    alldata = filter;
    getAudit('list');
    let dom = document.getElementById('btn_change_filter');
    if(alldata) {
        dom.innerText = '切换至仅查看未审核歌曲';
        dom.onclick = function () {
            changeFilter(false);
        }
    }else {
        dom.innerText = '切换至全部数据';
        dom.onclick = function () {
            changeFilter(true);
        }
    }
}

function changeMode(mode) {
    switch (mode) {
        case 'single':
            getAudit(mode);
            document.getElementById('panel_single').style.display = '';
            document.getElementById('panel_list').style.display = 'none';
            document.getElementById('menu_mode_single').setAttribute('tag', 'chose');
            document.getElementById('menu_mode_list').setAttribute('tag', 'none');
            break;
        case 'list':
            getAudit(mode);
            document.getElementById('panel_single').style.display = 'none';
            document.getElementById('panel_list').style.display = '';
            document.getElementById('menu_mode_single').setAttribute('tag', 'none');
            document.getElementById('menu_mode_list').setAttribute('tag', 'chose');
            break;
        default:
            return;
            break;
    }
}