modules.define('spec',
               ['glue-field', 'glue', 'model', 'sinon', 'i-bem__dom', 'BEMHTML', 'jquery'],
               function(provide, GField, Glue, MODEL, sinon, BEMDOM, BEMHTML, $) {

    MODEL.decl('glue-field-inline-model', {
        num: 'number',
        str: 'string'
    });

    describe('glue field type inline', function() {

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
            model = MODEL.create('glue-field-inline-model', {
                num: 1,
                str: 'a'
            });

            BEMDOM.append('body', BEMHTML.apply({
                block: 'b-glued-field',
                mix: [{
                    block: 'glue',
                    js: {
                        modelName: 'glue-field-inline-model',
                        modelId: model.id
                    }
                }],
                js: true,
                content: [
                    {
                        elem: 'bla',
                        mix: [{
                            block: 'glue',
                            elem: 'model-field',
                            js: {
                                name: 'num',
                                type: 'inline'
                            }
                        }],
                        content: 'num'
                    }
                ]
            }));

            model.set('num', 42);
            $('.b-glued-field').bem('b-glued-field').elem('bla').text().should.be.equal('42.00');
        });


    });

    provide();
});
