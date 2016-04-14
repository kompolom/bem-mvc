modules.define('spec', ['model', 'sinon', 'chai'], function(provide, MODEL, sinon) {

    describe('Field with type "model"', function() {
        MODEL.decl('model-type-field', {
            f: {
                type: 'model',
                modelName: 'inner-model',
                destruct: true,
                validation: {
                    rules: {
                        deep: true,
                        required: true
                    }
                }
            }
        });
        MODEL.decl('inner-model', {
            innerF: {
                type: 'string',
                validation: {
                    rules: {
                        required: true,
                        maxlength: 10
                    }
                }
            }
        });

        it('should change values', function() {
            var model = MODEL.create('model-type-field', {
                    f: {
                        innerF: 'str'
                    }
                }),

                onFieldChange = sinon.spy(),
                onModelChange = sinon.spy();

            model.on('f', 'change', onFieldChange);
            model.on('change', onModelChange);

            model.set('f', { innerF: 'new str' });

            model.get('f').get('innerF').should.be.equal('new str');
            onFieldChange.called.should.be.true();
            onModelChange.called.should.be.true();

            model.destruct();
            MODEL.get('model-type-field').length.should.be.equal(0);
            MODEL.get('inner-model').length.should.be.equal(0);
        });

        it('should set model as value', function() {
            var model = MODEL.create('model-type-field', {
                    f: {
                        innerF: 'str'
                    }
                }),
                modelToSet = MODEL.create({ name: 'inner-model', parentModel: model }, { innerF: 'inner2' }),

                onFieldChange = sinon.spy(),
                onInnerFieldChange = sinon.spy(),
                onModelChange = sinon.spy();

            model.on('f', 'change', onFieldChange);
            model.on('change', onModelChange);

            model.set('f', modelToSet);

            model.get('f').get('innerF').should.be.equal('inner2');
            onFieldChange.called.should.be.true();
            onModelChange.called.should.be.true();

            model.on('f', 'change', onInnerFieldChange);
            modelToSet.set('innerF', 'bla');
            onInnerFieldChange.called.should.be.true();

            model.destruct();
            MODEL.get('model-type-field').length.should.be.equal(0);
            MODEL.get('inner-model').length.should.be.equal(0);
        });

        it('should change inner value', function() {
            var model = MODEL.create('model-type-field', {
                    f: {
                        innerF: 'str'
                    }
                }),

                onFieldChange = sinon.spy(),
                onModelChange = sinon.spy();

            model.on('f', 'change', onFieldChange);
            model.on('change', onModelChange);

            model.get('f').set('innerF', 'new str');

            model.get('f').get('innerF').should.be.equal('new str');
            onFieldChange.called.should.be.true();
            onModelChange.called.should.be.true();

            model.destruct();
            MODEL.get('model-type-field').length.should.be.equal(0);
            MODEL.get('inner-model').length.should.be.equal(0);
        });

        it('should serialize data', function() {
            var model = MODEL.create('model-type-field', {
                f: {
                    innerF: 'str'
                }
            });

            model.toJSON().should.be.eql({
                f: {
                    innerF: 'str'
                }
            });

            model.destruct();
            MODEL.get('model-type-field').length.should.be.equal(0);
            MODEL.get('inner-model').length.should.be.equal(0);
        });

        it('should clear data', function() {
            var model = MODEL.create('model-type-field', {
                f: {
                    innerF: 'str'
                }
            });

            model.clear();

            model.isEmpty().should.be.equal(true);

            model.destruct();
            MODEL.get('model-type-field').length.should.be.equal(0);
            MODEL.get('inner-model').length.should.be.equal(0);
        });

        it('should fix and rollback data', function() {
            var model = MODEL.create('model-type-field', {
                f: {
                    innerF: 'str'
                }
            });

            model.get('f').set('innerF', 'correct str');
            model.fix();

            model.get('f').set('innerF', 'wrong str');
            model.get('f').get('innerF').should.be.equal('wrong str');

            model.rollback();
            model.get('f').get('innerF').should.be.equal('correct str');

            model.destruct();
            MODEL.get('model-type-field').length.should.be.equal(0);
            MODEL.get('inner-model').length.should.be.equal(0);
        });

        it('should not destruct inner model', function() {
            var model = MODEL.create('model-type-field', {
                f: {
                    innerF: 'str'
                }
            }),
            innerModel = model.get('f'),
            modelToSet = MODEL.create({ name: 'inner-model', parentModel: model }, { innerF: 'inner2' });

            model.set('f', modelToSet, { destruct: false });
            MODEL.getOne({ name: 'inner-model', id: innerModel.id }).should.exist();

            model.destruct();
            innerModel.destruct();
            MODEL.get('model-type-field').length.should.be.equal(0);
            MODEL.get('inner-model').length.should.be.equal(0);
        });

        it('should check validation', function() {
            var model = MODEL.create('model-type-field');

            model
                .set('f', { innerF: 'string' })
                .isValid()
                .should.be.true();

            model
                .set('f', { innerF: 'loooooooooong string' })
                .isValid()
                .should.be.false();

            model
                .clear('f')
                .isValid()
                .should.be.false();

            model.destruct();
            MODEL.get('model-type-field').length.should.be.equal(0);
            MODEL.get('inner-model').length.should.be.equal(0);
        });

    });

    provide();
});
