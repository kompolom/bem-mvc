var fs = require('fs'),
    techs = {
        files : {
            provide : require('enb/techs/file-provider'),
            copy : require('enb/techs/file-copy'),
            merge : require('enb/techs/file-merge')
        },
        bem : require('enb-bem-techs'),
        stylus : require('enb-stylus/techs/stylus'),
        js : require('enb-js/techs/browser-js'),
        ym : require('enb-modules/techs/prepend-modules'),
        engines : {
            bemhtml : require('enb-bemxjst/techs/bemhtml'),
        },
        html : require('enb-bemxjst/techs/bemjson-to-html'),
    },
    path = require('path');

module.exports = function(config) {

    config.nodes(['*.bundles/*'], function(nodeConfig) {
        var levels = getDesktopLevels();
        levels.push(absPath = path.join(nodeConfig._root, nodeConfig._path, 'blocks'));

        nodeConfig.addTechs([
            [techs.bem.levels, { levels : levels }],
            [techs.files.provide, { target : '?.bemjson.js' }],
            [techs.bem.bemjsonToBemdecl, { target : '?.bemdecl.js' }],
            [techs.bem.depsOld],
            [techs.bem.files],

            [techs.bem.depsByTechToBemdecl, {
                sourceTech : 'js',
                destTech : 'bemhtml',
                target : '?.bemhtml.bemdecl.js'
            }],
            [techs.bem.deps, {
                bemdeclFile : '?.bemhtml.bemdecl.js',
                target : '?.bemhtml.deps.js'
            }],
            [techs.bem.files, {
                depsFile : '?.bemhtml.deps.js',
                filesTarget : '?.bemhtml.files',
                dirsTarget : '?.bemhtml.dirs'
            }],
            [techs.stylus, {
                target: '_?.css',
                sourcemap: false,
            }],
            [techs.js, {
                target : '?.browser.js',
                includeYM : true
            }],
            [techs.engines.bemhtml, {
                sourceSuffixes: ['bemhtml', 'bemhtml.js'],
                devMode : false
            }],
            [techs.engines.bemhtml, {
                sourceSuffixes: ['bemhtml', 'bemhtml.js'],
                target : '?.browser.bemhtml.js',
                filesTraget : '?.bemhtml.files',
                devMode : false
            }],
            [techs.files.merge, {
                sources : ['?.browser.js', '?.browser.bemhtml.js'],
                target : '_?.js'
            }],
            [techs.html]
        ]);

        nodeConfig.addTargets([
             '_?.css', '_?.js', '?.html'
        ]);
    });


    config.includeConfig('enb-bem-specs');
    var specs = config.module('enb-bem-specs').createConfigurator('specs');
    specs.configure({
        destPath : 'specs',
        jsSuffixes : ['vanilla.js', 'js', 'browser.js'],
        sourceLevels : getDesktopLevels(),
        levels : ['common.blocks']

    });
};

function getDesktopLevels() {
    return [
        { path : 'libs/bem-pr/spec.blocks', check : false },
        { path : 'libs/bem-core/common.blocks', check : false },
        { path : 'libs/bem-core/desktop.blocks', check : false },
        { path : 'libs/bem-components/common.blocks', check : false },
        { path : 'libs/bem-components/desktop.blocks', check : false },
        { path : 'libs/bem-components/design/common.blocks', check : false },
        { path : 'libs/bem-components/design/desktop.blocks', check : false },
        'common.blocks'
    ];
}
