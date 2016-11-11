//Orc Module prototype
'use strict';
const register = require('./register');
//default module
const profile = require('./profile');
const item = require('./item');
const ranking = require('./ranking');
exports.regModule = register;
exports._initDefaultModules = function(){
    this.regModule([],'profile',profile);
    this.regModule([],'item',item);
    //if config dimensionWeight exist, register ranking module
    if(this.config.dimensionWeight){
        this.regModule(['profile','item'],'ranking',ranking);
    }
}