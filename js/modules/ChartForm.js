if (typeof ChartsDashboard == "undefined") {
    var ChartsDashboard = {};
}

(function() {

    ChartsDashboard.chartFormModule = function(container) {
        this.container = container;
        this.validator = null;
    };

    ChartsDashboard.chartFormModule.prototype = {

        validate : function() {
            this.validator = this.container.validate();

            return this.container.valid();
        },

        clear : function() {
            this.validator.resetForm();
            return true;
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
        }
    };
}());