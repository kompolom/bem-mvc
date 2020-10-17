modules.define('glue-field', [], function(provide, GlueField) {

provide(GlueField.declMod({ modName : 'type', modVal : 'inline'}, {

    onFieldChange: function() {
        this.domElem.html(this.model.get(this.name, 'format'));
    }

}));

});
