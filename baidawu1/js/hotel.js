//解析地址栏中的参数
var params = getParam(),
    dateIn = params.date_in,
    dateOut = params.date_out,
    cityId = params.city_id,
    name = params.name ? params.name : '',
    isc = new iScroll('hotel_scroll'),
    pageSize = 4,
    pageNo = 1,
    POST = {
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
function getHotel(action) {
    comm.access_ser('./data/hotel.php', POST, function (datas) {
        hotelList(datas, action)
    })
}
//渲染数据
function hotelList(datas, action) {
    if (datas.errcode == 1) {
        $('#tipbox').css('display', 'block');
        $('#hotel_list').empty();
    } else {
        $('#tipbox').css('display', 'none');
        var count = datas.count,
            data = datas.result.hotel_list,
            html = '';
        7
        $.each(data, function (k, v) {
                html += '<div class="rows">' +
                    '<a href="detail.html?city_id=' + cityId + '&date_in=' + $('#date_in').val() + '&date_out=' + $('#date_out').val() + '&hotel_id=' + v.hotel_id + '&hotel_name=' + encodeURI(v.name) + '">' + '<dl>' + '<dt>' + '<img src="./img/01.jpg">' + '</dt>' + '<dd>' + '<h2>' + v.name + '</h2>' + '<p class="tip">' + '<span>4.5分</span>' + '<em>礼</em>' + '<em>促</em>' + '<em>返</em>' + '</p>' + '<p class="stars ">' + v.stars + '</p>' + '<p class="address">' + v.addr + '</p>' + '</dd>' + '</dl>' + '</a>' + '<div class="aslide">' + '<p class="price">￥' + v.low_price / 100 + '起</p>' + '</div>' + '</div>';
            })
            //是否显示加载更多
        if (POST.pageNo * POST.pageSize < count) {
            $('.load_more').css('display', 'block');
        } else {
            $('.load_more').css('display', 'none');
        }
        if (!action) $('#hotel_list').empty();
        $(html).appendTo($('#hotel_list'));
        isc.refresh();
    }
}

function bindEvent() {
    //加载更多
    $('.load_more').on('click', function () {
            POST.pageNo += 1;
            getHotel('loadMore')
        })
        //导航切换
    $('#ftnav').on('click', 'a', function () {
        var idx = $(this).index();
        comm.showMark();
        var $layer = $('#item_layer');
        $layer.css({
            '-webkit-transition': 'height 0.3s linear',
            'height': '20rem'
        })
        $(this).addClass('cur_item').siblings().removeClass('cur_item')
            //显示对应弹出层
        $layer.children('div').eq(idx).addClass('cur_layer').siblings().removeClass('cur_layer')
    })
}
//触摸显示底部导航
function showNav() {
    var $scroll = $('#hotel_scroll'),
        $ftnav = $('#ftnav'),
        startY,
        offsetY;
    $scroll.on('touchstart', function (e) {
        startY = e.touches[0].clientY;
    })
    $scroll.on('touchmove', function (e) {
        offsetY = e.touches[0].clientY - startY;
    })
    $scroll.on('touchend', function (e) {
        var offset_y = Math.abs(offsetY);
        if (offset_y > 20) {
            if (offsetY < 0) {
                $ftnav.css({
                    '-webkit-transition': 'height 0.3s linear',
                    'height': '3rem'
                })
            } else {
                $ftnav.css({
                    '-webkit-transition': 'height 0.3s linear',
                    'height': '0'
                })
            }
        }
    })
}

//渲染排序
function rendSort() {
    var oder = {
        '0': '不限',
        'hot': '人气最高',
        'priceMax': '价格从高到低',
        'priceMin': '价格从低到高'
    };
    var htmlArr = ['<ul>'];
    $.each(oder, function (k, v) {
        htmlArr.push('<li id="' + k + '">', '<a href="javascript:void(0)">',
            '<span onclick="checkSort(\'' + k + '\')"></span>',
            '<b>' + v + '</b>',
            '</a>',
            '</li>');
    })
    htmlArr.push('</ul>');
    $('#sort').html(htmlArr.join("")).find('li').eq(0).addClass('on');
}
//渲染价格区间
function rendPrice() {
    var price = {
        '0': ['不限', -1, -1],
        '1': ['0-100', 0, 100],
        '2': ['101-200', 101, 200],
        '3': ['201-300', 201, 300],
        '4': ['301-400', 301, 400],
        '5': ['401-500', 401, 500],
        '6': ['500以上', 500, -1]
    }
    var html = '<ul>';
    $.each(price, function (k, v) {
        html += '<li id="item' + k + '">' + '<a href="javascript:void(0)">' + '<span onclick="checkPrice(' + k + ',' + v[1] + ',' + v[2] + ')"></span>' + '<b>' + v[0] + '</b>' + '</a>' + '</li>';
    })
    html += '</ul>';
    $('#price').html(html).find('li').eq(0).addClass('on');
}
//渲染品牌
function rendBrand() {
    var brand = {
        '10': '不限',
        '12': '喜来登',
        '15': '如家',
        '18': '万豪',
        '35': '香格里拉',
        '39': '速8',
        '44': '莫泰168',
        '48': '汉庭',
        '49': '全季',
        '50': '锦江之星',
        '53': '里程',
        '68': '桔子',
        '110': '如家快捷',
        '132': '7天',
        '160': '布丁',
        '168': '格林豪泰',
        '286': '尚客优'
    }
    var html = '<ul>';
    $.each(brand, function (k, v) {
        html += '<li id="item' + k + '">' + '<a href="javascript:void(0)">' + '<span onclick="checkBrand(' + k + ',\'' + v + '\')"></span>' + '<b>' + v + '</b>' + '</a>' + '</li>';
    })
    html += '</ul>';
    $('#brand').html(html).find('li').eq(0).addClass('on');
}
//渲染星级
function rendStar() {
    var stars = {
        '0': '不限',
        '2': '二星以下/经济型',
        '3': '三星',
        '4': '四星',
        '5': '五星'
    }
    var html = '<ul>';
    $.each(stars, function (k, v) {
        html += '<li id="star' + k + '">' + '<a href="javascript:void(0)">' + '<span onclick="checkStar(' + k + ')"></span>' + '<b>' + v + '</b>' + '</a>' + '</li>';
    })
    html += '</ul>';
    $('#star').html(html).find('li').eq(0).addClass('on');
}
//选择sort排序方式
function checkSort(k) {
    var $parent = $('#' + k);
    $parent.addClass('on').siblings().removeClass('on');
    hideLayer();
    var v = k == 'all' ? -1 : k;
    $('#order').val(v);
    //ajax
    POST.sortType = $('#order').val();
    getHotel();
}
//选择price排序
function checkPrice(id, min, max) {
    $('#item' + id).addClass('on').siblings().removeClass('on');
    hideLayer();
    min = min == -1 ? -100 : min * 100;
    max = max == -1 ? -100 : max * 100;
    $('#min').val(min);
    $('#max').val(max);
    POST.minPrice = $('#min').val();
    POST.maxPrice = $('#max').val();
    getHotel();
}
//选择酒店排序
function checkBrand(num, name) {
    $('#item' + num).addClass('on').siblings().removeClass('on');
    hideLayer();
    num = num == 10 ? -1 : name;
    $('#brand').val(num);
    POST.brand = $('#brand').val();
    getHotel();
}
//选择星级排序
function checkStar(k) {
    $('#star' + k).addClass('on').siblings().removeClass('on');
    hideLayer();
    k = k == 0 ? -1 : k;
    $('#star').val(k);
    POST.stars = $('#star').val();
    getHotel();
}
//隐藏弹层
function hideLayer() {
    setTimeout(function () {
        $('#item_layer').css({
            '-webkit-transition': 'height 0.3s linear',
            'height': '0'
        })
        comm.hideMark();
    }, 100)
}
rendSort();
rendPrice();
rendBrand();
rendStar();
showNav();
bindEvent();
getHotel();