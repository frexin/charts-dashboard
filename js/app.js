if (typeof ChartsDashboard == "undefined") {
    var ChartsDashboard = {};
}

(function() {
    var chartsFormContainer = $('#chart-new');
    var $chartsGrid = $('#charts-grid');

    var chartsFormModule = new ChartsDashboard.chartFormModule(chartsFormContainer);
    var remoteDataModule = new ChartsDashboard.remoteDataModule();
    var groupsListModule = new ChartsDashboard.groupsListModule($('#groups-list'));
    var chartsCollection = new ChartsDashboard.chartsCollection($chartsGrid, $('.chart-item.template'));

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
                chartsCollection.setId(response.id);

                for (var i = 0; i < response.items.length; i++) {
                    var item = response.items[i];

                    (function(item) {
                        remoteDataModule.requestStatData(item).done(function(response) {
                            var dataBridge = new ChartsDashboard.dataBridgeModule(response);
                            var chart = new ChartsDashboard.chartModule(item.name, dataBridge.getCategories(), dataBridge.getData());
                            chart.setInitParams(item);

                            chartsCollection.addItem(chart);
                        });
                    }(item));
                }
            }
        });
    });

    $.subscribe('chart.changeDate', function(e, date_start, date_end, chart) {
        var params = chart.getInitParams();
        params.from = moment(date_start, 'DD.MM.YYYY').format('YYYYMMDD');
        params.to = moment(date_end, 'DD.MM.YYYY').format('YYYYMMDD');

        remoteDataModule.requestStatData(params).done(function(response) {
            var dataBridge = new ChartsDashboard.dataBridgeModule(response);

            chart.setCategories(dataBridge.getCategories());
            chart.setData(dataBridge.getData());

            chart.show();
        });
    });

    $.subscribe('chart.remove', function(e, index, chart) {
        chartsCollection.removeItem(index);

        var collectionId = chartsCollection.getId();

        if (collectionId) {
            var itemsData = chartsCollection.serialize();
            remoteDataModule.updateCollection(collectionId, itemsData);
        }
    });

    chartsFormContainer.on('submit', function() {
        if (chartsFormModule.validate()) {
            var preparedData = chartsFormModule.getPreparedData();

            remoteDataModule.requestStatData(preparedData).done(function(response) {
                var dataBridge = new ChartsDashboard.dataBridgeModule(response);
                var chart = new ChartsDashboard.chartModule(preparedData.name, dataBridge.getCategories(), dataBridge.getData());
                chart.setInitParams(preparedData);

                chartsCollection.addItem(chart);
            });
        }

        return false;
    });

    $('#block-toggle').on('click', function() {
        var $block = $('#block-content');
        var $arrow = $('#arrow');

        if ($block.is(':visible')) {
            $arrow.removeClass('glyphicon-chevron-left').addClass('glyphicon-chevron-right');
            $block.addClass('hide');
        }
        else {
            $arrow.removeClass('glyphicon-chevron-right').addClass('glyphicon-chevron-left');
            $block.removeClass('hide');
        }
    });

    $chartsGrid.sortable({
        update : function(event, ui) {
            var collectionId = chartsCollection.getId();

            if (collectionId) {
                var sequence = $chartsGrid.sortable('toArray', {attribute: 'data-id'});
                sequence.shift();

                chartsCollection.reorder(sequence);
                remoteDataModule.updateCollection(collectionId, chartsCollection.serialize());
            }
        }
    });
})();
