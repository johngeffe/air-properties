var expect = require('chai').expect;
var should = require('chai').should();
var assert = require('chai').assert;

var AirProperties = require('../index');
elevToPsia = AirProperties.elevToPsia;
hgaToPsia = AirProperties.hgaToPsia;
barometricConvert = AirProperties.barometricConvert;
pressureConvert = AirProperties.pressureConvert;
altitudeConvert = AirProperties.altitudeConvert;

describe('#elevToPsia', function() {
    it('converts 1000 feet into 14.11915 Psia', function() {
        expect(elevToPsia(1000)).equals(14.11915);
    });
    it('lowest elev is -1600 feet into 15.50708 Psia', function() {
        expect(elevToPsia(-1600)).equals(15.50708);
    });
    it('lowest elev is -1700 feet max 15.50708 Psia', function() {
        expect(elevToPsia(-1700)).equals(15.50708);
    });
    it('500 feet should not be 14.11915', function() {
        expect(elevToPsia(500)).to.not.equal(14.11915);
    });
    it('elev 500 is higher Psia than 14.11915', function() {
        assert.isAbove(elevToPsia(500), 14.11915, 'lower elev is higher Psia');
    });
    it('elev 10000 is lower Psia than 14.11915', function() {
        assert.isBelow(elevToPsia(10000), 14.11915, 'higher elev is lower Psia');
    });
    it('elev 0 (sea level) is equal to 14.64052', function() {
        expect(elevToPsia(0)).equals(14.64052);
    });
    it('elev "undefined" defaults to sea level 14.64052 Psia', function() {
        expect(elevToPsia(undefined)).equals(14.64052);
    });
    it('elev "null" defaults to sea level 14.64052 Psia', function() {
        expect(elevToPsia(null)).equals(14.64052);
    });
    it('elev is not a number defaults to sea level 14.64052 Psia', function() {
        var myTestObj = { 'my': 'key' };
        expect(elevToPsia(myTestObj)).equals(14.64052);
    });
});

describe('#hgaToPsia', function() {
    it('highest output is 15.50708 Psia', function() {
        expect(hgaToPsia(14.11915)).equals(6.909);
    });
    it('converts 14.11915 into 6.909 Psia', function() {
        expect(hgaToPsia(14.11915)).equals(6.909);
    });
    it('hga "undefined" defaults to sea level 14.64052 Psia', function() {
        assert.isBelow(hgaToPsia(undefined), 15.50708, 'lower then 15.50708');
    });
    it('hga "null" defaults to sea level 14.64052 Psia', function() {
        assert.isBelow(hgaToPsia(null), 15.50708, 'lower then 15.50708');
    });
    it('hga is not a number defaults to sea level 14.64052 Psia', function() {
        var myTestObj = { 'my': 'key' };
        assert.isBelow(hgaToPsia(myTestObj), 15.50708, 'lower then 15.50708');
    });
});

describe('#barometricConvert', function() {
    it('29.92 inHg = 14.64 Psia', function() {
        expect(barometricConvert(29.921, 'inHg', 'psi')).equals(14.6405);
    });
    it('1000 altitude = 14.11915 Psia', function() {
        expect(barometricConvert(1000, 'alt', 'psi')).equals(14.11915);
    });
});

describe('#pressureConvert', function() {
    it('100000 Pa = 14.5037738 psi', function() {
        expect(pressureConvert(100000, 'pa', 'psi')).equals(14.5038);
    });
    it('100000 Pa = 0.98692 atm', function() {
        expect(pressureConvert(100000, 'pa', 'atm')).equals(0.98692);
    });
    it('1 psi = 6894.75729 Pa', function() {
        expect(pressureConvert(1, 'psi', 'pa')).equals(6894.75729);
    });
    it('1 psi = 0.0680459638 atm', function() {
        expect(pressureConvert(1, 'psi', 'atm')).equals(0.0680459638);
    });
});

describe('#computeAltitude', function() {
    it('pressure (sealevel) to altitude = 0', function() {
        var options = {
            temp: 59.9,
            pressureAtSeaLevel: 101325,
            pressureAtAltitude: 101325,
            units: {
                temp: 'F',
                pressure: 'Pa',
                altitude: 'ft'
            }
        };
        expect(altitudeConvert(options)).equals(0);
    });
    it('pressure (300meter/97772.58) to altitude = 300', function() {
        var options = {
            temp: 59.9,
            pressureAtSeaLevel: 101325,
            pressureAtAltitude: 97772.58,
            units: {
                temp: 'F',
                pressure: 'Pa',
                altitude: 'm'
            }
        };
        expect(altitudeConvert(options)).to.be.at.least(300);
    });
    it('pressure (1000ft/97772.58) to altitude = 1000 ft', function() {
        var options = {
            temp: 59.9,
            pressureAtSeaLevel: 101325,
            pressureAtAltitude: 97716.57,
            units: {
                temp: 'F',
                pressure: 'Pa',
                altitude: 'ft'
            }
        };
        expect(altitudeConvert(options)).to.be.at.least(1000);
    });
});