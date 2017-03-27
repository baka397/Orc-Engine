//Module Base Function
'use strict';
const tool = require('../common/tool');
/**
 * Create a module cache with constructor function
 * @param  {Object}   orcObj      Orc Instance
 * @param  {Array}    dependList  Depend modules list
 * @param  {String}   moduleName  Module name
 * @param  {Function} constructor Constructor function
 */
const middlewareTaskCreate = require('../middleware/base').task;
let modules=new Map();
function createModule(orcObj,dependList,moduleName,constructor){
    if(!tool.testStringArgument(moduleName,3,20)){
        throw new Error('The module name must be 3-20 words/number');
    }
    //valid module depend list
    dependList.forEach((dependName)=>{
        let trueDependModuleName=orcObj.config.name+':'+dependName;
        if(!tool.testStringArgument(dependName,3,20)){
            throw new Error('Dependence module name "' + dependName + '"" must be 3-20 words/number');
        }
        if(!modules.has(trueDependModuleName)) throw new Error('Dependence module "' + dependName + '" not found');
    });
    let trueModuleName=orcObj.config.name+':'+moduleName;
    if(modules.has(trueModuleName)){
        throw new Error('Module name"'+moduleName+'" is in use');
    }
    //Add method to Module constructor
    tool.applyMethods(constructor,{
        /**
         * Default init function, module constructor function can use init function to init selfinfo
         * @param  {Object} moduleInfo Default info
         */
        _init:function(moduleInfo){
            this.orcClient=moduleInfo.orcObj;
            this.name=moduleInfo.moduleName;
            this.fullName=moduleInfo.trueModuleName;
            this.depends=moduleInfo.dependList;
        },
        /**
         * Create base middleware for module
         * @param  {String} name Optional, middleware name, default use module name
         */
        use:function(name){
            let args=Array.prototype.slice.call(arguments, 0);
            //for unspecified middleware
            if(typeof name !== 'string'){
                args.unshift(this.name);
            }
            this.orcClient.use.apply(this.orcClient,args);
        },
        /**
         * Get orc config
         * @return {Object} Orc client config
         */
        getConfig:function(){
            return this.orcClient.config;
        },
        /**
         * Get orc tools
         * @return {Object} tools object
         */
        getTools:function(){
            return this.orcClient.orcTools;
        },
        /**
         * Get redis standard key
         * @param  {String} keyName Key name
         * @return {String}         Module namespace key
         */
        getRedisKey:function(keyName){
            return this.orcClient.config.name+':'+this.name+':'+keyName;
        },
        //Get redis client
        getRedisClient:function(){
            return this.orcClient.redis;
        },
        /**
         * Get middleware list
         * @param  {String}   name  Optional, middleware name, default use module name
         * @param  {Object}   datas Middleware Datas
         * @return {Object}         Promise object
         */
        getMiddlewares:function(name,datas){
            let middlewareName=this.name;
            let middlewareDatas;
            if(datas){
                middlewareName=name;
                middlewareDatas=datas;
            }else{
                middlewareDatas=name;
            }
            return middlewareTaskCreate(middlewareDatas,this.orcClient._middleware[middlewareName]||[]);
        },
        /**
         * Get dependent Module object, for orc module register
         * @param  {String} moduleName Dependent module name
         * @return {Object}            Dependent module object
         */
        getDependModule:function(moduleName){
            try{
                if(!moduleName) throw new Error('You must specify the module name');
                if(this.depends.indexOf(moduleName)===-1) throw new Error('You can only get module in dependency list');
                return modules.get(this.orcClient.config.name+':'+moduleName);
            }catch(e){
                this.emit('error',e);
                return null;
            }
        },
        //Emit event to orc client
        emit:function(){
            let args=Array.prototype.slice.call(arguments, 0);
            this.orcClient.emit.apply(this.orcClient,args);
        }
    });
    let moduleInstance=new constructor();
    moduleInstance._init({
        orcObj:orcObj,
        moduleName:moduleName,
        trueModuleName:trueModuleName,
        dependList:dependList
    });
    //Constructor init
    if(moduleInstance.init&&typeof moduleInstance.init==='function') moduleInstance.init();
    modules.set(trueModuleName,moduleInstance);
    return modules.get(trueModuleName);
}
exports.create=createModule;