modules.define('glue-field', ['i-bem__dom'], function(provide, BEMDOM) {

provide(BEMDOM.decl({ block: 'glue-field', modName : 'type', modVal : 'textarea' }, {

    onSetMod: {
        js: {
            inited: function() {
                this.__base();
                this.input = this.findBlockOn('textarea');
            }
        }
    },
}));

});

