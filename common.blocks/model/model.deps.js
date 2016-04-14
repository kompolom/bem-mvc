([{
    mustDeps : [
        'model-aggregator',
    ],
    shouldDeps: [
        'objects',
        {
            block: 'functions',
            elems: ['throttle', 'debounce']
        },
        {
            elem: 'field',
            mods: {
                type: [
                    'id',
                    'string',
                    'number',
                    'boolean',
                    'model',
                    'array',
                    'models-list'
                ]
            }
        }
    ]
},
{
    tech : 'spec.js',
    shouldDeps : [
        {
            elem : 'field',
            mods : {
                type : ['array', 'boolean', 'string', 'model']
            }
        }
    ]
}])
