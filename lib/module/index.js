//Orc Module prototype
'use strict';
const register = require('./register');
//default module
const profile = require('./profile');
const item = require('./item');
exports.regModule = register;
exports._initDefaultModules = function(){
    this.regModule([],'profile',profile);
    this.regModule([],'item',item);
}