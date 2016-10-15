$(function() {
    $('form').submit(function() {
    	var data = {};
    	data.lat = $("#lat").val();
    	data.lng = $("#lng").val();
    	console.log(data.lat);
        $.ajax({
            type: 'post',
            url: '/events',
            data: data,
            success: function(data) {
            	console.log(data);
            }
        });
    });
});