modules.define('spec', ['model', 'sinon'], function(provide, MODEL, sinon){

    describe('Field with type "string"', function() {
        MODEL.decl('string-type-field', {
            f: {
                type: 'string',
                validation: {
                    rules: {
                        required: true,
                        maxlength: 10
                    }
                }
            },
            f1: {
                type: 'string',
                default: 'str1'
            },
            f2: {
                type: 'string',
                value: 'str2'
            },
            f3: {
                type: 'string',
                value: 'str3',
                format: function(value) {
                    return ('' + value).charAt(0);
                }
            },
            f4: {
                type: 'string',
                preprocess: function(value) {
                    return value && value + '4';
                }
            },
            f5: {
                type: 'string',
                calculate: function(value) {
                    return value && value + '5';
                },
                dependsFrom: 'f'
            }
        });

        it('should have fields', function() {
            var model = MODEL.create('string-type-field');

            model.hasField('f').should.be.true();
            model.hasField('f1').should.be.true();
            model.hasField('f2').should.be.true();
            model.hasField('f3').should.be.true();
            model.hasField('f4').should.be.true();
            model.hasField('f5').should.be.true();
        });

        it('should have default value', function() {
            MODEL.create('string-type-field').get('f1').should.be.equal('str1');
        });

        it('should have init value from decl', function() {
            MODEL.create('string-type-field').get('f2').should.be.equal('str2');
        });

        it('should have init value from create', function() {

                MODEL
                    .create('string-type-field', { f: 3.14 })
                    .get('f')
                .should.equals(3.14);
        });

        it('should have format value', function() {

                MODEL
                    .create('string-type-field', { f3: 'AAA'})
                    .get('f3', 'format')
                .should.equals('A');
        });

        it('should set value', function() {

                MODEL
                    .create('string-type-field')
                    .set('f', 3.14)
                    .get('f')
                .should.equal(3.14);
        });

        it('should clear value', function() {

                MODEL
                    .create('string-type-field')
                    .set('f', 1)
                    .clear('f')
                    .get('f')
                .should.equal('');
        });

        it('should be empty', function() {
            var model = MODEL
                .create('string-type-field')
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
                .create('string-type-field', {
                    f: 1,
                    f4: 3
                })
                .fix()
                .update({
                    f: '11',
                    f4: '33'
                });

            model.isChanged('f').should.be.true();
            model.isChanged().should.be.true();
        });

        it('should update models', function() {
            var model = MODEL
                .create('string-type-field')
                .update({
                    f: 'qwe',
                    f1: 'qwe1',
                    f2: 'qwe2',
                    f3: 'qwe3',
                    f4: 'qwe'
                });

            model.get('f').should.be.equal('qwe');

            model.toJSON().should.be.eql({
                f: 'qwe',
                f1: 'qwe1',
                f2: 'qwe2',
                f3: 'qwe3',
                f4: 'qwe4',
                f5: 'qwe5'
            });
        });

        it('should fix and rollback values', function() {

                MODEL
                    .create('string-type-field')
                    .set('f', 0)
                    .fix()
                    .set('f', 1)
                    .rollback()
                    .get('f')
                .should.be.equal(0);
        });

        it('should return data', function() {

                MODEL
                    .create('string-type-field', {
                        f: 'up',
                        f1: 'up1',
                        f2: 'up2',
                        f3: 'up3',
                        f4: 'up'
                    })
                    .toJSON()
                .should.be.eql({
                    f: 'up',
                    f1: 'up1',
                    f2: 'up2',
                    f3: 'up3',
                    f4: 'up4',
                    f5: 'up5'
                });
        });

        it('should check validation', function() {
            var model = MODEL.create('string-type-field');

            model
                .set('f', 'string')
                .isValid()
                .should.be.true();

            model
                .set('f', 'loooooooooong string')
                .isValid()
                .should.be.false();
        });

        it('should fire changes', function() {
            var onChange = sinon.spy(),
                onFieldChange = sinon.spy(),
                disabledHandler = sinon.spy();

            MODEL
                .create('string-type-field')
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
                .create({ name: 'string-type-field', id: 'uniqModelId' })
                .destruct();


            MODEL.get({ name: 'string-type-field', id: 'uniqModelId' }).length.should.be.equal(0);
        });

    });

    provide();
});
