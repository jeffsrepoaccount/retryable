module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            target: {
                files: [
                    { expand: true, src: ['src/*'], dest: 'dest/', filter: 'isFile' }
                ]
            }
        },
        karma: {
            unit: {
                runnerPort: 9999,
                singleRun: true,
                browsers: ['PhantomJS'],
                logLevel: 'ERROR'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
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
