modules.define('spec', ['model', 'sinon'], function(provide, MODEL, sinon){

    describe('Field with type "model-list"', function() {
        var model;

        MODEL.decl('model-list-type-field', {
            list: {
                type: 'models-list',
                modelName: 'list-inner-model'
            }
        });
        MODEL.decl('list-inner-model', {
            id: 'id',
            f: 'string',
            n: 'number'
        });

        afterEach(function(){
            model.destruct();
        });

        it('should create model and set data', function() {
            model = MODEL.create('model-list-type-field');

            model.toJSON().should.eql({ list: [] });

            model.get('list').add({ id: 1, f: 'f', n: 3 });
            model.toJSON().should.be.eql({ list: [{ id: 1, f: 'f', n: 3 }] });

            model.set('list', [{ id: 111, f: 'fff', n: 333 }]);
            model.toJSON().should.be.eql({ list: [{ id: 111, f: 'fff', n: 333 }] });

            model.destruct();
            MODEL.get('list-inner-model').length.should.be.equal(0);
        });

        it('should create models at index', function () {
            model = MODEL.create('model-list-type-field', {
                list: [{ id: 1, f: 'f', n: 3 }]
            });

            model.get('list').addByIndex(0, { id: 11, f: 'ff', n: 33 });

            model.toJSON().should.be.eql({
                list: [
                    { id: 11, f: 'ff', n: 33 },
                    { id: 1, f: 'f', n: 3 }
                ]
            });

            model.destruct();
        });

        it('should create inner models', function() {
            model = MODEL.create('model-list-type-field', {
                list: [{ id: 1, f: 'f1' }, { id: 2, f: 'f2' }]
            }),

                onFieldChange = sinon.spy(),
                onModelChange = sinon.spy();

            model.on('list', 'change', onFieldChange);
            model.on('change', onModelChange);

            model.set('list', [{ id: 10, f: 'f10' }, { id: 20, f: 'f20' }]);

            MODEL.get('list-inner-model').length.should.be.equal(2);
            onFieldChange.called.should.be.true();
            setTimeout(function() { // событие на модели триггериться позже
                onModelChange.called.should.be.true();
            }, 1000);

            model.destruct();
            MODEL.get('list-inner-model').length.should.be.equal(0);
        });

        it('should fix and rollback data', function() {
            model = MODEL.create('model-list-type-field', {
                list: [{ id: 1, f: 'f1' }, { id: 2, f: 'f2' }]
            });

            model.fix();

            model.clear('list');
            model.rollback();
            JSON.stringify(model.toJSON()).should.eql(JSON.stringify({ list: [{ id:1, f: 'f1' }, { id: 2, f: 'f2' }] }));

            model.get('list').getByIndex(0).set('f', 123);
            model.rollback();
            JSON.stringify(model.toJSON()).should.eql(JSON.stringify({ list: [{ id:1, f: 'f1' }, { id: 2, f: 'f2' }] }));
            //model.toJSON().should.eql({ list: [{ id:1, f: 'f1' },{ id: 2, f: 'f2' }] });

            model.destruct();
            MODEL.get('list-inner-model').length.should.be.equal(0);
        });

        it('should add models', function() {
            model = MODEL.create('model-list-type-field', {
                list: [{ id: 1, f: 'f1' }, { id: 2, f: 'f2' }]
            }),

                onAddModel = sinon.spy();

            model.on('list', 'change', onAddModel);

            model.get('list').add({ id: 3, f: 'f3' });
            MODEL.get('list-inner-model').length.should.be.equal(3);
            model.get('list').length().should.be.equal(3); // ?

            model.destruct();
            MODEL.get('list-inner-model').length.should.be.equal(0);
        });

        it('should remove by id models', function() {
            model = MODEL.create('model-list-type-field', {
                list: [{ id: 1, f: 'f1' }, { id: 2, f: 'f2' }, { id: 3, f: 'f3' }]
            });

            model.get('list').remove(2);
            MODEL.get('list-inner-model').length.should.be.equal(2);
            model.get('list').length().should.be.equal(2);

            model.get('list').remove(1);
            MODEL.get('list-inner-model').length.should.be.equal(1);
            model.get('list').length().should.be.equal(1);

            model.get('list').remove(3);
            MODEL.get('list-inner-model').length.should.be.equal(0);
            model.get('list').length().should.be.equal(0);

            model.destruct();
            MODEL.get('list-inner-model').length.should.be.equal(0);
        });

        it('should clear list', function() {
            model = MODEL.create('model-list-type-field', {
                list: [{ id: 1, f: 'f1' }, { id: 2, f: 'f2' }]
            });

            model.get('list').clear();
            MODEL.get('list-inner-model').length.should.be.equal(0);

            model.get('list').add({ f: 'f1' });
            model.clear('list');
            MODEL.get('list-inner-model').length.should.be.equal(0);

            model.destruct();
            MODEL.get('list-inner-model').length.should.be.equal(0);
        });

        it('should find by id', function() {
            model = MODEL.create('model-list-type-field', {
                list: [{ id: 1, f: 'f1' }, { id: 2, f: 'f2' }]
            });

            model.get('list').getById(1).should.be.eql(MODEL.get({ name: 'list-inner-model', id: 1 })[0]);

            model.destruct();
            MODEL.get('list-inner-model').length.should.be.equal(0);
        });

        it('should iterate elements', function() {
            model = MODEL.create('model-list-type-field', {
                list: [{ id: 1, f: 'f1' }, { id: 2, f: 'f2' }]
            }),

                onForEach = sinon.spy(),
                onMap = sinon.spy();

            model.get('list').forEach(onForEach);
            model.get('list').map(onMap);

            onForEach.called.should.be.true();
            onMap.called.should.be.true();

            model.destruct();
            MODEL.get('list-inner-model').length.should.be.equal(0);
        });

        it('should search for elements by attributes', function() {
            model = MODEL.create('model-list-type-field', {
                list: [
                    { id: 1, f: 'f1', n: 42 },
                    { id: 2, f: 'f2', n: 16 },
                    { id: 3, f: 'f4', n: 42 },
                    { id: 4, f: 'f2', n: 42 },
                    { id: 5, f: 'f4'        },
                    { id: 6, f: 'f4', n: 42 }
                ]
            });

            model.get('list').where({ n: 42 }).length.should.be.equal(4);
            model.get('list').where({ f: 'f4' }).length.should.be.equal(3);
            model.get('list').where({ f: 'f2', n: 16 }).length.should.be.equal(1);
            model.get('list').where({ f: 'f4', n: 42 }).length.should.be.equal(2);
            model.get('list').where({ f: 'f1' }).length.should.be.equal(1);
            model.get('list').where({ f: '42' }).length.should.be.equal(0);
            model.get('list').where({}).length.should.be.equal(0);
            model.get('list').where().length.should.be.equal(0);

            model.destruct();
            MODEL.get('list-inner-model').length.should.be.equal(0);
        });

    });

    provide();
});
