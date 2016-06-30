function init() {
    showCity();
    showCalendar();
    clickToSearch();
}
//焦点图
var swiper = new Swiper('.swiper-container', {
    pagination: '.swiper-pagination',
    slidesPerView: 1,
    paginationClickable: true,
    spaceBetween: 30,
    loop: true,
    autoplay: 1000
});
//显示当前城市
function showCity() {
    var $cityName = $('.in_city'),
        $cityId = $('#city_id');
    //判断地址栏中是否有参数
    if (getParam()) {
        var cityName = getParam().city_name,
            cityId = getParam().city_id;
        $cityName.text(cityName);
        $cityId.val(cityId)
        ls.setItem('city_name', cityName);
        ls.setItem('city_id', cityId);
    } else {
        $cityName.text('北京');
        $cityId.val('28');
        ls.setItem('city_id', '28');
        ls.setItem('city_name', '北京');
    }
}
// 日历a
function showCalendar() {
    var $dateIn = $('#date_in'),
        $dateOut = $('#date_out'),
        today = new Date(),
        beiginDate,
        maxDate;
    $('#date_in').val(getDateFormat());
    $('#date_out').val(getDateFormat(1));
    $('#date_in').on('focus', function () {
        beiginDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 90)
        callCalendar($(this), beiginDate, maxDate)
    })
    $('#date_out').on('focus', function () {
        beiginDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 91)
        callCalendar($(this), beiginDate, maxDate)
    })
}
//点击搜索函数
function clickToSearch() {
    $('#search').on('click', function () {
        var cityId = $('#city_id').val(),
            dateIn = $('#date_in').val(),
            dateOut = $('#date_out').val(),
            name = $('#name').val();
        location.href = './hotel.html?city_id=' + cityId + '&date_in=' + dateIn + '&date_out=' + dateOut + '&name=' + encodeURI(name) + '';
    })
}
init();