'use strict';
const util = require('util');
const EventEmitter = require('events').EventEmitter;
const tool = require('./lib/common/tool');
const redis = require('./lib/common/redis');
const middlewareFuncs = require('./lib/middleware/');
const moduleFuncs = require('./lib/module/');
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
        name:'orc', //Instance name,for mulit Instance
        rankingCache:1, //"Dimension Ranking System" cache time(Day)
        resultCache:1 //"Recommender Module" result cache time(Day)
    };
    if(config.name&&!tool.testStringArgument(config.name,3,20)){
        throw new Error('The config.name must be 3-20 words/number');
    }
    if(config.rankingCache&&!parseFloat(config.rankingCache)>0){
        throw new Error('The config.rankingCache must be right number');
    }
    if(config.resultCache&&!parseFloat(config.resultCache)>0){
        throw new Error('The config.resultCache must be right number');
    }
    this.config=Object.assign({},baseConfig,config);
    if(config.redis) this.config.redis=Object.assign({},config.redis)
    //Init redis client
    this.redis=redis(this.config.redis);
    //Add middleware function list
    this._middleware={
        profile:[],
        ranking:[]
    }
    this._module={};
}
//Apply methods
tool.applyMethods(Orc,middlewareFuncs,moduleFuncs);
module.exports = Orc;