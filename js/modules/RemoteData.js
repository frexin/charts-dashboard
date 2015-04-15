if (typeof ChartsDashboard == "undefined") {
    var ChartsDashboard = {};
}

(function() {

    ChartsDashboard.remoteDataModule = function() {
        this.local_url = "backend.php";
    };

    ChartsDashboard.remoteDataModule.prototype = {

        requestStatData : function(params) {
            var date_from = moment().subtract(7, 'days').format('YYYYMMDD');
            var date_to   = moment().format('YYYYMMDD');

            var url = "http://agg.vkontakte.dj/stat.get?jsoncb=?&format=json";

            var defaultParams = {
                source : "custom_stat",
                from : date_from,
                to : date_to,
                fields : "cnt,ip_uniq,uid_uniq"
            };

            var reqParams = $.extend(defaultParams, params)
            var promise = $.getJSON(url, reqParams);

            return promise;
        },

        requestCollectionNames : function() {
            var promise = $.getJSON(this.local_url, {"action" : "collection.names"});

            return promise;
        },

        saveCollection : function(name, items) {
            var promise = $.getJSON(this.local_url, {"action" : "collection.save", "params" : {
                "name" : name, "items" : items
            }});

            return promise;
        },

        requestCollection : function(collection_id) {
            var promise = $.getJSON(this.local_url, {"action" : "collection.get", "params" : {
                "id" : collection_id
            }});

            return promise;
        }
    };
}());