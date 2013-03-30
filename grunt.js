module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    hug: {
      client: {
        src: './app/src/index.js',
        dest: 'build/samelove.js',
        exportedVariable: 'samelove',
        exports: './app/src/index.js',
        path: ['./components']
      }
    },
    copy: {
      dev: {
        files: {
          "./static/" : "./build/**/*"
        }
      }
    },
    concat:{
      styles: {
        src: ['./app/style/reset.scss', './app/style/**/*.scss'],
        dest: './build/samelove.scss'
      }
    },
    watch: {
      all: {
        files: './app/**/*',
        tasks: 'concat hug sass copy reload'
      },
      statics: {
        files: './static/**/*',
        tasks: 'reload'
      }
    },
    server: {
      port: 81,
      base: './static'
    },
    reload: {
        port: 80,
        proxy: {
            host: 'localhost'
        }
    },
    sass: {
      styles:{
        files: {
          './build/samelove.css': './build/samelove.scss'
        }
      }
    },
    min: {
      samelove: {
        src: './build/samelove.js',
        dest: './static/samelove.js'
      }
    },
    clean: {
      build: ['./build/']
    }
  });

  grunt.loadNpmTasks('grunt-hug');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-reload');

  grunt.registerTask('dev', 'default server reload watch');
  grunt.registerTask('default', 'clean concat hug sass copy min');
};