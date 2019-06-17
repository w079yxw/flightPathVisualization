
$.fn.getMap=(function(theUrl, title){
    return $(this).click(function () {
        $("#map").attr("src", theUrl);
        $("#dropdownbutton").html(title);
    });
});
$(function() {
    $('#poverty').getMap('https://github.gatech.edu/pages/gni7/DVAWeData/html/poverty-map.html', "Poverty Map");
    $('#population').getMap('https://github.gatech.edu/pages/gni7/DVAWeData/html/total-population-map.html', "Population Map");
    $('#cap').getMap('https://github.gatech.edu/pages/gni7/DVAWeData/html/income-per-cap-map.html', "Income per capital Map");
    $('#construction').getMap('https://github.gatech.edu/pages/gni7/DVAWeData/html/construction-map.html', "Construction Map");
    $('#drive').getMap('https://github.gatech.edu/pages/gni7/DVAWeData/html/drive-map.html', "Drive Map");
    $('#meancommute').getMap('https://github.gatech.edu/pages/gni7/DVAWeData/html/mean-commute-map.html', "Mean Commute Map");
    $('#transit').getMap('https://github.gatech.edu/pages/gni7/DVAWeData/html/transit-map.html', "Transit Map");
    $('#production').getMap('https://github.gatech.edu/pages/gni7/DVAWeData/html/production-map.html', "Production Map");
});