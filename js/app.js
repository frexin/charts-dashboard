if (typeof ChartsDashboard == "undefined") {
    var ChartsDashboard = {};
}

(function() {
    var chartsFormContainer = $('#chart-new');

    var chartsFormModule = new ChartsDashboard.chartFormModule(chartsFormContainer);
    var remoteDataModule = new ChartsDashboard.remoteDataModule();
    var groupsListModule = new ChartsDashboard.groupsListModule($('#groups-list'));
    var chartsCollection = new ChartsDashboard.chartsCollection($('#charts-grid'), $('.chart-item.template'));

    remoteDataModule.requestCollectionNames().done(function(response) {
        if (response.items) {
            groupsListModule.load(response.items);
        }
    });

    $.subscribe('groupsList.saveGroup', function(event, name) {
        var itemsData = chartsCollection.serialize();
        var saveResult = remoteDataModule.saveCollection(name, itemsData);

        saveResult.done(function(response) {
            if (response.group_id) {
                var newItem = {"name" : name, "id" : response.group_id};

                groupsListModule.addNewItem(newItem, true);
            }
        });
    });

    $.subscribe('groupsList.selectItem', function(event, id) {
        var groupData = remoteDataModule.requestCollection(id);

        groupData.done(function(response) {
            if (response.items) {
                chartsCollection.clear();

                for (var i = 0; i < response.items.length; i++) {
                    var item = response.items[i];

                    (function(name) {
                        remoteDataModule.requestStatData(item).done(function(response, chartItem) {
                            var dataBridge = new ChartsDashboard.dataBridgeModule(response);
                            var chart = new ChartsDashboard.chartModule(name, dataBridge.getCategories(), dataBridge.getData());

                            chartsCollection.addItem(chart);
                        });
                    }(item.name));
                }
            }
        });
    });

    chartsFormContainer.on('submit', function() {
        if (chartsFormModule.validate()) {
            var preparedData = chartsFormModule.getPreparedData();

            remoteDataModule.requestStatData(preparedData).done(function(response) {
                var dataBridge = new ChartsDashboard.dataBridgeModule(response);
                var chart = new ChartsDashboard.chartModule(preparedData.name, dataBridge.getCategories(), dataBridge.getData());
                chart.setInitParams(preparedData);

                chartsCollection.addItem(chart);

                $.subscribe('chart.changeDate', function(e, data) {
                    preparedData.from = moment(data, 'DD-MM-YYYY').format('YYYYMMDD');

                    remoteDataModule.requestStatData(preparedData).done(function(response) {
                        var dataBridge = new ChartsDashboard.dataBridgeModule(response);

                        chart.setCategories(dataBridge.getCategories());
                        chart.setData(dataBridge.getData());

                        chart.show();
                    });
                });
            });
        }

        return false;
    });
})();
