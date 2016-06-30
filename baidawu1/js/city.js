var Alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'W', 'X', 'Y', 'Z'];

function init() {
    showCity();
    showMore();
}

function showCity() {
    var cityName = localStorage.getItem('city_name'),
        cityId = localStorage.getItem('city_id');
    $('#city_name').text(cityName)
}

function showMore() {
    var html = "";
    for (var i = 0, len = Alphabet.length; i < len; i++) {
        html += "<a href='#city" + i + "'>" + Alphabet[i] + "</a>";
        //渲染列表
        Listhtml = '<div id="city' + i + '" class="listpage">' + '<p>' + Alphabet[i] + '</p>' + '<ul>'
        $.each(CITIES, function (key, val) {
            if (val[1].charAt(0) == Alphabet[i]) {
                Listhtml += "<li><a href='index.html?city_name=" + val[0] + "&city_id=" + key + "'>" + val[0] + "</a></li>";
            }
        })
        Listhtml += "</ul></div>";
        $(Listhtml).appendTo($(".listcity"));
    }
    $(html).appendTo($(".more"));
}
init();