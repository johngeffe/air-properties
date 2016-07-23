var AirProperties = {
    elevToPsia: function (elev) {
        if (typeof elev !=='number') { elev = 0; };
        bp = Math.round((29.921 * Math.pow((1 - 6.87535e-06 * elev), 5.256) * 0.489306) * 100000) / 100000;
        return Math.min(Math.max(bp, -1), 15.50708);
    },
    /*
     15.5 is about -1600 ft below sea level.
    */
    hgaToPsia: function (hga) {
        if (typeof hga !== 'number') {
            hga = 29.921;
        };
        hg = Math.round((hga * 0.489306) * 1000) / 1000;
        return Math.min(Math.max(hg, 0), 15.50708);
    }
}
module.exports = AirProperties
