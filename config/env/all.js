'use strict';

module.exports = {
    app: {
        title: 'Andela Institute',
        description: 'Full-Stack JavaScript with MongoDB, Express, AngularJS, and Node.js',
        keywords: 'MongoDB, Express, AngularJS, Node.js'
    },
    port: process.env.PORT || 3000,
    templateEngine: 'swig',
    sessionSecret: 'MEAN',
    sessionCollection: 'sessions',
    assets: {
        lib: {
            css: [
                'public/lib/bootstrap/dist/css/bootstrap.css',
                'public/lib/bootstrap/dist/css/bootstrap-theme.css',
            ],
            js: [
                'public/lib/jquery/dist/jquery.js',
                'public/lib/ng-file-upload/angular-file-upload-html5-shim.min.js',
                'public/lib/angular/angular.js',
                'public/lib/ng-file-upload/angular-file-upload.min.js',
                'public/lib/angular-route/angular-route.js',
                'public/lib/angular-resource/angular-resource.js',
                'public/lib/angular-cookies/angular-cookies.js',
                'public/lib/angular-animate/angular-animate.js',
                'public/lib/angular-touch/angular-touch.js',
                'public/lib/angular-sanitize/angular-sanitize.js',
                'public/lib/angular-ui-router/release/angular-ui-router.js',
                'public/lib/angular-ui-utils/ui-utils.js',
                'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
                'public/lib/angular-file-upload/dist/angular-file-upload.min.js',
                'public/lib/angular-file-upload/dist/angular-file-upload-shim.min.js',
                'public/lib/moment/min/moment.min.js',
                'public/lib/angular-macgyver/lib/macgyver.js',
                'public/lib/angular-macgyver/lib/macgyver-filters.js'
            ]
        },
        css: [
            'public/modules/**/css/*.css',
            'public/lib/angular-macgyver/lib/*.css'
        ],
        js: [
            'public/config.js',
            'public/application.js',
            'public/modules/*/*.js',
            'public/modules/*/*[!tests]*/*.js',
            'public/modules/core/js/app.js'
        ],
        tests: [
            'public/lib/angular-mocks/angular-mocks.js',
            'public/modules/*/tests/*.js'
        ]
    }
};
