if (typeof ChartsDashboard == "undefined") {
    var ChartsDashboard = {};
}

(function() {
    ChartsDashboard.dataBridgeModule = function(raw_data) {
        this.events_names = [];

        this.chart_categories = this._extractCategories(raw_data.rows);
        this.chart_data = this._extractData(raw_data.rows);
    };

    ChartsDashboard.dataBridgeModule.prototype = {

        _extractCategories : function(rows) {
            var chart_categories = [];

            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                var event_name = null;

                for (var key in row) {
                    if (key.length == 2) {
                        event_name = row[key];
                    }
                }

                var category_name = this._getRowDate(row);

                if ($.inArray(category_name, chart_categories) == -1) {
                    chart_categories.push(category_name);
                }

                if ($.inArray(event_name, this.events_names) == -1) {
                    this.events_names.push(event_name);
                }
            }

            return chart_categories;
        },

        _extractData : function(rows) {
            var series = {};
            var filled_events = [];

            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                var curdate = this._getRowDate(row);
                var last_date;

                if (i == 0) {
                    last_date = curdate;
                }

                var series_name = '';

                for (var key in row) {
                    if (curdate != last_date) {
                        last_date = curdate;

                        var empty_events = $(this.events_names).not(filled_events).get();

                        if (empty_events.length) {
                            for (var j = 0; j < empty_events.length; j++) {
                                var event_name = empty_events[j];

                                if (!series.hasOwnProperty(event_name)) {
                                    series[event_name] = [];
                                }

                                series[event_name].push(0);
                            }
                        }

                        filled_events = [];
                    }

                    if (key.length == 2) {
                        series_name += row[key] + '_';
                    }
                    else if (series_name) {
                        if (!series.hasOwnProperty(series_name)) {
                            series[series_name] = [];
                        }

                        series[series_name].push(parseInt(row.cnt));
                        filled_events.push(series_name);
                    }
                }
            }

            return series;
        },

        _getRowDate : function(row) {
            var date_parts = [];
            var key;

            for (key in row) {
                if (key.indexOf('date') !== -1) {
                    date_parts.push(row[key]);
                }
            }

            var date = date_parts.join('-');

            return date;
        },

        getCategories : function() {
            return this.chart_categories;
        },

        getData : function() {
            return this.chart_data;
        }
    };

}());