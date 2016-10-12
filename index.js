var dust = require('dust')();
var serand = require('serand');
var utils = require('utils');
var Vehicle = require('vehicle-service');

var user;

var query = function (options) {
    if (!options) {
        return '';
    }
    var data = {
        criteria: {}
    };
    var name;
    var value;
    for (name in options) {
        if (!options.hasOwnProperty(name)) {
            continue;
        }
        if (name === '_') {
            continue;
        }
        value = options[name];
        data.criteria[name] = value instanceof Array ? {$in: value} : value;
    }
    return '?data=' + JSON.stringify(data);
};

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
    /*$.ajax({
        url: utils.resolve('autos://apis/v/vehicles' + query(options)),
        dataType: 'json',
        success: function (data) {
            dust.render('auto-listing', autils.cdn288x162(data), function (err, out) {
                $('.auto-listing', sandbox).remove();
                sandbox.off('click', '.auto-sort .btn');
                sandbox.append(out);
                sandbox.on('click', '.auto-sort .btn', function () {
                    var sort = $(this).attr('name');
                    var serand = require('serand');
                    serand.emit('auto', 'sort', {sort: sort});
                    list(options, {
                        sort: sort
                    });
                });
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
        },
        error: function () {
            fn(true, function () {

            });
        }
    });*/
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
