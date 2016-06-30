var txtCode = '';

function bindEvent() {
    $('#phone').on('input propertychange', function () {
            //输入内容中含有非数字时，将非数字替换为空 
            var reg = /\D/g,
                phone = $(this).val();
            $(this).val(phone.replace(reg, ''));
            //checkInout();
        })
        //密码绑定事件
        /* $('#pwd').on('input propertychange', function () {
             checkInout();
         })*/
        //密码开关
    $('#pwd_on_off').on('click', changePwd)
        //点击获取验证码
    $('#get_code_btn').on('click', getTestCode)
        //给所有文本框绑定事件
    $('.forms').on('input propertychange', 'input[data-check]', checkInput);
    //复选框添加事件
    $('#isRead').on('change', checkInput);
    //下一步
    $('#next').on('click', checkRegise)
}
//密码开关
function changePwd() {
    var $round = $('.round'),
        $pwd = $('#pwd');
    if ($('#pwd').attr('type') == 'password') {
        $round.css({
            '-webkit-transition': 'transform 0.3s linear',
            '-webkit-transform': 'translate3d(0,0,0)'
        })
        $pwd.attr('type', 'test');
        $(this).addClass('pwd-btn');
    } else {
        $round.css({
            '-webkit-transition': 'transform 0.3s linear',
            '-webkit-transform': 'translate3d(50px,0,0)'
        })
        $pwd.attr('type', 'password');
        $(this).removeClass('pwd-btn');
    }
}
//验证码
function getTestCode() {
    var phone = $.trim($('#phone').val()),
        times = 10,
        timer = null,
        timerFn = null,
        $btn = $(this);
    if ($btn.data('clicked')) {
        return;
    }
    if (!comm.checkPhone(phone)) {
        comm.showDialog('请输入有效的手机号码', '确定', function () {
            $('#phone').val('')
            return;
        });
    }
    comm.access_ser('./data/register.php', {
        phone: phone
    }, function (data) {
        data = data.result;
        if (data.errcode == 2) {
            comm.showDialog(data.risg, '重试')
        } else if (data.errcode == 1) {
            comm.showDialog(data.risg, '登录', function () {
                location.href = 'login.html'
            })
        } else {
            comm.showDialog('验证码发送成功', '登录', function () {
                txtCode = data.risg;
            })
        }

    })
    timer = setInterval(function () {
        times--;
        if (times <= 0) {
            clearInterval(timer);
            $btn.text('获取验证码').data('clicked', false);
        } else {
            $btn.text(times + '秒后重试').data('clicked', true);
        }
    }, 1000)

}
//验证是否全部输入以及同意条款
function checkInput() {
    var phone = $.trim($('#phone').val()),
        pwd = $.trim($('#pwd').val()),
        code = $.trim($('#code').val()),
        isRead = $('#isRead').prop('checked'),
        $next = $('#next');
    if (phone && pwd && code && isRead) {
        $next.addClass('activ');
    } else {
        $next.removeClass('activ');
    }
}
//注册
function checkRegise() {
    if (!$(this).is('.activ')) return;
    var phone = $.trim($('#phone').val()),
        pwd = $.trim($('#pwd').val()),
        code = $.trim($('#code').val());
    if (!comm.checkPhone(phone)) {
        //comm.showDialog('请输入有效的手机号码','确定');
        console.log(1);
        return;
    }
    if (!comm.checkPwd(pwd)) {
        comm.showDialog('请输入6-12位的数字字母下划线', '确定');
        return;
    }
    if (code != txtCode) {
        comm.showDialog('验证码有误', '确定');
        return;
    }
    comm.access_ser('./data/registersubmit.php', {
        phone: phone,
        pwd: pwd
    }, function (data) {
        var errCode = data.result.errcode;
        if (errCode == 1) {
            comm.showDialog('该手机号码已被注册', '确定', function () {
                local.href = 'login.html';
            })
        } else if (errCode == 2) {
            comm.showDialog('对不起，注册失败！请重试！', '确定')
        } else {
            comm.showDialog('恭喜您！注册成功！', '确定', function () {
                location.href = 'login.html';
            })
        }
    })
}
bindEvent();