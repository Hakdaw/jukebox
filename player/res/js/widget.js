function updateStatus(type, text) {
    let icon = 'none';
    let box = 'default';
    switch (type) {
        case 'default':
            box = 'default';
            icon = 'none';
            break;
        case 'warn':
            box = 'warn';
            icon = 'warn';
            break;
        case 'error':
            box = 'error';
            icon = 'error';
            break;
        case 'load':
            box = 'default';
            icon = 'load';
            break;
        case 'ok':
            box = 'normal';
            icon = 'ok';
            break;
        default:
            box = 'default';
            icon = 'none';
            break;
    }
    let box_dom = document.getElementById('status_box');
    let icon_dom = document.getElementById('status_icon');
    let text_dom = document.getElementById('status_text');
    let box_tag = box_dom.getAttributeNode('tag');
    box_tag.nodeValue = box;
    let icon_tag = icon_dom.getAttributeNode('tag');
    icon_tag.nodeValue = icon;
    box_dom.setAttributeNode(box_tag);
    icon_dom.setAttributeNode(icon_tag);
    text_dom.innerHTML = text;
}

function statusMsg(type, text) {
    let icon = 'none';
    let box = 'default';
    switch (type) {
        case 'default':
            box = 'default';
            icon = 'none';
            break;
        case 'warn':
            box = 'warn';
            icon = 'warn';
            break;
        case 'error':
            box = 'error';
            icon = 'error';
            break;
        case 'load':
            box = 'default';
            icon = 'load';
            break;
        case 'ok':
            box = 'normal';
            icon = 'ok';
            break;
        default:
            box = 'default';
            icon = 'none';
            break;
    }
    let box_dom = document.getElementById('statusmsg_box');
    let icon_dom = document.getElementById('statusmsg_icon');
    let text_dom = document.getElementById('statusmsg_text');

    let box_tag = box_dom.getAttributeNode('tag');
    box_tag.nodeValue = box;
    let icon_tag = icon_dom.getAttributeNode('tag');
    icon_tag.nodeValue = icon;
    box_dom.setAttributeNode(box_tag);
    icon_dom.setAttributeNode(icon_tag);
    text_dom.innerHTML = text;

    box_dom.style.display = 'flex';

    setTimeout(function () {
        box_dom.style.display = 'none';
    }, 2500);
}