modules.define('spec',
    ['model', 'sinon', 'jquery', 'chai'],
    function(provide, MODEL, sinon, $, chai){

    var expect = chai.expect;

        // COMMON FIELD
    describe('Field with no type', function() {
        var simpleField,
            zeroField,
            mockModel;

        beforeEach(function() {
            MODEL.decl('stubModel', {});
            var m = new MODEL.create('stubModel');

            simpleField = new MODEL.FIELD({ 'default': 1 }, m);
            zeroField = new MODEL.FIELD({ 'default': 0 }, m);
        });

        MODEL.decl('no-type-field', {
            f: {
                validation: {
                    rules: {
                        required: true
                    }
                }
            },
            f1: {
                default: { val: 'str1' }
            },
            f2: {
                value: { val: 'str2' }
            },
            f3: {
                value: { val: 'str3' },
                format: function(value) {
                    return value && { val: ('' + value.val).charAt(0) };
                }
            },
            f4: {
                preprocess: function(value) {
                    return value && { val: value.val + '4' };
                }
            },
            f5: {
                calculate: function(value) {
                    return value && { val: value.val + '5' }
                },
                dependsFrom: 'f'
            },
            f6: {
                'default': { val: 1 }
            }
        });

        it('should have fields', function() {
            var model = MODEL.create('no-type-field');

            model.hasField('f').should.be.true();
            model.hasField('f1').should.be.true();
            model.hasField('f2').should.be.true();
            model.hasField('f3').should.be.true();
            model.hasField('f4').should.be.true();
            model.hasField('f5').should.be.true();
        });

        it('should have default value', function() {
            MODEL.create('no-type-field').get('f1').should.deep.equals({ val: 'str1' });
        });

        it('should have init value from decl', function() {
            MODEL.create('no-type-field').get('f2').should.deep.equals({ val: 'str2' });
        });

        it('should have init value from create', function() {
            MODEL
                .create('no-type-field', { f: { val: 3.14 } })
                .get('f')
            .should.deep.equals({ val: 3.14 });
        });

        it('should have format value', function() {
            MODEL
                .create('no-type-field', { f3: { val: 'AAA' } })
                .get('f3', 'format')
            .should.deep.equals({ val: 'A' });
        });

        it('should set value', function() {
            MODEL
                .create('no-type-field')
                .set('f', { val: 3.14 })
                .get('f')
            .should.deep.equals({ val: 3.14 });
        });

        it('should clear value', function() {
            chai.expect(MODEL
                .create('no-type-field')
                .set('f', { val: 1 })
                .clear('f')
                .get('f'))
            .to.be.undefined();
        });

        it('should be empty', function() {
            var model = MODEL
                .create('no-type-field')
                .update({
                    f: { val: 1 },
                    f3: { val: 3 }
                })
                .clear('f');

            model.isEmpty('f').should.be.true();

            model.clear();
            model.isEmpty().should.be.true();
        });

        it('should show changes', function() {
            var model = MODEL
                .create('no-type-field', {
                    f: { val: 1 },
                    f1: { val: 0 },
                    f4: { val: 3 },
                    f6: { val: 0 },
                    f2: { val: NaN }
                })
                .fix()
                .update({
                    f: { val: 11 },
                    f1: { val: 1 },
                    f4: { val: 33 },
                    f6: { val: 1 },
                    f2: { val: NaN }
                });

            model.isChanged('f').should.be.true();
            model.isChanged().should.be.true();
            model.isChanged('f6').should.be.true();
        });

        it('should update models', function() {
            var model = MODEL
                .create('no-type-field')
                .update({
                    f: { val: 'qwe' },
                    f1: { val: 'qwe1' },
                    f2: { val: 'qwe2' },
                    f3: { val: 'qwe3' },
                    f4: { val: 'qwe' }
                });

            expect(model.get('f')).deep.equals({ val: 'qwe' });

            expect(model.toJSON()).deep.equals({
                f: { val: 'qwe' },
                f1: { val: 'qwe1' },
                f2: { val: 'qwe2' },
                f3: { val: 'qwe3' },
                f4: { val: 'qwe4' },
                f5: { val: 'qwe5' },
                f6: { val: 1 }
            });
        });

        it('should fix and rollback values', function() {
            expect(
                MODEL
                    .create('no-type-field')
                    .set('f', { val: 0 })
                    .fix()
                    .set('f', { val: 1 })
                    .rollback()
                    .get('f'))
                .deep.equal({ val: 0 });
        });

        it('should return data', function() {
            expect(
                MODEL
                    .create('no-type-field', {
                        f: { val: 'up' },
                        f1: { val: 'up1' },
                        f2: { val: 'up2' },
                        f3: { val: 'up3' },
                        f4: { val: 'up' }
                    })
                    .toJSON())
                .deep.equal({
                    f: { val: 'up' },
                    f1: { val: 'up1' },
                    f2: { val: 'up2' },
                    f3: { val: 'up3' },
                    f4: { val: 'up4' },
                    f5: { val: 'up5' },
                    f6: { val: 1 }
                });
        });

        it('should check validation', function() {
            var model = MODEL.create('no-type-field');

            expect(model
                .set('f', 1.28)
                .isValid())
                .to.be.true();

            expect(model
                .clear()
                .isValid())
                .to.be.false();
        });

        it('should fire changes', function() {
            var onChange = sinon.spy(),
                onFieldChange = sinon.spy(),
                disabledHandler = sinon.spy();

            MODEL
                .create('no-type-field')
                .on('change', onChange)
                .on('change', disabledHandler)
                .on('f', 'change', onFieldChange)
                .un('change', disabledHandler)
                .set('f', { val: 666 });

            onChange.called.should.be.true();
            onFieldChange.called.should.be.true();
            disabledHandler.called.should.be.false();
        });

        it('should destruct', function() {
            MODEL
                .create({ name: 'no-type-field', id: 'uniqModelId' })
                .destruct();

            MODEL.get({ name: 'no-type-field', id: 'uniqModelId' }).length.should.be.equal(0);
        });

        describe('.isNaN(value)', function() {

            it('should return true if first param is exactly NaN', function() {
                simpleField.isNaN(NaN).should.be.true();
            });

            it('should return false if first param is not exactly NaN', function() {
                simpleField.isNaN(1).should.be.false();
                simpleField.isNaN('hello').should.be.false();
                simpleField.isNaN({}).should.be.false();
                simpleField.isNaN([1, 2, 3]).should.be.false();
            });
        });

        describe('.isEqual(value)', function() {
            it('should return true if field value equal first param', function() {
                simpleField.set(1).fixData();
                simpleField.isEqual(1).should.be.true();
            });

            it('should return true if field value is NaN and param is NaN', function() {
                simpleField.set(NaN).fixData();
                simpleField.isEqual(NaN).should.be.true();
            });
        });

        describe('.isChanged()', function() {
            it('should return true if field changed', function() {
                simpleField.set(1).fixData().set(2);
                simpleField.isChanged().should.be.true();

                simpleField.set(0).fixData().set(1);
                simpleField.isChanged().should.be.true();
            });

            it('should return false if field not changed', function() {
                simpleField
                    .set(1)
                    .fixData()
                    .set(1);
                simpleField.isChanged().should.be.false();
            });

            it('should return false if set value same as default', function() {
                simpleField.set(1);
                simpleField.isChanged().should.be.false();
            });

            it('should return true if set null value and default zero', function() {
                zeroField.set(null);
                zeroField.isChanged().should.be.true();
            });
        });
    });

    provide();
});
/*BEM.TEST.decl('i-model__field', function() {

});
*/
