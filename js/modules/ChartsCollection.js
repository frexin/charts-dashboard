if (typeof ChartsDashboard == "undefined") {
    var ChartsDashboard = {};
}

(function() {

    ChartsDashboard.chartsCollection = function(grid_container, chart_template) {
        this.container = grid_container;
        this.template = chart_template;

        this.items = [];
    };

    ChartsDashboard.chartsCollection.prototype = {

        addItem : function(Chart) {
            this.items.push(Chart);

            var newChartNode = this._getEmptyNode();

            this.container.append(newChartNode);

            Chart.setContainer(newChartNode);
            Chart.show();
        },

        getItems : function() {
            return this.items;
        },

        clear : function() {
            for (var i = 0; i < this.items.length; i++) {
                var chart = this.items[i];
                chart.destroy();
            }

            this.items = [];
        },

        serialize : function() {
            var serializedData = [];

            for (var i = 0; i < this.items.length; i++) {
                var chart = this.items[i];
                serializedData.push(chart.getInitParams());
            }

            return serializedData;
        },

        _getEmptyNode : function() {
            var chartNode = this.template.clone();
            chartNode.removeClass('hide');

            return chartNode;
        }
    };
}());