'use strict';

/*
 *************************************************************
 * INSTRUCTIONS
 *
 * Go to your terminal and use "grunt" to deploy the site
 * locally and start developing
 *
 *************************************************************
 */

module.exports = function(grunt) {
    /*
     * Used for loading all of your grunt plugins
     */
    require('load-grunt-tasks')(grunt);

    /*
     *************************************************************
     * Grunt config
     *************************************************************
     */
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        /*
         * An array list of all your js files to be minified in compiling order
         */
        scripts: {
            cdn: [],
            libs: [
                'bower_components/jquery/dist/jquery.min.js'
            ],
            app: [
                'src/js/app/AppMain.js'
            ]
        },

        /*
         * Config variables for different deployment environments
         */
        config: {
            local: {
                options: {
                    variables: {
                        environment: {
                            id: "local",
                            host: "localhost",
                            dest: "dist/local/",
                            dir: "/"
                        }
                    }
                }
            }
        },

        /*
         *************************************************************
         * Grunt processes
         *************************************************************
         */

        /*
         * Delete all files in the distribution directory
         *
         */
        clean: {
            dist: {
                src: [
                    "<%= environment.dest %>"
                ]
            }
        },

        /*
         * Copy the asset directory
         * OR Copy the js directory if you are developing to preserve all your file paths
         */
        copy: {
            assets: {
                files: [{
                    expand: true,
                    cwd: "src/asset/",
                    src: ["**"],
                    dest: "<%= environment.dest %>asset/"
                }]
            },
            js: {
                files: [{
                    expand: true,
                    cwd: "src/js/",
                    src: ["**"],
                    dest: "<%= environment.dest %>js/"
                }]
            }
        },

        /*
         * SASS compilation
         */
        sass: {
            debug: {
                options: {
                    style: 'expanded'
                },
                files: {
                    "<%= environment.dest %>css/main.css": "src/css/main.sass"
                }
            },
            compile: {
                files: {
                    "<%= environment.dest %>css/main-min.css": "src/css/main.sass"
                }
            }
        },

        /*
         * JS compilation
         */
        uglify: {
            dist: {
                options: {
                    drop_console: true,
                    wrap: '<%= pkg.name %>'
                },
                files: {
                    '<%= environment.dest %>js/main-min.js': '<%= scripts.app %>'
                }
            }
        },

        /*
         * Concat all js libs into one lib file
         */
        concat: {
            dist: {
                src: '<%= scripts.libs %>',
                dest: '<%= environment.dest %>js/libs.js'
            }
        },

        /*
         * Jade compilation
         * - Modify the scripts array to remove the src directory path
         */
        jade: {
            dist: {
                options: {
                    pretty: false,
                    data: {
                        environment: "<%= environment %>",
                        scripts: "<%= scripts %>",
                        srcDir: "src/"
                    }
                },
                files: {
                    "<%= environment.dest %>index.html": "src/template/page/home.jade"
                }
            }
        },

        /*
         * Live reload your browser when developing
         */
        connect: {
            options: {
                port: 9000,
                hostname: 'localhost',
                livereload: 35729
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        '<%= environment.dest %>'
                    ]
                }
            }
        },

        /*
         * Watch files and update only changed content
         * - Added grunt-newer to compile only the jade file that pertains to what was changed
         */
        watch: {
            jade: {
                files: ['src/template/**/*.jade'],
                tasks: ['config:local', 'jade']
            },
            sass: {
                files: ['src/css/**/*.sass'],
                tasks: ['config:local', 'sass:debug']
            },
            js: {
                files: ['src/js/**/*.js'],
                tasks: ['config:local', 'copy:js']
            },
            gruntfile: {
                files: ['Gruntfile.js'],
                tasks: [
                    'config:local',
                    'clean',
                    'copy:assets',
                    'copy:js',
                    'sass:debug',
                    'jade'
                ]
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: ['src/**/*']
            }
        }
    });


    /*
     *************************************************************
     * Grunt tasks to be run through your terminal
     *************************************************************
     */

    /*
     * The default "grunt" task is for active development
     */
    grunt.registerTask('default', [
        'config:local',
        'clean',
        'copy:assets',
        'copy:js',
        'concat',
        'sass:debug',
        'jade',
        'connect:livereload',
        'watch'
    ]);

    /*
     * Compile build for the different deployment environments
     */
    grunt.registerTask('build', function(_environment) {
        grunt.task.run([
            'config:' + _environment,
            'clean',
            'copy:assets',
            'uglify',
            'concat',
            'sass:compile',
            'jade'
        ]);
    });
};