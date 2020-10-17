modules.define('spec',
               ['glue-field', 'glue', 'model', 'sinon', 'i-bem-dom', 'BEMHTML', 'jquery'],
               function(provide, GField, Glue, MODEL, sinon, bemDom, BEMHTML, $) {

    MODEL.decl('glue-field-checkbox-model', {
        num: 'number',
        str: 'string',
        bool: 'boolean'
    });


    describe('glue field type checkbox', function() {

        bemDom.decl('b-glued-field', {
            onSetMod: {
                js: function() {
                }
            }
        });

        var model;
        afterEach(function() {
            $('.b-glued-field').remove();
            model.destruct();
        });

        it('should glue field', function() {
            model = MODEL.create('glue-field-checkbox-model', {
                num: 1,
                str: 's',
                bool: false
            });

            bemDom.append('body', BEMHTML.apply({
                block: 'b-glued-field',
                mix: [{
                    block: 'glue',
                    js: {
                        modelName: 'glue-field-checkbox-model',
                        modelId: model.id
                    }
                }],
                js: true,
                content: [
                    {
                        block: 'checkbox',
                        mix: [{
                            block: 'glue',
                            elem: 'model-field',
                            js: {
                                name: 'bool',
                                type: 'checkbox'
                            }
                        }],
                        name: 'title',
                        mods: { size: 's' },
                        content: { elem: 'label', content: 'checkbox' }
                    }
                ]
            }));

            var block = $('.b-glued-field').bem('b-glued-field'),
                checkbox = block.findBlockInside('checkbox');

            checkbox.hasMod('checked').should.be.equal(false);

            model.set('bool', true);
            checkbox.hasMod('checked').should.be.equal(true);

            setTimeout(function() {
                checkbox.delMod('checked');
                model.get('bool').should.be.equal(false);
            }, 100);
        });


    });

    provide();
});
