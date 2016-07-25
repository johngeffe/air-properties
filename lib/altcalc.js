function altConversion(opts) {
    opts || (opts = {});
    opts.units = unitsFormat(opts.units);
    return new AltConversion(opts);
}

module.exports = altConversion;

function AltConversion(opts) {
    this.units = opts.units;
    this.pressureAtSeaLevel = opts.pressureAtSeaLevel;
    this.temp = opts.temp;
    this.pressureAtAltitude = opts.pressureAtAltitude;
    this.altitude = opts.elev;
    this._units = {
        temp: opts.units.temp,
        pressure: opts.units.pressure,
        altitude: opts.units.altitude
    };
}

AltConversion.prototype.toPascals = function() {
    this._units.pressure = 'pa';
    return this;
}

AltConversion.prototype.toPa = AltConversion.prototype.toPascals;

AltConversion.prototype.toPsi = function() {
    this._units.pressure = 'psi';
    return this;
}

AltConversion.prototype.toAtmospheres = function() {
    this._units.pressure = 'atm';
    return this;
}

AltConversion.prototype.toAtm = AltConversion.prototype.toAtmospheres;

var M = 0.0289644;
var g = 9.80665; //1 mmH20, mmWg, mmWC = Millimeters of Water as Pascals
var R = 8.31432;
var p_default = 101325; // 1 atm, Standard Atmosphere as Pascals value
var t_default = 288.15; // 59°F in Kelvin

function noChange(a) {
    return a
}

/*
m = meters | ft = feet
pa = pascals | psi = psi | atm = atmosphere
C = Celcius | F = Fahrenheit | K = Kelvin
*/

var unitConversions = {
    F: {
        F: noChange,
        C: function(a) {
            return ((a - 32) * 5) / 9 // convert F to C
        },
        K: function(a) { // convert F to K
            return (a - 32) / 1.8 + 273.15
        },
        standard: function(a) { // standard is K
            return (a - 32) / 1.8 + 273.15
        }
    },
    C: {
        F: function(a) { // convert C to F
            return (a * 1.8) + 32
        },
        C: noChange,
        K: function(a) { // convert C to K
            return a + 273.15
        },
        standard: function(a) { // standard is K
            return a + 273.15
        }
    },
    K: { // convert K to F
        F: function(a) {
            return (a * 1.8) - 459.67
        },
        C: function(a) { // convert K to C
            return a - 273.15
        },
        K: noChange,
        standard: noChange // standard is K
    },
    ft: {
        m: function(a) { // convert feet to meters
            return a * 0.3048
        },
        ft: noChange,
        standard: function(a) { // standard is meters
            return a * 0.3048
        }
    },
    m: {
        m: noChange,
        ft: function(a) { // convert meters to feet
            return a * 3.2808
        },
        standard: noChange // standard is meters
    },
    Pa: {
        Pa: noChange,
        psi: function(a) { // convert pascals to psi
            return a / 6894.75729
        },
        atm: function(a) { // convert pascals to atmospheres
            return a / 101325
        },
        standard: noChange // standard is pascals
    },
    psi: {
        Pa: function(a) { // psi to Pascals
            return a * 6894.75729
        },
        psi: noChange,
        atm: function(a) { // psi to atmospheres
            return a / 14.6959488
        },
        standard: function(a) { // standard is Pascals
            return a * 6894.75729
        }
    },
    atm: {
        Pa: function(a) { // atmospheres to Pascals
            return a * 101325
        },
        psi: function(a) { // atmospheres to psi
            return a * 14.6959488
        },
        atm: noChange,
        standard: function(a) { // standard is pascals
            return a * 101325
        }
    }
};

function convertUnits(a, c, b) {
    // a = value, c= from, b= to | if null convert to standard (Kelvin, Pascals, Meters)
    b = b == null ? "standard" : b;
    return unitConversions[c][b](a);
}
/*
var M = 0.0289644; 
var g = 9.80665; //1 mmH20, mmWg, mmWC = Millimeters of Water as Pascals
var R = 8.31432;
*/
function altcalc(a, k, i) {
    // a= sea level in atmospheres
    // k= temperature in kelvin
    // i= pressure in pascals
    if ((a / i) < (101325 / 22632.1)) {
        var d = -0.0065;
        var e = 0;
        var j = Math.pow((i / a), (R * d) / (g * M));
        return e + ((k * ((1 / j) - 1)) / d)
    } else {
        if ((a / i) < (101325 / 5474.89)) {
            var e = 11000;
            var b = k - 71.5;
            var f = (R * b * (Math.log(i / a))) / ((-g) * M);
            var l = 101325;
            var c = 22632.1;
            var h = ((R * b * (Math.log(l / c))) / ((-g) * M)) + e;
            return h + f
        }
    }
    return NaN
}

function press_temp_alt(b, k, j) {
    if (j < 11000) {
        var e = -0.0065;
        var i = 0;
        return b * Math.pow(k / (k + (e * (j - i))), (g * M) / (R * e))
    } else {
        if (j <= 20000) {
            var e = -0.0065;
            var i = 0;
            var f = 11000;
            var a = b * Math.pow(k / (k + (e * (f - i))), (g * M) / (R * e));
            var c = k + (11000 * (-0.0065));
            var d = 0;
            return a * Math.exp(((-g) * M * (j - f)) / (R * c))
        }
    }
    return NaN
}

module.exports.computePressure = function(pressureSeaLevel, temp, pressureAtAltitude) {
    var e = this.opts.pressureSeaLevel;
    var a = this.opts.temp;
    var d = this.opts.pressureAtAltitude;
    if (d > 20000) {
        // "The maximum altitude is 20,000 meters (65,617 feet)."
        return
    }
    var c = press_temp_alt(e, a, d);
};

module.exports.computeAltitude = function(opts) {
    var d = convertUnits(opts.pressureAtSeaLevel, opts.units.pressure, 'Pa');
    var a = convertUnits(opts.temp, opts.units.temp, 'K');
    var c = convertUnits(opts.pressureAtAltitude, opts.units.pressure, 'Pa');
    if ((d / c) >= (101325 / 5474.89)) {
        alert("The calculated altitude exceeds the maximum of 20,000 meters (65,617 feet).");
        return
    }
    var b = altcalc(d, a, c);
    var f = convertUnits(b, 'm', opts.units.altitude);
    console.log('calculated altitude of: ' + f + ' ' + opts.units.altitude);
    return convertUnits(b, 'm', opts.units.altitude);
};