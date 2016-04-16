([{
    shouldDeps: [
        {
            block: 'select'
        },
    ]
},
{
    tech : 'spec.js',
    mustDeps : [
        {
            block : 'select',
            mods : { mode : 'radio' },
            tech : 'bemhtml'
        },
        {
            block : 'select',
            mods : { mode : 'radio' },
            tech : 'js'
        },
        {
            block : 'menu',
            mods : { mode : 'radio' },
            tech : 'js'
        },
        {
            block : 'menu',
            mods : { mode : 'radio' },
            tech : 'bemhtml'
        }
    ]
} ])
