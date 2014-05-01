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
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Delete all files in the distribution directory
    clean: {
      dist: {
        src: [
          "dist"
        ]
      }
    },

    // SASS compilation
    sass: {
      dist: {
        options: {
          sourcemap: true
        },
        files:{
          "dist/css/main.css": "src/css/main.sass"
        }
      }
    },

    // Jade compilation
    jade: {
      dist: {
        files: {
          "dist/index.html": "src/index.jade"
        }
      }
    },

    // uglify
    uglify: {
      dist: {
        files: {
          'dist/js/script.js': 'src/js/script.js'
        }
      }
    },

    // Live reload your browser when developing
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
            'dist'
          ]
        }
      }
    },

    // Watch files and update only changed content
    // - Added grunt-newer to compile only the jade file that pertains to what was changed
    watch: {
      jade: {
        files: ['src/template/**/*.jade'],
        tasks: ['newer:jade']
      },
      sass: {
        files: ['src/css/**/*.sass'],
        tasks: ['sass']
      },
      js: {
        files: ['src/js/**/*.js'],
        tasks: ['newer:uglify']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: ['src/**/*']
      }
    }
  });


  //----------------------------------------------
  //- Grunt tasks to be run through your terminal
  //----------------------------------------------

  // The default "grunt" task is for active development
  grunt.registerTask('default', [
    'clean',
    'uglify',
    'sass',
    'jade',
    'connect:livereload',
    'watch'
  ]);
};