([{
    shouldDeps: ['model', 'glue-field']
},
{
    tech : 'spec.js',
    mustDeps : [
        { block : 'i-bem', elem : 'dom' },
        { block : 'model', tech : 'bemhtml' },
        { block : 'model-aggregator' },
        { block : 'model-aggregator', tech : 'bemhtml' },
    ]
}])
