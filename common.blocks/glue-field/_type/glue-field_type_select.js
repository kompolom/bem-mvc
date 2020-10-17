modules.define('glue-field',
    ['select'],
    function(provide, Select, GlueField) {

provide(GlueField.declMod({ modName : 'type', modVal : 'select' }, {
    onSetMod: {
        js: {
            inited: function() {
                this.__base();
                this.select = this.findMixedBlock(Select);
            }
        }
    },

    init: function() {
        this.__base.apply(this, arguments);

        this._events(this.select)
            .on('change', function() {
                this.model.set(this.name, this.select.getVal());
            }, this);
    },

    set: function(value) {
        this.__base();
        this.select.setVal(value);
    },

    onFieldChange: function(e, data) {
        !this.select.hasMod('focused') && this.select.setVal(data.value);
    }

}));

});
