modules.define('spec',
               ['glue-field', 'glue', 'model', 'sinon', 'i-bem__dom', 'BEMHTML', 'jquery'],
               function(provide, GField, Glue, MODEL, sinon, BEMDOM, BEMHTML, $) {

    MODEL.decl('glue-field-mod-model', {
        num: 'number',
        str: 'string',
        bool: 'boolean'
    });


    describe('glue field type mod', function() {

        BEMDOM.decl('b-glued-field', {
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
            model = MODEL.create('glue-field-mod-model', {
                num: 1,
                str: 'a'
            });

            BEMDOM.append('body', BEMHTML.apply({
                block: 'b-glued-field',
                mix: [{
                    block: 'glue',
                    js: {
                        modelName: 'glue-field-mod-model',
                        modelId: model.id
                    }
                }],
                js: true,
                content: [
                    {
                        elem: 'bla-str',
                        mix: [{
                            block: 'glue',
                            elem: 'model-field',
                            js: {
                                name: 'str',
                                type: 'mod',
                                modName: 'test',
                                block: 'b-glued-field',
                                elem: 'bla-str'
                            }
                        }],
                        content: 'str'
                    },
                    {
                        elem: 'bla-bool',
                        mix: [{
                            block: 'glue',
                            elem: 'model-field',
                            js: {
                                name: 'bool',
                                type: 'mod',
                                modName: 'test',
                                block: 'b-glued-field',
                                elem: 'bla-bool'
                            }
                        }],
                        content: 'bool'
                    }
                ]
            }));

            var block = $('.b-glued-field').bem('b-glued-field');

            model.set('str', 'bla-bla');
            block.getMod(block.elem('bla-str'), 'test').should.be.equal('bla-bla');

            model.set('bool', true);
            block.hasMod(block.elem('bla-bool'), 'test').should.be.true();
        });


    });

    provide();
});
