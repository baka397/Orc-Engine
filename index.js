//Main orc
'use strict';
const util = require('util');
const EventEmitter = require('events').EventEmitter;
const tool = require('./lib/common/tool');
const redis = require('./lib/common/redis');
const middlewareFuncs = require('./lib/middleware/');
const moduleFuncs = require('./lib/module/');
const strategyFuncs = require('./lib/strategy/');
//Create Orc Constructor
function Orc(config){
    config=config||{};
    EventEmitter.call(this);
    this._init(config);
    this._initDefaultModules();
}
util.inherits(Orc, EventEmitter);
//init Orc settings
Orc.prototype._init=function(config){
    const baseConfig={
        name:'orc' //Instance name,for mulit Instance
    };
    if(config.name&&!tool.testStringArgument(config.name,3,20)){
        throw new Error('The config.name must be 3-20 words/number');
    }
    this.config=Object.assign({},baseConfig,config);
    if(config.redis) this.config.redis=Object.assign({},config.redis);
    //Init redis client
    this.redis=redis(this.config.redis);
    //Add middleware function list
    this._middleware={
        profile:[],
        ranking:[]
    };
    this._module={};
    this.orcTools=tool; //get default orc tool function
};
//Apply methods
tool.applyMethods(Orc,middlewareFuncs,moduleFuncs,strategyFuncs);
module.exports = Orc;