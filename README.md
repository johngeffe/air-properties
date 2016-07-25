airproperties


Collection of small function to get the various properties of airproperties
none of this is ready for production use.

trying different techniques and trying to figure out git.

* elevation to Psia: 
- limited from -1600 feet to very 0 Psia.

* elevToPsia(feet) returns barametric pressure of altitude
- hgaToPsia(hga) returns barametric pressure of altitude

* npm run test
- checks max, min, number, 1000 feet, -1600 feet (lowest), -1700 feet (return same as -1600)


