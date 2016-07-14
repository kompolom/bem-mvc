modules.define('glue-field', ['i-bem__dom'], function(provide, BEMDOM) {

provide(BEMDOM.decl({ block: 'glue-field', modName : 'type', modVal : 'inline'}, {

    onFieldChange: function(e, data) {
        this.domElem.html(this.model.get(this.name, 'format'));
    }

}));

});
