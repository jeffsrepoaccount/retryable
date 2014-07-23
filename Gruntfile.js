module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            target: {
                files: [
                    { 
                        cwd: 'src', 
                        expand: true, 
                        src: ['**'], 
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
                banner: '// <%= pkg.name %>, built on: <%= grunt.template.today("dd-mm-yyyy") %>\n'
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
