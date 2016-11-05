//Use middleware
'use strict';
const register = require('./register');
//default module
const profile = require('./profile');
exports.regModule = register;
exports._initDefaultModules = function(){
    this.regModule([],'profile',profile);
}