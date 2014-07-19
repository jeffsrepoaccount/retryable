module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            target: {
                files: [
                    { 
                        cwd: 'src', 
                        expand: true, src: ['**'], 
                        dest: 'dist/', 
                        filter: 'isFile' ,
                        rename: function(dest, src) {
                            var filename = src.substring(src.lastIndexOf('/')+1).split('.');
                            filename = filename[0] + '.debug.' + filename[1];
                            return dest + filename;
                        }
                    }
                ]
            }
        },
        karma: {
            target: {
                unit: {
                    configFile: 'karma.conf.js',
                },
                continuous: {
                    configFile: 'karma.conf.js',
                    singleRun: true,
                    browsers: ['PhantomJS']
                },
            }
        },
        uglify: {
            options: {
                banner: '/**\n'+ 
                 ' * <%= pkg.name %>, built on: <%= grunt.template.today("dd-mm-yyyy") %>\n' + 
                 ' * Copyright (C) <%= grunt.template.today("yyyy") %> Jeff Lambert \n' + 
                 ' *\n' + 
                 ' * https://github.com/jeffsrepoaccount/retryable\n' + 
                 ' * \n' + 
                 ' * The JavaScript code in this page is free software: you can\n' + 
                 ' * redistribute it and/or modify it under the terms of the GNU\n' + 
                 ' * General Public License (GNU GPL) as published by the Free Software\n' + 
                 ' * Foundation, either version 3 of the License, or (at your option)\n' + 
                 ' * any later version.  The code is distributed WITHOUT ANY WARRANTY;\n' + 
                 ' * without even the implied warranty of MERCHANTABILITY or FITNESS\n' + 
                 ' * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.\n' + 
                 ' */\n'
            },
            dist: {
                files: {
		    'dist/<%= pkg.name %>.min.js': [ 'src/**/*.js' ]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('build', [ 'uglify', 'copy' ]);
    grunt.registerTask('test', [ 'karma' ]);
};
