var TRIP_API_KEY = "89DE2CFC0C1C43978B484B55F9A514EC";

var Note  = Backbone.Model.extend({
        defaults: {
                title: '',
                completed: false
        }
});

var NoteList = Backbone.Collection.extend({
        model: Note,
        localStorage: new Store("backbone-todo")
});

var AppView = Backbone.View.extend({
        // el - stands for element. Every view has a element associate in with HTML
        //      content will be rendered.
        el: "hi",
        // It's the first function called when this view it's instantiated.
        initialize: function(){
                this.render();
        },
        // $el - it's a cached jQuery object (el), in which you can use jQuery functions
        //       to push content. Like the Hello World in this case.
        render: function(){
                console.log(this.el);
                $(this.el).append("<li>hello world</li>");
        }


});


function initialize(){
        note = new Note();
        list = new NoteList();
        list.add(note);
        view = new AppView();
        // get_restaurants_info(42.33141,-71.099396, "attractions");
}

function get_restaurants_info(lat, lng, type){
        url = "http://api.tripadvisor.com/api/partner/2.0/map/"
        url += lat + ","+ lng + "/" + type + "?";
        url += 'key=' + TRIP_API_KEY;

        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onload = function (e) {
                if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                                console.log(xhr.responseText);
                        } else {
                                console.error(xhr.statusText);
                        }
                }
        };
        xhr.send(null);
}


window.load = initialize();
