var dust = require('dust')();
var serand = require('serand');
var utils = require('utils');
var Vehicle = require('vehicle-service');

var user;

var list = function (sandbox, options, fn) {
    Vehicle.find({query: options, images: '288x162'}, function (err, vehicles) {
        if (err) {
            fn(true, serand.none);
            return;
        }
        dust.render('auto-listing', vehicles, function (err, out) {
            sandbox.append(out);
            sandbox.on('click', '.edit', function (e) {
                serand.redirect($(this).closest('.thumbnail').attr('href') + '/edit');
                return false;
            });
            if (!fn) {
                return;
            }
            fn(false, function () {
                $('.auto-listing', sandbox).remove();
            });
        });
    });
};

dust.loadSource(dust.compile(require('./template'), 'auto-listing'));

module.exports = function (sandbox, fn, options) {
    list(sandbox, options, fn);
};

serand.on('user', 'ready', function (usr) {
    user = usr;
});

serand.on('user', 'logged in', function (usr) {
    user = usr;
});

serand.on('user', 'logged out', function (usr) {
    user = null;
});
