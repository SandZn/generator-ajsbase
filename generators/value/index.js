'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const camelize = require('camelize');
const decamelize = require('decamelize');
const pkg = require('package-json-utils');

module.exports = class extends Generator {

    constructor(args, opts) {
        super(args, opts);

        this.argument('valuename', {
            type: String,
            required: true,
            desc: '[Value name]'
        });

        this.argument('filepath', {
            type: String,
            required: false,
            default: '.',
            desc: '[Script path]'
        });

        this.argument('testpath', {
            type: String,
            required: false,
            default: 'test/spec',
            desc: '[Test path]'
        });

        this.option('disableConsole', {
            desc: 'Disable yosay console (default: false)'
        });

        this.modulename = pkg.getModuleName();
        this.filepath = this.options.filepath;
        this.testpath = this.options.testpath;
        this.folder = '/services/';

        this.name = this.options.valuename || 'none';
        this.console = !this.options.disableConsole;

        this.varname = camelize(this.name);
        this.valuename = this.varname + 'Value';
        this.file = decamelize(this.valuename) + '.js';
        this.filetest = decamelize(this.valuename) + '_test.js';
    }

    prompting() {
        var text = 'Making the value ' + chalk.blue(this.name);
        this.log(this.console ? yosay(text) : text);
    }

    writing() {
        this._writingValue();
        this._writingTest();
    }

    _writingValue() {
        this.fs.copyTpl(
            this.templatePath('value.js'),
            this.destinationPath(this.filepath + this.folder + this.file), {
                varname: this.varname,
                name: this.valuename,
                modulename: this.modulename
            }
        );
    }

    _writingTest() {
        this.fs.copyTpl(
            this.templatePath('value_test.js'),
            this.destinationPath(this.testpath + this.folder + this.filetest), {
                varname: this.varname,
                name: this.valuename,
                modulename: this.modulename
            }
        );
    }
};