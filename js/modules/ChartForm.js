if (typeof ChartsDashboard == "undefined") {
    var ChartsDashboard = {};
}

(function() {

    ChartsDashboard.chartFormModule = function(container) {
        this.container = container;
        this.validator = null;
        this.currentChart = null;

        this._addHandlers();
    };

    ChartsDashboard.chartFormModule.prototype = {

        setCurrentChart : function(chart) {
            this.currentChart = chart;
        },

        getCurrentChart : function() {
            return this.currentChart;
        },

        validate : function() {
            this.validator = this.container.validate();

            return this.container.valid();
        },

        clear : function() {
            this.validator.resetForm();
            return true;
        },

        load : function(form_data) {
            var key;

            for (key in form_data) {
                if (form_data.hasOwnProperty(key)) {
                    var val = form_data[key];

                    switch (key) {
                        case 'name':
                        case 'filter':
                            $('input[name=' + key + ']', this.container).val(val);
                            break;
                        case 'keys':
                            var keys = val.split(',');
                            var last_key = keys.pop();
                            keys = keys.join(',');

                            $('input[name=group_x]', this.container).val(keys);
                            $('input[name=group_y]', this.container).val(last_key);
                            break;
                    }
                }
            }
        },

        getPreparedData : function() {
            var preparedData = {};
            var fields = this.container.serializeArray();

            for (var i = 0; i < fields.length; i++) {
                var field = fields[i];
                var propName = null;

                switch (field.name) {
                    case 'name':
                        propName = 'name';
                        break;
                    case 'filter':
                        propName = 'filter';
                        break;
                    case 'group_x':
                    case 'group_y':
                        propName = 'keys';
                        break;
                }

                if (typeof preparedData[propName] == 'undefined') {
                    preparedData[propName] = field.value;
                }
                else {
                    preparedData[propName] += ',' + field.value;
                }
            }

            return preparedData;
        },

        _addHandlers : function() {
            $(this.container).on('submit', $.proxy(function() {
                $.publish('form.addChart', [this]);
                return false;
            }, this));

            $('#update-chart-btn', this.container).on('click', $.proxy(function() {
                $.publish('form.updateChart', [this]);
            }, this));
        }
    };
}());