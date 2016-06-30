//解析地址栏中的参数
var params = getParam(),
    dateIn = params.data_in,
    dateOut = params.data_in,
    cityId = params.city_id,
    hotelId = params.hotel_id,
    hotelName = params.hotel_name,
    roomType = params.room_type,
    roomId = params.room_id,
    hotelImg = params.hotel_img,
    price = params.price,
    count = $('#roomcount').val(),
    pageSize = 10,
    pageNo = 1,
    POST = {
        hotelId: hotelId,
        hotelName: hotelName,
        cityId: cityId,
        dateIn: dateIn,
        dateOut: dateOut,
        pageNo: pageNo,
        pageSize: pageSize
    };
//渲染数据
function showHotel() {
    var data_in = getMonthDay(dateIn),
        data_out = getMonthDay(dateOut);
    $('#pics').attr('src', './' + hotelImg);
    $('#hotel_name').text(hotelName);
    $('#type_name').text(roomType);
    $('#book_price').append(price);
    $('#inText').text(data_in);
    $('#outText').text(data_out);
    $('#tprice').text('￥' + count * price + '元');
}

function bindEvent() {
    //点击添加
    $('#add').on('click', function () {
            if ($(this).hasClass('no')) {
                comm.showDialog('您最多只能预定5间房', '关闭');
                return;
            }
            var count = parseInt($('#roomcount').val());
            count = count >= 5 ? 5 : (count + 1);
            if (count == 5) {
                $(this).addClass('no');
            }
            $('#sub').removeClass('no');
            $('#roomcount').val(count);
            $('#tprice').text('￥' + count * price + '元');
            $('#rpeice').val('￥' + count * price + '元');
            appendNode(count);
        })
        //点击删除
    $('#sub').on('click', function () {
            if ($(this).hasClass('no')) {
                comm.showDialog('您已经不能取消预定了', '关闭');
                return;
            }
            var count = parseInt($('#roomcount').val());
            count = count <= 1 ? 1 : (count - 1);
            if (count == 1) {
                $(this).addClass('no');
            }
            $('#add').removeClass('no');
            $('#roomcount').val(count);
            $('#tprice').text('￥' + count * price + '元');
            $('#rpeice').val('￥' + count * price + '元');
            removeNode(count + 1);
        })
        //点击立即预定
    $('#booknow').on('click',orderInput)
}
//添加入住人信息
function appendNode(i) {
    var html = '<div class="userInfo" id = "info' + i + '">' + '<ul class="infos">' + '<li>' + '<i>姓名' + i + '</i>' + '<input type="text" placeholder="没间只需填写一个姓名" id="userName' + i + '" name="userName' + i + '">' + '<span class="clear_input">x</span>' + '</li>' + '</ul>' + '<ul class="infos">' + '<li>' + '<i>证件' + i + '</i>' + '<input type="text" placeholder="入住人身份证号/证件号" id="idcard' + i + '" name="idcard' + i + '">' + '<span class="clear_input">x</span>' + '</li>' + '</ul>' + '</div>';
    $(html).appendTo($('#info'));
    $('#userName' + i).showClear();
    $('#idcard' + i).showClear();
    $('.clear_input').clearInput();
}
//删除入住人信息
function removeNode(i) {
    $('#info' + i).remove();
}
function orderInput(){
    if(checkInput()){
        comm.showDialog('恭喜您，订单成功！','确定')
    }
}
function checkInput() {
    var $inputs = $('#info-boxs').find('input[type=text]'),
        len = $('#info-boxs').find('input[type=text]').size(),
        i;
    for (var i = 0; i < len; i++) {
        var $input = $inputs.eq(i),
            v = $input.val();
        if (!v) {
            comm.showDialog('入住信息不完整', '确定', function () {
                $input.focus();
            });
            return false;
            break;
        } else {
            if (i % 2 != 0 && $input.attr('id') != 'phone') {
                if (!comm.checkCard(v)) {
                    comm.showDialog('请输入有效的证件号码', '确定', function () {
                        $input.focus();
                    })
                }
            }
            if ($input.attr('id') == 'phone') {
                if (!comm.checkPhone(v)) {
                    comm.showDialog('请输入有效的手机号码', '确定', function () {
                        $input.focus();
                    })
                }
            }
        }
    }
    return true;
}
//封装插件
(function ($) {
    $.fn.showClear = function () {
        $(this).on('input propertychange', function () {
            var $span = $(this).next();
            if ($(this).val() != '') {
                $span.css('display', 'block');
            } else {
                $span.css('display', 'none');
            }
        })
    }
    $.fn.clearInput = function () {
        $(this).on('click', function () {
            $(this).prev().val('');
            $(this).css('display', 'none');
        })
    }
})(Zepto)
$('#info-boxs').find('input[type=text]').each(function () {
    $(this).showClear();
})
$('#info-boxs').find('span.clear_input').each(function () {
    $(this).clearInput();
})
bindEvent();
showHotel();