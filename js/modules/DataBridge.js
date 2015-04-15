if (typeof ChartsDashboard == "undefined") {
    var ChartsDashboard = {};
}

(function() {
    ChartsDashboard.dataBridgeModule = function(raw_data) {
        this.chart_categories = this._extractCategories(raw_data.rows);
        this.chart_data = this._extractData(raw_data.rows);
    };

    ChartsDashboard.dataBridgeModule.prototype = {

        _extractCategories : function(rows) {
            var chart_categories = [];

            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                var category_parts = [];

                for (var key in row) {
                    if (key.indexOf('date') !== -1) {
                        category_parts.push(row[key]);
                    }
                }

                var category_name = category_parts.join('-');

                if ($.inArray(category_name, chart_categories) == -1) {
                    chart_categories.push(category_name);
                }
            }

            return chart_categories;
        },

        _extractData : function(rows) {
            var series = {};

            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];

                for (var key in row) {
                    if (key.length == 2) {
                        var series_name = row[key];

                        if (!series.hasOwnProperty(series_name)) {
                            series[series_name] = [];
                        }

                        series[series_name].push(parseInt(row.cnt));
                    }
                }
            }

            return series;
        },

        getCategories : function() {
            return this.chart_categories;
        },

        getData : function() {
            return this.chart_data;
        }
    };

}());