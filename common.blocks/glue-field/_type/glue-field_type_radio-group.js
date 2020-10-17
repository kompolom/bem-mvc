modules.define('glue-field',
    ['radio-group'],
    function(provide, RadioGroup, GlueField) {

provide(GlueField.declMod({ modName : 'type', modVal : 'radio-group' }, {

    onSetMod : {
        js : {
            inited : function() {
                this.__base();
                this.input = this.findMixedBlock(RadioGroup);
            }
        }
    },

    init: function() {
        this.__base.apply(this, arguments);

        this._events(this.input)
            .on('change', function() {
                this.model.set(this.name, this.input.getVal());
            }, this)
            .on('blur', function() {
                this.input.setVal(this.model.get(this.name, 'format'));
            }, this);
    },

    set: function(value) {
        this.__base();
        this.input.setVal(value);
    },

    onFieldChange: function(e, data) {
        this.input.hasMod('focused') || this.input.setVal(data.value);
    }
}));

});

