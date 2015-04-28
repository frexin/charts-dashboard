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

        setTitle : function(title) {
            this.title = title;
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
            var chartOpts = this._prepareChartOptions();
//            $('h4', this.container).text(this.getTitle());
            $('.chart-body', this.container).highcharts(chartOpts);
        },

        destroy : function() {
            if (this.container) {
                this.container.remove();
            }

            return true;
        },

        remove : function() {
            var chartIndex = this._getChartIndex();
            this.destroy();
            $.publish('chart.remove', [chartIndex, this]);
        },

        edit : function() {
            $.publish('chart.edit', [this]);
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

        changeDateRange : function(date_start, date_end) {
            $.publish('chart.changeDate', [date_start, date_end, this]);
        },

        goFullScreen : function() {
            var container = $('#chart-modal');

            this.setContainer(container);
            this.show();

            container.modal('show');
        },

        _getChartIndex : function() {
            return this.container.index() - 1;
        },

        _addHandlers : function() {
            var self = this;

            if (!this.container.data('handlers')) {
                $('#fullscreen-btn', this.container).on('click', $.proxy(function () {
                    this.goFullScreen();
                    return false;
                }, this));

                $('#start-date', this.container).daterangepicker({ format: 'DD.MM.YYYY', drops : 'up', startDate : moment().subtract(7, 'days') },
                    function (start, end, label) {
                        self.changeDateRange(start, end);
                        return false;
                    });

                $('.delete-chart', this.container).on('click', $.proxy(function(e) {
                    this.remove();
                    return false;
                }, this));

                $('.edit-chart', this.container).on('click', $.proxy(function(e) {
                    this.edit();
                    return false;
                }, this));

                $('.info-chart', this.container).popover({
                    'title' : 'Chart properties',
                    'content' : JSON.stringify(this.initParams),
                    'trigger' : 'hover',
                    'placement' : 'bottom'
                });

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