'use strict';

module.exports = function(grunt) {

    grunt.initConfig({
        // Metadata.
        // pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
        // Task configuration.
        concat: {
            options: {
                stripBanners: true
            },
            dist: {
                src: [
                    'css/main.css'
                ],
                dest: 'dist/deploy.css'
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                src: '<%= concat.dist.dest %>',
                dest: 'dist/<%= pkg.name %>.min.js'
            }
        },
        nodeunit: {
            files: ['test/**/*_test.js']
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            lib: {
                options: {
                    jshintrc: 'lib/.jshintrc'
                },
                src: ['lib/**/*.js']
            },
            test: {
                src: ['test/**/*.js']
            }
        },
        // WATCH TASK
        watch: {
            // express: {
            //   files:  [ '**/*.js' ],
            //   tasks:  [ 'express:dev' ],
            //   options: {
            //     spawn: false // for grunt-contrib-watch v0.5.0+, "nospawn: true" for lower versions. Without this option specified express won't be reloaded 
            //   }
            // },
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            css: {
                files: 'css/*.sass',
                tasks: ['sass']
            }
        }, // end watch
        cssmin: {
            minify: {
                src: 'dist/deploy.css',
                dest: 'dist/deploy.min.css'
            }
        },
        sass: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'css/',
                    src: ['**/*.sass'],
                    dest: 'css/',
                    ext: '.css'
                }]
            }
        },
        autoprefixer: {
            options: {
                browsers: ['last 2 versions', 'ie 8', 'ie 9', '> 1%']
            },
            main: {
                expand: true,
                flatten: true,
                src: 'dist/deploy.css',
                dest: 'dist/'
            }
        },
        express: {
          dev: {
            options: {
              script: 'server.js'
            }
          },
        },
        browserSync: {
          bsFiles: {
              src : [
                  'css/*.css',
                  '*.html'
              ]
          },
          options: {
              watchTask: true,
              proxy: "localhost:1337",
              open:false,
          }
        },
        htmllint: {
            all: ["index.html"]
        },
        imagemin: {                          // Task 
            dynamic: {                         // Another target
                options: {                       // Target options 
                    optimizationLevel: 3,
                    svgoPlugins: [{ removeViewBox: false }],
                },
                files: [{
                    expand: true,                  // Enable dynamic expansion 
                    cwd: 'assets/poster/',                   // Src matches are relative to this path 
                    src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match 
                    dest: 'assets/header/dist/'                  // Destination path prefix 
                }]
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-html');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-jshint');


    // Default task.
    grunt.registerTask('default', ['express:dev','browserSync','watch']);
    grunt.registerTask('cat', ['concat']);
    grunt.registerTask('deploy', ['sass','concat','autoprefixer','cssmin']);

};
