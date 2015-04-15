if (typeof ChartsDashboard == "undefined") {
    var ChartsDashboard = {};
}

(function() {

    ChartsDashboard.chartModule = function(name, categories, data) {
        this.title = name;
        this.container = null;
        this.initParams = [];

        if (typeof categories !== 'undefined') {
            this.setCategories(categories);
        }

        if (typeof data !== 'undefined') {
            this.setData(data);
        }
    };

    ChartsDashboard.chartModule.prototype = {

        getTitle : function() {
            return this.title;
        },

        setContainer : function(container) {
            this.container = container;

            this._addHandlers();

        },

        getInitParams : function() {
            return this.initParams;
        },

        setInitParams : function(params) {
            this.initParams = params;
        },

        show : function() {
//            if (this.container.highcharts) {
//                this.container.highcharts().destroy();
//            }

            var chartOpts = this._prepareChartOptions();
            $('h4', this.container).text(this.getTitle());
            $('.chart-body', this.container).highcharts(chartOpts);
        },

        destroy : function() {
            if (this.container) {
                this.container.remove();
            }

            return true;
        },

        setData : function(data) {
            var rows = [];

            for (var key in data) {
                var item = {
                    "name" : key,
                    "data" : data[key]
                };

                rows.push(item);
            }

            this.chart_data = rows;
        },

        setCategories : function(categories) {
            this.categories = categories;
        },

        changeStartDate : function(date) {
            $.publish('chart.changeDate', [date]);
        },

        goFullScreen : function() {
            var container = $('#chart-modal');

            this.setContainer(container);
            this.show();

            container.modal('show');
        },

        _addHandlers : function() {
            if (!this.container.data('handlers')) {
                $('#fullscreen-btn', this.container).on('click', $.proxy(function () {
                    this.goFullScreen();
                    return false;
                }, this));

                $('#start-date', this.container).on('change', $.proxy(function(e) {
                    var date = $(e.currentTarget).val();
                    this.changeStartDate(date);
                    return false;
                }, this));

                this.container.data('handlers', 1);
            }
        },

        _prepareChartOptions : function() {
            var opts = {
                title : {
                    text : this.title
                },
                xAxis : {
                    categories : this.categories
                },
                yAxis : {
                    title : {
                        text : 'Hits count'
                    }
                },
                series : this.chart_data
            };

            return opts;
        }
    };
}());