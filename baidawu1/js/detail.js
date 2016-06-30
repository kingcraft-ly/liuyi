//解析地址栏中的参数
var params = getParam(),
    dateIn = params.date_in,
    dateOut = params.date_out,
    cityId = params.city_id,
    hotelId = params.hotel_id,
    hotelName = params.hotel_name,
    stars = ['', '', '二星/经济型', '三星', '四星', '五星'],
    isc = new iScroll('section'),
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
    }
if (name) {
    POST.name = name;
}
//显示两个时间
$('#inText').text(getMonthDay(dateIn));
$('#outText').text(getMonthDay(dateOut));
$('#date_in').val(dateIn);
$('#date_out').val(dateOut);
//修改日期
enditCalendar();
//ajax请求
function getRoom(action) {
    comm.access_ser('./data/hotelDetail.json', POST, function (datas) {
        rendDetial(datas.result);
    })
}

function rendDetial(data) {
    var img = data.images.split(';')[0],
        $li = $('#hotel_info_list').children(),
        tel = data.tel.replace(/,/g, ' ');
    $('#hotel_img').children('img').attr('src', "./" + img);
    $('#hotel_name').text(data.name);
    $li.eq(0).text('星级：' + stars[data.star] + '级酒店');
    $li.eq(1).text('电话：' + tel);
    $li.eq(2).text('地址：' + data.addr);
    $('#description').text(data.desc);
    $('#sheshi').text(data.facilities);
    rendRoom(data);
}

function bindEvent() {
    $('.base_info').on('click', 'li', function () {
        var idx = $(this).index(),
            childs = $('.content_wrap').children();
        $(this).addClass('on').siblings().removeClass('on');
        childs.eq(idx).addClass('cur_info').siblings().removeClass('cur_info');
    })
    $('.hotel_btn').on('click', function () {
        var txt = $(this).prev();
        if ($(this).text() == '展开详情') {
            $(this).text('收起');
            txt.css({
                'height': 'auto'
            })
        } else {
            $(this).text('展开详情');
            txt.css({
                'height': '3.2rem'
            })
        }
    })
}

function rendRoom(data, action) {
    var roomData = data.room_types,
        html = '',
        img = data.images.split(';')[0],
        $list = $('#detail_list'),
        price = '';
    for (var i = 0, len = roomData.length; i < len; i++) {
        var obj = roomData[i];
        $.each(obj.goods, function (k, v) {
            price = Math.min.apply(null, v.price) / 100,
                btn = '';
            if (v.room_state == 0) {
                btn = '<span class="full">客 满</span>';
            } else {
                btn = '<span data-img="./' + img + '" data-type="' + obj.name + '" data-price="' + price + '" data-bed="' + obj.bed_type + '" data-id="' + v.room_id + '">预 定</span>';
            }
            html += '<div class="detail_box">' + '<dl>' + '<dt>' + obj.name + '</dt>' + '<dd>' + obj.bed_type + '免费早餐</dd>' + '</dl>' + '<p>￥' + price + '</p>' + btn + '</div>'
        })
    }
    if (action == 'undefined') $list.html('');
    $(html).appendTo($list);
    isc.refresh();
    //预定
    $list.on('click', 'span', function () {
            if ($(this).hasClass('full')) return;
            comm.showMark();
            $('#orderRoom').css({
                '-webkit-transition': 'height 0.3s linear',
                'height': '27.5rem'
            })
            $('#rooming').attr('src', $(this).data('img'));
            $('#room_type').text($(this).data('type'));
            $('#prices').text($(this).data('price'));
            $('#bed_type').text($(this).data('bed'));
            $('#img').val($(this).data('img'));
            $('#price').val($(this).data('price'));
            $('#room_name').val($(this).data('type'));
            $('#room_id').val($(this).data('id'));
        })
        //关闭预定
    $('#close').on('click', function () {
            comm.hideMark();
            $('#orderRoom').css({
                '-webkit-transition': 'height 0.3s linear',
                'height': '0rem'
            })
        })
        //点击预定
    $('#gotoOrder').on('click', function () {
        //获取订单页地址
        var url = 'order.html?city_id=' + cityId + '&data_in=' + $('#date_in').val() + '&data_out=' + $('#date_out').val() + '&hotel_id=' + hotelId + '&hotel_name=' + encodeURI(hotelName) + '&room_type=' + encodeURI($('#room_name').val()) + '&room_id=' + $('#room_id').val()+'&hotel_img='+img+'&price='+price;
            //判断用户是否已经登录
        ifLogin(url);
    })
}
getRoom();
bindEvent();