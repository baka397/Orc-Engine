//Register module
'use strict';
const tool = require('../common/tool');
const createModule = require('./base').create;

/**
 * Register module
 * @param  {Array}    dependList  Module dependence list
 * @param  {String}   moduleName  Register Module name
 * @param  {Function} constructor Module constructor function
 */
function regModule(dependList,moduleName,constructor){
    try{
        let moduleArguments=Array.prototype.slice.call(arguments, 0);
        moduleArguments.unshift(this);
        let regModuleObj=createModule.apply(null,moduleArguments);
        this['get'+tool.firstWordUpper(moduleName)]=regModuleObj;
    }catch(err){
        this.emit('error',err);
    }
}
module.exports=regModule;