if (typeof ChartsDashboard == "undefined") {
    var ChartsDashboard = {};
}

(function() {

    ChartsDashboard.groupsListModule = function(container) {
        this.container = container;
        this._addHandlers();
    };

    ChartsDashboard.groupsListModule.prototype = {

        load : function(list_data) {
            for (var i = 0; i < list_data.length; i++) {
                var item = list_data[i];

                this._renderItem(item);
            }
        },

        showSaveDialog : function() {
            var collection_name = prompt('Enter new group name');

            return collection_name;
        },

        addNewItem : function(item, select) {
            this._renderItem(item);

            if (typeof select !== 'undefined') {
                this.selectItem(item.id);
            }
        },

        selectItem : function(item_id) {
            $('a.list-group-item', this.container).removeClass('active');

            var selectedNode = $('a.list-group-item[data-id=' + item_id + ']', this.container);
            selectedNode.addClass('active');

            $.publish('groupsList.selectItem', [item_id]);
        },

        _renderItem : function(item) {
            var node = $('<a href="#" class="list-group-item"/>');

            node.text(item.name);
            node.attr('data-id', item.id);

            $('.list-group', this.container).append(node);
        },

        _addHandlers : function() {
            $('.list-group', this.container).on('click', '.list-group-item', $.proxy(function(event) {
                var selectedNode = $(event.currentTarget);
                var itemId = selectedNode.data('id');

                this.selectItem(itemId);
            }, this));

            $('#save-current-group', this.container).on('click', $.proxy(function() {
                var groupName = this.showSaveDialog();
                $.publish('groupsList.saveGroup', [groupName]);
            }, this));


            $('#update-current-group', this.container).on('click', $.proxy(function() {
                $.publish('groupsList.updateGroup', [this]);
                return false;
            }, this));

            $('.list-group', this.container).perfectScrollbar();
        }
    };
}());