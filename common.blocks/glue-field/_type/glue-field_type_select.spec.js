modules.define('spec',
['glue-field', 'glue', 'model', 'sinon', 'i-bem__dom', 'BEMHTML', 'jquery', 'menu', 'select', 'menu-item'],
function(provide, GField, Glue, MODEL, sinon, BEMDOM, BEMHTML, $, Menu, Select, MenuItem) {

    MODEL.decl('glue-field-select-model', {
        num: 'number',
        str: 'string'
    });


    describe('glue field type select', function() {

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
            model = MODEL.create('glue-field-select-model', {
                num: 1,
                str: 's'
            });

            BEMDOM.append('body', BEMHTML.apply({
                block: 'b-glued-field',
                mix: [{
                    block: 'glue',
                    js: {
                        modelName: 'glue-field-select-model',
                        modelId: model.id
                    }
                }],
                js: true,
                content: [
                    {
                        block: 'select',
                        mix: [{
                            block: 'glue',
                            elem: 'model-field',
                            js: {
                                name: 'str',
                                type: 'select'
                            }
                        }],
                        name: 'title',
                        val: 'a',
                        mods: { size: 'm', theme: 'islands', mode : 'radio' },
                        options: [
                            { text : 'a', val : 'a' },
                            { text : 'b', val : 'b' },
                            { text : 'c', val : 'c' },
                        ]
                    }
                ]
            }));

            var block = $('.b-glued-field').bem('b-glued-field'),
                select = block.findBlockInside('select');

            model.set('str', 'b');
            select.getVal().should.be.equal('b');

            select.setVal('c');
            model.get('str').should.be.equal('c');
        });


    });

    provide();
});
