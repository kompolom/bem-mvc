modules.define('glue-field', ['checkbox'], function(provide, Checkbox, GlueField) {

provide(GlueField.declMod({ modName : 'type', modVal : 'checkbox'}, {

    onSetMod: {
        js: {
            inited: function() {
                this.__base();

                this.checkbox = this.findMixedBlock(Checkbox);
            }
        }
    },

    init: function() {
        this.__base.apply(this, arguments);

        this._events(this.checkbox)
            .on({ modName: 'checked', modVal: '*' }, function(e, data) {
                this.model.set(this.name, !!data.modVal);
            }, this);
    },

    set: function(value) {
        this.__base();
        this.checkbox.setMod('checked', value);
    },

    onFieldChange: function(e, data) {
        this.checkbox.hasMod('focused') || this.checkbox.setMod('checked', data.value);
    }

}));

});
