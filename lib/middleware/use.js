//Use middleware
'use strict';
const tool = require('../common/tool');
/**
 * Add a middleware function to instance function list by name
 * @param  {String}   name  Instance function name, for now: profile,ranking,recommender(Recommender Module name)
 * @param  {Function} func  Middleware function
 */
function useMiddleware(name,func){
    if(typeof name!=='string'||typeof func!=='function'){
        throw new Error('Wrong middleware arguments');
    }
    if(!tool.testStringArgument(name,3,20)){
        throw new Error('The middleware name must be 3-20 words/number');
    }
    if(!this._middleware[name]){
        this._middleware[name]=[func];
    }else{
        this._middleware[name].push(func);
    }
}
module.exports=useMiddleware;