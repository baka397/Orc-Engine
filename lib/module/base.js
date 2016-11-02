//Create Module
'use strict';
const tool = require('../common/tool');
/**
 * Create a module cache with constructor function
 * @param  {Object}   orcObj      Orc Instance
 * @param  {String}   moduleName  Module name
 * @param  {Function} constructor Constructor function
 */
let modules={}
function createModule(orcObj,moduleName,constructor){
    if(!tool.testStringArgument(moduleName,5,20)){
        throw new Error('The module name must be 5-20 words/number');
    }
    let trueModuleName=orcObj.config.name+'_'+moduleName;
    if(modules[trueModuleName]) return modules[trueModuleName];
    //Add method to Module constructor
    tool.applyMethods(constructor,{
        orcClient:orcObj,
        name:moduleName,
        getRedisKey:function(keyName){
            return this.orcClient.config.name+':'+this.name+':'+keyName;
        },
        getRedisClient:function(){
            return this.orcClient.redis;
        },
        getMiddlewares:function(){
            return this.orcClient._middleware[this.name]||[];
        },
        emit:function(){
            let args=Array.prototype.slice.call(arguments, 0);
            this.orcClient.emit.apply(this.orcClient,args);
        }
    });
    modules[trueModuleName]=new constructor();
    return modules[trueModuleName];
}
exports.create=createModule;