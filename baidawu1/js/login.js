function init() {
    bindEvent();
}

function bindEvent() {
    //手机号码只能是数字
    $('#phone').on('input propertychange', function () {
            //输入内容中含有非数字时，将非数字替换为空 
            var reg = /\D/g,
                phone = $(this).val();
            $(this).val(phone.replace(reg, ''));
            checkInout();
        })
        //密码绑定事件
    $('#password').on('input propertychange', function () {
            checkInout();
        })
        //登录按钮
    $('#login').on('click', checkLogin)
}

function checkInout() {
    var phone = $('#phone').val(),
        pwd = $('#password').val(),
        $login = $('#login');
    if (phone && pwd) {
        $(login).addClass('activ');
    } else {
        $(login).removeClass('activ');
    }
}

function checkLogin() {
    if (!$(this).hasClass('activ')) return;
    var phone = $('#phone').val(),
        pwd = $('#password').val();
    if (!comm.checkPhone(phone)) {
        //console.log(comm.showDialog())
        comm.showDialog('请输入有效的手机号码', '确定', function () {
            $('#phone').val('');
        })
        return;
    } else if (!comm.checkPwd(pwd)) {
        comm.showDialog('密码输入错误，请重新输入', '确定', function () {})
        return;
    }
    //ajax请求
    var loginUser = {
        phone: phone,
        pwd: pwd
    }
    comm.access_ser('./data/checkuser.php', loginUser, function (data) {
        if (data.code == 1) {
            comm.showDialog(data.msg, '确定', function () {
                location.href = 'refister.html';
            })
        } else if (data.code == 2) {
            comm.showDialog(data.msg, '确定', function () {
                $('#password').val();
            })
        } else {
            location.href = ls.getItem('url');
        }
    })
}
init();