modules.define('spec',
               ['glue-field', 'glue', 'model', 'sinon', 'i-bem__dom', 'BEMHTML', 'jquery', 'input'],
               function(provide, GField, Glue, MODEL, sinon, BEMDOM, BEMHTML, $, Input) {

    MODEL.decl('glue-field-input-model', {
        num: 'number',
        str: 'string'
    });

    describe('glue field type input', function() {

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
        model = MODEL.create('glue-field-input-model', {
            num: 1,
            str: 's'
        });

        BEMDOM.append('body', BEMHTML.apply({
            block: 'b-glued-field',
            mix: [{
                block: 'glue',
                js: {
                    modelName: 'glue-field-input-model',
                    modelId: model.id
                }
            }],
            js: true,
            content: [
                {
                    block: 'input',
                    mix: [{
                        block: 'glue',
                        elem: 'model-field',
                        js: {
                            name: 'num',
                            type: 'input'
                        }
                    }],
                    name: 'count',
                    val: '',
                    mods: { size: 's' },
                },
                {
                    block: 'input',
                    mix: [{
                        block: 'glue',
                        elem: 'model-field',
                        js: {
                            name: 'str',
                            type: 'input'
                        }
                    }],
                    name: 'title',
                    val: '',
                    mods: { size: 's' },
                }
            ]
        }));

        var block = $('.b-glued-field').bem('b-glued-field'),
            inputs = block.findBlocksInside('input'),
            inputNumber = inputs[0],
            inputString = inputs[1];

        it('should glue field', function() {

            model.set('num', 42);
            inputNumber.getVal().should.satisfy(function(val){ return val == 42;});

            inputNumber.setVal('13');
            model.get('num').should.be.equal(13);
        });

    });

    provide();
});
