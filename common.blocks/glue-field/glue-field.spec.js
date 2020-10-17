modules.define('spec',
               ['glue-field', 'glue', 'model', 'i-bem-dom', 'BEMHTML', 'jquery', 'sinon'],
               function(provide, GField, Glue, MODEL, bemDom, BEMHTML, $, sinon) {

    MODEL.decl('glue-field-model', {
        num: 'number',
        str: 'string'
    });


    describe('glue field', function() {

        bemDom.decl('b-glued-field', {
            onSetMod: {
                js: function() {

                }
            }
        });

        it('should glue field', function() {

            bemDom.append('body', BEMHTML.apply({
                block: 'b-glued-field',
                mix: [{
                    block: 'glue',
                    js: {
                        modelName: 'glue-field-model',
                        modelData: {
                            num: 123,
                            str: 'abc'
                        }
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
                                name: 'num'
                            }
                        }],
                        content: 'num'
                    }
                ]
            }));

            $('.b-glued-field').bem('b-glued-field').findBlockInside('glue').getFieldBlock('num').get().should.be.equal(123);

            $('.b-glued-field').remove();
            MODEL.getOne('glue-field-model').destruct();
        });

        it('should glue field with mod', function() {

            bemDom.append('body', BEMHTML.apply({
                block: 'b-glued-field',
                mix: [{
                    block: 'glue',
                    js: {
                        modelName: 'glue-field-model',
                        modelData: {
                            num: 123,
                            str: 'abc'
                        }
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
                                name: 'num'
                            }
                        }],
                        content: 'num'
                    }
                ]
            }));

            $('.b-glued-field').bem('b-glued-field').findBlockInside('glue').getFieldBlock('num').get().should.be.equal(123);

            $('.b-glued-field').remove();
            MODEL.getOne('glue-field-model').destruct();
        });

        it('should unbuind from model when destructed', function() {
            var model = MODEL.create('glue-field-model', {
                num: 123,
                str: 'abc'
            });

            bemDom.append('body', BEMHTML.apply({
                block: 'b-glued-field',
                mix: [{
                    block: 'glue',
                    js: {
                        modelName: 'glue-field-model',
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
                                name: 'num'
                            }
                        }],
                        content: 'num'
                    }
                ]
            }));

            var block = $('.b-glued-field').bem('b-glued-field');
            bemDom.destruct(block.domElem); // Не совсем понял что было в оригинале.

            var fn = function() { model.set('num', 1); };
            fn.should.not.throw();
        });

        it('glue field baseBlock', function() {

            bemDom.decl({ block: 'b-base-glued-field', baseBlock: Glue }, {
                onSetMod: {
                    js: function() {
                        this.__base();
                    }
                }
            });

            bemDom.append('body', BEMHTML.apply({
                block: 'b-base-glued-field',
                js: {
                    modelName: 'glue-field-model',
                    modelData: {
                        num: 123,
                        str: 'abc'
                    }
                },
                content: [
                    {
                        elem: 'bla',
                        mix: [{
                            block: 'b-base-glued-field',
                            elem: 'model-field',
                            js: {
                                name: 'str'
                            }
                        }],
                        content: 'str'
                    }
                ]
            }));

            $('.b-base-glued-field').bem('b-base-glued-field').getFieldBlock('str').get().should.be.equal('abc');

            $('.b-base-glued-field').remove();
            MODEL.getOne('glue-field-model').destruct();
        });

    });


    provide();
});
