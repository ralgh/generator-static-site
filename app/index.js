'use strict';
var util = require('util');
var path = require('path');
var os = require('os');
var spawn = require('child_process').spawn;
var yeoman = require('yeoman-generator');


var AppGenerator = module.exports = function Appgenerator(args, options, config) {
	yeoman.generators.Base.apply(this, arguments);

	this.indexFile = this.readFileAsString(path.join(this.sourceRoot(), 'index.html'));
	this.mainJsFile = '';

	this.on('end', function () {
		if (options['skip-install']) {
			console.log('\n\nDone. Just run ' + 'npm install & bower install --dev'.bold.yellow + ' to install the required dependencies.\n\n');
		} else {
				console.log('\n\nDone. Running ' + 'npm install & bower install'.bold.yellow + ' for you to install the required dependencies. If this fails, try running the command yourself.\n\n');
				var cmdExt = ( os.platform() === 'win32' ) ? '.cmd' : '';
				spawn('npm' + cmdExt, ['install'], { stdio: 'inherit' });
				spawn('bower' + cmdExt, ['install'], { stdio: 'inherit' });
		}
	});

	this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(AppGenerator, yeoman.generators.NamedBase);

AppGenerator.prototype.askFor = function askFor() {
	var cb = this.async();

	// welcome message
	var welcome =
	'\n    Yo, just so you know...'.yellow.bold+'\n';

	console.log(welcome);
	console.log('"Out of the box" this includes jQuery and Modernizr.');

	var prompts = [{
		name: 'compassBootstrap',
		message: 'Would you like to include Twitter Bootstrap for Sass?',
		default: 'Y/n',
		warning: 'Yes: All Twitter Bootstrap files will be placed into the styles directory.'
	}
	// , {}
	];

	this.prompt(prompts, function (err, props) {
		if (err) {
			return this.emit('error', err);
		}

		// manually deal with the response, get back and store the results.
		// we change a bit this way of doing to automatically do this in the self.prompt() method.
		this.compassBootstrap = (/y/i).test(props.compassBootstrap);
		this.includeRequireJS = (/y/i).test(props.includeRequireJS);

		cb();
	}.bind(this));
};

AppGenerator.prototype.gruntfile = function gruntfile() {
	this.template('Gruntfile.js');
};

AppGenerator.prototype.packageJSON = function packageJSON() {
	this.template('_package.json', 'package.json');
};

AppGenerator.prototype.git = function git() {
	this.copy('gitignore', '.gitignore');
	this.copy('gitattributes', '.gitattributes');
};

AppGenerator.prototype.bower = function bower() {
	this.copy('bowerrc', '.bowerrc');
	this.copy('_component.json', 'component.json');
};

AppGenerator.prototype.editorConfig = function editorConfig() {
	this.copy('editorconfig', '.editorconfig');
};

AppGenerator.prototype.app = function app() {
	this.mkdir('app');
	this.mkdir('app/scripts');
	this.mkdir('app/styles');
	this.mkdir('app/images');
	this.write('app/index.html', this.indexFile);
	this.write('app/scripts/main.js', this.mainJsFile);
};

AppGenerator.prototype.misc = function misc() {
	this.copy('favicon.ico', 'app/favicon.ico');
	this.copy('404.html', 'app/404.html');
	this.copy('robots.txt', 'app/robots.txt');
};

AppGenerator.prototype.content = function content() {
	this.mkdir('app/pages');
	this.mkdir('app/pages/partials');
	this.mkdir('app/templates');
	//this.copy('index.html', 'app/pages/index.html');
};

AppGenerator.prototype.scss = function scss() {
	this.write('app/styles/screen.scss', '//screen.scss');
};
