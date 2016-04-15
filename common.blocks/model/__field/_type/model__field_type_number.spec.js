modules.define('spec', ['model', 'sinon', 'chai'], function(provide, MODEL, sinon, chai){

    describe('Field with type "number"', function() {
        MODEL.decl('number-type-field', {
            f: {
                type: 'number',
                validation: {
                    rules: {
                        required: true,
                        max: 10
                    }
                }
            },
            f1: {
                type: 'number',
                default: 1
            },
            f2: {
                type: 'number',
                value: 2
            },
            f3: {
                type: 'number',
                value: 3,
                format: function(value) {
                    return ('' + value).charAt(0);
                }
            },
            f4: {
                type: 'number',
                preprocess: function(value) {
                    return !value ? value : value + 4;
                }
            },
            f5: {
                type: 'number',
                calculate: function(value) {
                    return value === undefined ? value : value + 5;
                },
                dependsFrom: 'f'
            }
        });

        it('should have fields', function() {
            var model = MODEL.create('number-type-field');

            model.hasField('f').should.be.true();
            model.hasField('f1').should.be.true();
            model.hasField('f2').should.be.true();
            model.hasField('f3').should.be.true();
            model.hasField('f4').should.be.true();
            model.hasField('f5').should.be.true();
        });

        it('should have default value', function() {
            MODEL.create('number-type-field').get('f1').should.be.equal(1);
        });

        it('should have init value from decl', function() {
            MODEL.create('number-type-field').get('f2').should.be.equal(2);
        });

        it('should have init value from create', function() {

                MODEL
                    .create('number-type-field', { f: 3.14 })
                    .get('f')
                .should.be.equal(3.14);
        });

        it('should have format value', function() {

                MODEL
                    .create('number-type-field', { f3: 666 })
                    .get('f3', 'format')
                .should.be.equal('6');
        });

        it('should set value', function() {

                MODEL
                    .create('number-type-field')
                    .set('f', 3.14)
                    .get('f')
                .should.be.equal(3.14);
        });

        it('should clear value', function() {

            chai.expect(MODEL
                    .create('number-type-field')
                    .set('f', 1)
                    .clear('f')
                    .get('f'))
            .to.be.undefined;
        });

        it('should be empty', function() {
            var model = MODEL
                .create('number-type-field')
                .update({
                    f: 1,
                    f3: 3
                })
                .clear('f');

            model.isEmpty('f').should.be.true();

            model.clear();
            model.isEmpty().should.be.true();
        });

        it('should show changes', function() {
            var model = MODEL
                .create('number-type-field', {
                    f: 1,
                    f4: 3
                })
                .fix()
                .update({
                    f: 11,
                    f4: 33
                });

            model.isChanged('f').should.be.true();
            model.isChanged().should.be.true();
        });

        it('should update models', function() {
            var model = MODEL
                .create('number-type-field')
                .update({
                    f: 0,
                    f1: 1,
                    f2: 2,
                    f3: 3,
                    f4: 4
                });

            model.get('f').should.be.equal(0);

            model.toJSON().should.be.eql({
                f: 0,
                f1: 1,
                f2: 2,
                f3: 3,
                f4: 8,
                f5: 5
            });
        });

        it('should fix and rollback values', function() {

                MODEL
                    .create('number-type-field')
                    .set('f', 0)
                    .fix()
                    .set('f', 1)
                    .rollback()
                    .get('f')
                .should.be.equal(0);
        });

        it('should return data', function() {

                MODEL
                    .create('number-type-field', {
                        f: 0,
                        f1: 1,
                        f2: 2,
                        f3: 3,
                        f4: 4
                    })
                    .toJSON()
                .should.be.eql({
                    f: 0,
                    f1: 1,
                    f2: 2,
                    f3: 3,
                    f4: 8,
                    f5: 5
                });
        });

        it('should check validation', function() {
            var model = MODEL.create('number-type-field');

            model
                .set('f', 1.28)
                .isValid()
                .should.be.true();

            model
                .set('f', 15)
                .isValid()
                .should.be.false();
        });

        it('should fire changes', function() {
            var onChange = sinon.spy(),
                onFieldChange = sinon.spy(),
                disabledHandler = sinon.spy();

            MODEL
                .create('number-type-field')
                .on('change', onChange)
                .on('change', disabledHandler)
                .on('f', 'change', onFieldChange)
                .un('change', disabledHandler)
                .set('f', 666);

            onChange.called.should.be.true();
            onFieldChange.called.should.be.true();
            disabledHandler.called.should.be.false();
        });

        it('should destruct', function() {
            MODEL
                .create({ name: 'number-type-field', id: 'uniqModelId' })
                .destruct();

            MODEL.get({ name: 'number-type-field', id: 'uniqModelId' }).length.should.be.equal(0);
        });

    });

    provide();
});
