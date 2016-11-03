//Use middleware
'use strict';
const tool = require('../common/tool');
const createModule = require('./base').create;

function regModule(moduleName,constructor){
    try{
        let regModuleObj=createModule(this,moduleName,constructor);
        this['get'+tool.firstWordUpper(moduleName)]=regModuleObj;
    }catch(err){
        this.emit('error',err);
    }
}
module.exports=regModule;