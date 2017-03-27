//Module Base Function
'use strict';
const tool = require('../common/tool');
const modulesCache = require('../module/base').cache;
let strategies=new Map();
/**
 * Create a strategy cache with constructor function
 * @param  {Object}   orcObj            Orc Instance
 * @param  {Array}    dependModuleList  Depend modules list
 * @param  {String}   strategyName      Strategy name
 * @param  {Function} constructor       Constructor function
 */
function createStrategy(orcObj,dependModuleList,strategyName,constructor){
    if(!tool.testStringArgument(strategyName,3,20)){
        throw new Error('The strategy name must be 3-20 words/number');
    }
    //valid module depend list
    dependModuleList.forEach((dependName)=>{
        let trueDependModuleName=orcObj.config.name+':'+dependName;
        if(!tool.testStringArgument(dependName,3,20)){
            throw new Error('Dependence module name "' + dependName + '"" must be 3-20 words/number');
        }
        if(!modulesCache.has(trueDependModuleName)) throw new Error('Dependence module "' + dependName + '" not found');
    });
    let trueStrategyName=orcObj.config.name+':'+strategyName;
    if(strategies.has(trueStrategyName)){
        throw new Error('Strategy name"'+strategyName+'" is in use');
    }
    //Add method to Strategy constructor
    tool.applyMethods(constructor,{
        /**
         * Default init function, Strategy constructor function can use init function to init selfinfo
         * @param  {Object} strategyInfo Default info
         */
        _init:function(strategyInfo){
            this.orcClient=strategyInfo.orcObj;
            this.name=strategyInfo.strategyName;
            this.fullName=strategyInfo.trueStrategyName;
            this.depends=strategyInfo.dependModuleList;
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
         * Get dependent Module object, for orc module register
         * @param  {String} moduleName Dependent module name
         * @return {Object}            Dependent module object
         */
        getDependModule:function(moduleName){
            try{
                if(!moduleName) throw new Error('You must specify the module name');
                if(this.depends.indexOf(moduleName)===-1) throw new Error('You can only get module in dependency list');
                return modulesCache.get(this.orcClient.config.name+':'+moduleName);
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
    let strategyInstance=new constructor();
    strategyInstance._init({
        orcObj:orcObj,
        strategyName:strategyName,
        trueStrategyName:trueStrategyName,
        dependModuleList:dependModuleList
    });
    //Constructor init
    if(strategyInstance.init&&typeof strategyInstance.init==='function') strategyInstance.init();
    strategies.set(trueStrategyName,strategyInstance);
    return strategies.get(trueStrategyName);
}
exports.create=createStrategy;