var dust = require('dust')();
var serand = require('serand');
var autils = require('autos-utils');
var utils = require('utils');

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

var list = function (el, options, fn) {
    $.ajax({
        url: utils.resolve('autos://apis/v/vehicles' + query(options)),
        dataType: 'json',
        success: function (data) {
            dust.render('auto-listing', autils.cdn288x162(data), function (err, out) {
                $('.auto-listing', el).remove();
                el.off('click', '.auto-sort .btn');
                el.append(out);
                el.on('click', '.auto-sort .btn', function () {
                    var sort = $(this).attr('name');
                    var serand = require('serand');
                    serand.emit('auto', 'sort', {sort: sort});
                    list(options, {
                        sort: sort
                    });
                });
                el.on('click', '.edit', function (e) {
                    serand.redirect($(this).closest('.thumbnail').attr('href') + '/edit');
                    return false;
                });
                if (!fn) {
                    return;
                }
                fn(false, function () {
                    $('.auto-listing', el).remove();
                });
            });
        },
        error: function () {
            fn(true, function () {

            });
        }
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
