modules.define('spec', ['model', 'sinon', 'chai'], function(provide, MODEL, sinon, chai) {

    describe('Field with type "boolean"', function() {
        MODEL.decl('boolean-type-field', {
            f: {
                type: 'boolean',
                validation: {
                    rules: {
                        required: true
                    }
                }
            },
            f1: {
                type: 'boolean',
                default: true
            },
            f2: {
                type: 'boolean',
                value: false
            },
            f3: {
                type: 'boolean',
                value: true,
                format: function(value) {
                    return 0 + value
                }
            },
            f4: {
                type: 'boolean',
                preprocess: function(value) {
                    return value && !value
                }
            },
            f5: {
                type: 'boolean',
                calculate: function(value) {
                    return value && !value
                },
                dependsFrom: 'f'
            }
        });

        it('should have fields', function() {
            var model = MODEL.create('boolean-type-field');

            model.hasField('f').should.be.true();
            model.hasField('f1').should.be.true();
            model.hasField('f2').should.be.true();
            model.hasField('f3').should.be.true();
            model.hasField('f4').should.be.true();
            model.hasField('f5').should.be.true();
        });

        it('should have default value', function() {
            MODEL.create('boolean-type-field').get('f1').should.be.true();
        });

        it('should have init value from decl', function() {
            MODEL.create('boolean-type-field').get('f2').should.be.false();;
        });

        it('should have init value from create', function() {
            MODEL
                .create('boolean-type-field', { f: false })
                .get('f')
            .should.be.false();;
        });

        it('should have format value', function() {
            MODEL
                .create('boolean-type-field', { f3: false })
                .get('f3', 'format')
            .should.be.equal(0);
        });

        it('should set value', function() {
            MODEL
                .create('boolean-type-field')
                .set('f', false)
                .set('f', true)
                .get('f')
            .should.be.true();
        });

        it('should clear value', function() {
            chai.expect(MODEL
                .create('boolean-type-field')
                .set('f', false)
                .clear('f')
                .get('f'))
            .to.be.undefined();
        });

        it('should be empty', function() {
            var model = MODEL
                .create('boolean-type-field')
                .update({
                    f: true,
                    f3: false
                })
                .clear('f');

            model.isEmpty('f').should.be.true();

            model.clear();
            model.isEmpty().should.be.true();
        });

        it('should show changes', function() {
            var model = MODEL
                .create('boolean-type-field', {
                    f: true,
                    f4: false
                })
                .fix()
                .update({
                    f: false,
                    f4: true
                });

            model.isChanged('f').should.be.true();
            model.isChanged().should.be.true();
        });

        it('should update models', function() {
            var model = MODEL
                .create('boolean-type-field')
            model.update({
                f: true,
                f1: false,
                f2: false,
                f3: false,
                f4: true
            });

            model.get('f').should.be.true();

            model.toJSON().should.be.eqls({
                f: true,
                f1: false,
                f2: false,
                f3: false,
                f4: false,
                f5: false
            });
        });

        it('should fix and rollback values', function() {

                MODEL
                    .create('boolean-type-field')
                    .set('f', 0)
                    .fix()
                    .set('f', true)
                    .rollback()
                    .get('f')
                .should.be.false();;
        });

        it('should return data', function() {

                MODEL
                    .create('boolean-type-field', {
                        f: true,
                        f1: false,
                        f2: false,
                        f3: false,
                        f4: true
                    })
                    .toJSON()
                .should.eqls({
                    f: true,
                    f1: false,
                    f2: false,
                    f3: false,
                    f4: false,
                    f5: false
                });
        });

        it('should check validation', function() {
            var model = MODEL.create('boolean-type-field');

            model
                .set('f', true)
                .isValid()
                .should.be.true();

            model
                .clear('f')
                .isValid()
                .should.be.false();
        });

        it('should fire changes', function() {
            var onChange = sinon.spy(),
                onFieldChange = sinon.spy(),
                disabledHandler = sinon.spy();

            MODEL
                .create('boolean-type-field')
                .on('change', onChange)
                .on('change', disabledHandler)
                .on('f', 'change', onFieldChange)
                .un('change', disabledHandler)
                .set('f', 666);

            onChange.called.should.be.true();
            onFieldChange.called.should.be.true();
            disabledHandler.called.should.not.be.true();
        });

        it('should destruct', function() {
            MODEL
                .create({ name: 'boolean-type-field', id: 'uniqModelId' })
                .destruct();

            MODEL.get({ name: 'boolean-type-field', id: 'uniqModelId' }).length.should.be.equal(0);
        });

    });
    provide();
});
