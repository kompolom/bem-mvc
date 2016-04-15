modules.define('spec',
               ['glue', 'model', 'sinon', 'jquery', 'chai', 'i-bem__dom', 'BEMHTML'],
               function(provide, Glue, MODEL, sinon, $, chai, BEMDOM, BEMHTML) {

    var expect = chai.expect;

    MODEL.decl('glue-model', {
        num: 'number',
        str: 'string'
    });

    BEMDOM.decl('b-glued', {
        onSetMod: {
            js: function() {


            }
        }
    });

    describe('glue', function() {

        it('should create model', function() {
            BEMDOM.append('body', BEMHTML.apply({
                block: 'b-glued',
                mix: [{
                    block: 'glue',
                    js: {
                        modelName: 'glue-model',
                        modelData: {
                            num: 1,
                            str: 'a'
                        }
                    }
                }],
                js: true,
                content: 'bla'
            }));

            $('.b-glued').bem('b-glued').findBlockOn('glue').model.should.eql(MODEL.getOne('glue-model'));

            $('.b-glued').remove();
            MODEL.getOne('glue-model').destruct();
        });

        it('should create model 2', function() {

            BEMDOM.append('body', BEMHTML.apply({
                block: 'b-glued',
                mix: [{
                    block: 'glue',
                    js: {
                        modelParams: {
                            name: 'glue-model',
                            data: {
                                num: 1,
                                str: 'a'
                            }
                        }
                    }
                }],
                js: true,
                content: 'bla'
            }));

            $('.b-glued').bem('b-glued').findBlockOn('glue').model.should.eql(MODEL.getOne('glue-model'));

            $('.b-glued').remove();
            MODEL.getOne('glue-model').destruct();
        });

        it('should get model', function() {
            var model = MODEL.create({ name: 'glue-model', id: 666 }, {
                num: 1,
                str: 'a'
            });

            BEMDOM.append('body', BEMHTML.apply({
                block: 'b-glued',
                mix: [{
                    block: 'glue',
                    js: {
                        modelName: 'glue-model',
                        modelId: 666
                    }
                }],
                js: true,
                content: 'bla'
            }));

            $('.b-glued').bem('b-glued').findBlockOn('glue').model.should.eql(model);

            $('.b-glued').remove();
            model.destruct();
        });
        it('glue baseBlock', function() {
            BEMDOM.decl({ block: 'b-base-glued', baseBlock: 'glue' }, {
                onSetMod: {
                    js: function() {
                        this.__base();
                    }
                }
            });

            BEMDOM.append('body', BEMHTML.apply({
                block: 'b-base-glued',
                js: {
                    modelName: 'glue-model',
                    modelData: {
                        num: 1,
                        str: 'a'
                    }
                },
                content: 'bla'
            }));

            $('.b-base-glued').bem('b-base-glued').model.should.eql(MODEL.getOne('glue-model'));

            $('.b-base-glued').remove();
            MODEL.getOne('glue-model').destruct();
        });

        it('glue without model', function() {
            MODEL.decl('glue-without-model', {
                f1: 'number',
                f2: 'number'
            });

            BEMDOM.append('body', BEMHTML.apply({
                block: 'model-aggregator',
                content: [
                    {
                        block: 'b-glued-block',
                        mix: [{
                            block: 'glue',
                            js: {
                                modelName: 'glue-without-model'
                            }
                        }],
                        content: [

                        ]
                    },
                    {
                        block: 'i-model',
                        modelParams: {
                            name: 'glue-without-model',
                            data: {
                                f1: 1,
                                f2: 2
                            }
                        }
                    }
                ]
            }));

            $('.glue').bem('glue').model.toJSON().should.be.eql({
                f1: 1,
                f2: 2
            });

            $('.b-glued-block').remove();
            $('.i-model').remove();
        });

    });



    provide();
});
