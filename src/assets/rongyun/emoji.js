// 初始化
RongIMLib.RongIMEmoji.init();
// 获取列表
var list = RongIMLib.RongIMEmoji.list;
var str = '';
list.forEach(item => {
        str += item.symbol
    })
    // console.log(list)
    // console.log(str)
    // 将 list 中的 Emoji 对应名称转化为 HTML
var emoji = RongIMLib.RongIMEmoji.symbolToHTML(str);

var emojiHtml; // 所有表情数组
var emojiDisplay; // 表情显示隐藏
document.querySelector('body').addEventListener('click', function(e) {
    if (e.target.nodeName == 'DIV' && e.target.className == 'expression') { // 判断点击展开表情
        emojiDisplay = document.querySelector('#emoji')
            // 判断表情显示隐藏
        if (emojiDisplay.style.display == 'block') {
            emojiDisplay.style.display = 'none'
        } else {
            emojiDisplay.style.display = 'block'
        }
        // 获取所有标签，添加点击事件
        if (!emojiHtml) {
            emojiHtml = document.querySelectorAll('span.rong-emoji-content')
        }
        emojiHtml.forEach(item => {
                // 设置移入显示title
                item.onmouseenter = function() {
                        var name = this.getAttribute('name')
                        this.setAttribute('title', name.slice(1, name.length - 1))
                    }
                    // 点击选择表情
                item.onclick = function() {
                    // console.log(this)
                    var name = this.getAttribute('name')
                    document.querySelector('.message-wrap textarea').value += name
                }
            })
            // console.log(emojiHtml)
    } else {
        if (emojiDisplay && emojiDisplay.style.display == 'block') {
            emojiDisplay.style.display = 'none'
        }
    }
})

export default emoji;