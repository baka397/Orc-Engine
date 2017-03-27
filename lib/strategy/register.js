//Register strategy
'use strict';
const tool = require('../common/tool');
const createStrategy = require('./base').create;

/**
 * Register strategy
 * @param  {Array}    dependList    Module dependence list
 * @param  {String}   strategyName  Register Module name
 * @param  {Function} constructor   Module constructor function
 */
function regStrategy(dependList,strategyName){
    try{
        let strategyArguments=Array.prototype.slice.call(arguments, 0);
        strategyArguments.unshift(this);
        let regStrategyObj=createStrategy.apply(null,strategyArguments);
        this['get'+tool.firstWordUpper(strategyName)]=regStrategyObj;
    }catch(err){
        this.emit('error',err);
    }
}
module.exports=regStrategy;