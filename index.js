var AltConversion = require('./lib/altcalc');

var AirProperties = {
    // elevation in feet
    elevToPsia: function(elev) {
        if (typeof elev !== 'number') { elev = 0; };
        bp = Math.round((29.921 * Math.pow((1 - 6.87535e-06 * elev), 5.256) * 0.489306) * 100000) / 100000;
        return Math.min(Math.max(bp, -1), 15.50708);
    },
    /*
     15.5 is about -1600 ft below sea level.
    */
    hgaToPsia: function(hga) {
        if (typeof hga !== 'number') {
            hga = 29.921;
        };
        hg = Math.round((hga * 0.489306) * 1000) / 1000;
        return Math.min(Math.max(hg, 0), 15.50708);
    },
    barometricConvert: function(barometric, from, to) {
        // this function is not complete
        var toPsi = null;
        var toInHg = null;
        var toAlt = null;
        if (!isFinite(barometric)) {
            throw new TypeError('Altitude must be a number');
        } else if (from === to) {
            return barometric;
        } else if (['alt', 'inHg', 'psi'].indexOf(to) === -1) {
            throw new RangeError('Units must be alt, inHg or psi');
        } else if (from === 'alt') {
            toPsi = Math.round((29.921 * Math.pow((1 - 6.87535e-06 * barometric), 5.256) * 0.489306) * 100000) / 100000;
            toInHg = Math.round((barometric * 0.489306) * 1000) / 1000;
            return (to === 'psi') ? toPsi : toInHg
        } else if (from === 'inHg') {
            toPsi = Math.round((barometric * 0.489306) * 10000) / 10000;
            return (to === 'psi') ? toPsi : toAlt
        } else if (from === 'psi') {
            return (to === 'inHg') ? toInHg : toAlt
        }
    },
    pressureConvert: function(pressure, from, to) {
        if (!isFinite(pressure)) {
            throw new TypeError('pressure must be a number');
        } else if (from === to) {
            return pressure;
        } else if (['pa', 'psi', 'atm'].indexOf(to) === -1) {
            throw new RangeError('Units must be alt, atm or psi');
        } else if (from === 'pa') {
            return (to === 'psi') ? pressure * 0.000145038 : pressure * 9.8692e-6;
        } else if (from === 'psi') {
            return (to === 'pa') ? parseFloat((pressure * 6894.75729).toFixed(5)) : parseFloat((pressure / 14.6959488).toFixed(10));
        } else if (from === 'atm') {
            return (to === 'pa') ? pressure * 101325 : pressure * 14.6959488;
        }
    },
    altitudeConvert: function(opts) {
        console.log(opts);
        return AltConversion.computeAltitude(opts);
    }
}

module.exports = AirProperties