document.addEventListener('touchmove', function (e) {
    e.preventDefault
});
//设置一个本地存储
var ls = window.localStorage;
//解析地址栏参数的函数
function getParam() {
    var url = location.search.substr(1),
        obj = {};
    if (!url) return false;
    var arr = url.split('&')
    for (var i = 0, len = arr.length; i < len; i++) {
        var params = arr[i].split('=');
        obj[params[0]] = decodeURI(params[1]);
    }
    return obj;
}

function addZero(num) {
    if (num < 10) {
        return '0' + num;
    } else {
        return num;
    }
}
//获取日期
function getDateFormat(i, opt) {
    i = i ? i * 86400000 : 0;
    //创建一个当前的日期事件对象
    var today = opt ? new Date(opt.year, opt.month - 1, opt.day) : new Date(),
        tempDate = new Date();
    tempDate.setTime(today.getTime() + i);
    return tempDate.getFullYear() + '-' + addZero(tempDate.getMonth() + 1) + '-' + addZero(tempDate.getDate());
}

function callCalendar(ele, minDate, maxDate, pageType) {
    //调用日历组件
    ele.calendar({
        minDate: minDate,
        maxDate: maxDate,
        swipeable: true,
        hide: function () {
            if (pageType) {
                changeDateOut(pageType);
            } else {
                changeDateOut()
            };
        }
    }).calendar('show');
    $('.shadow').remove();
    $('ui-slideup-erap').addClass('calenderbox');
    var shadow = $('<span class="shadow"></span>');
    $('.calenderbox').append(shadow);
    $('.ui-slideup').addClass('calender');
}
//字符串转换num
function strToNum(str) {
    return str.replace(/-/g, '');
}
//字符串转Arr
function strToArr(str) {
    return str.split('-');
}
//隐藏日历修改离店日期 
function changeDateOut(action) {
    var dateIn = $('#date_in').val(),
        newDateOut = dateOut = $('#date_out').val();
    dateInNum = strToNum(dateIn),
        dateOutNum = strToNum(dateOut),
        dateInArr = strToArr(dateIn);

    //判断
    if (dateIn >= dateOut) {
        newDateOut = getDateFormat(1, {
            year: dateInArr[0],
            month: dateInArr[1],
            day: dateInArr[2]
        })
    }
    $('#date_out').val(newDateOut)

    //如果action为真说明不是首页
    if (action) {
        $('#inText').text(getMonthDay(dateIn));
        $('#outText').text(getMonthDay(newDateOut));
        //如果是list请求的是列表页  否则就是内容页
        if (action == 'list') {
            POST.dateIn = dateIn;
            POST.dateOut = newDateOut;
            POST.pageNo = 1;
            getHotel();
        }
    }
}
//获取日期格式中的月和日
function getMonthDay(str) {
    var arr = str.split('-');
    return arr[1] + '月' + arr[2] + '日';
}

//列表页和内容页的修改
function enditCalendar() {
    var today = new Date(),
        beginDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()),
        maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 90);
    $('#modify').on('click', function () {
        callCalendar($('#date_in'), beginDate, maxDate, $(this).data('type'));
    })
}

//ajax
function Comm() {

}
Comm.prototype = {
        //get请求
        access_ser: function (url, data, callback, async) {
            var _this = this;
            //显示加载动画
            this.showLoading();
            //判断是否设置async
            var asy = typeof (async) == "undefined" ? true : async;
            //ajax请求
            $.ajax({
                url: url,
                data: data,
                type: 'get',
                async: asy,
                dataType: 'json',
                error: function () {
                    //请求失败 显示弹出层
                    _this.hideLoading();
                    _this.showDialog('请求失败，请重试', '关闭');
                },
                success: function (data) {
                    //setTimeout(function () {
                    _this.hideLoading();
                    callback && callback(data);
                    //},1500)
                }
            })
        },
        //加载动画
        showLoading: function (option) {
            this.showMark();
            //创建加载动画
            if ($('#ui-id-loading').length == 0) {

                $('<div class="ui-id-loading" id="ui-id-loading"><img src="./img/loading.gif"></div>').appendTo("body");
            }
        },
        //隐藏加载
        hideLoading: function () {
            this.hideMark();
            $('#ui-id-loading').remove();
        },
        //显示遮罩
        showMark: function () {
            if ($('#ui-id-mark').length == 0) {
                $('<div class="ui-id-mark" id="ui-id-mark"></div>').appendTo('body');
            }
        },
        //隐藏遮罩
        hideMark: function () {
            if ($('#ui-id-mark').length > 0) {
                $("#ui-id-mark").remove();
            }
        },
        showDialog: function (msg, btn, callback) {

            var _this = this;
            _this.showMark();
            //创建弹框
            var html = '';
            if ($('#ui-id-dialog').length == 0) {
                html += '<div class="ui-id-dialog" id="ui-id-dialog">' + '<div class="tipcontainer">' + '<div class="content">' + msg + '</div>' + '<p><a href="javascript:void(0)" id="ui-id-btn">' + btn + '</a></p>' + '</div>' + '</div>';
                $(html).appendTo($('body'));
            }
            $('#ui-id-btn').on('click', function () {
                _this.hideMark();
                $('#ui-id-dialog').remove();
                callback && callback();
            })
        },
        //检测手机号码
        checkPhone: function (phone) {
            var reg = /^1[34578]\d{9}$/;
            if (reg.test(phone)) {
                return true;
            }
            return false;
        },
        //密码正则
        checkPwd: function (pwd) {
            var reg = /^[\w\.]{6,12}$/;      
            if (reg.test(pwd)) {
                return true;
            }
            return false;
        },
        //身份证正则
        checkCard: function (card) {
            var reg = /^\d{17}(\d|X)$/;
            if (reg.test(card)) {
                return true;
            }
            return false;
        }
    }
    //判断用户是否登录
function ifLogin(url) {
    comm.access_ser('./data/check.php', {}, function (data) {
        if (data.if_logined == 0) {
            location.href = './login.html';
            console.log('未登录')
            ls.setItem('url', url)
        } else {
            location.href = url;
        }
    })
}
var comm = new Comm();