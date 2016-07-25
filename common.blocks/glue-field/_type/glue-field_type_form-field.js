modules.define('glue-field', ['i-bem__dom'], function(provide, BEMDOM) {
    provide(BEMDOM.decl({ block: 'glue-field', modName : 'type', modVal : 'form-field'}, {
        onSetMod: {
            js: {
                inited: function() {
                    this.__base();
                    this.ff = this.findBlockOn('form-field');
                }
            }
        },

        init: function() {
            this.__base.apply(this, arguments);

            this.ff
                .on('change', function() {
                    this.model.set(this.name, this.ff.getVal());
                }, this)
                .on('blur', function() {
                    this.ff.setVal(this.model.get(this.name, 'format'));
                }, this);

            this.model.on(this.name, 'error', this.onFieldError, this);
            this.model.on('fix', this.onModelFixed, this);
        },

        set: function(value) {
            this.__base();
            this.ff.setVal(value);
        },
        
        onModelFixed : function(){
            if(!this.ff.getDirty())
                return;
            // Код ниже должен быть в bem-forms
            this.ff._initVal = this.model.get(this.name);
            this.ff._dirty = false;
            this.ff.delMod('dirty');
        },

        onFieldChange: function(e, data) {
            this.ff.hasMod('focused') || this.ff.setVal(data.value);
        },

        onFieldError : function(e, err) {
            this.ff.setValidationMessage(err.rule, err.text);
            this.ff.setStatus({ message : err.text });
        }

    }));

});
