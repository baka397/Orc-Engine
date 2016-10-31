'use strict';
const tool = require('./lib/common/tool');
const redis = require('./lib/common/redis');
const middleware = require('./lib/middlewares/');
function Orc(option){
    option=option||{};
    this._init(option);
}
//init Orc settings
Orc.prototype._init=function(option){
    const baseOption={
        name:'orc', //Instance name,for mulit Instance
        rankingCache:1, //"Dimension Ranking System" cache time(Day)
        resultCache:1 //"Recommender Module" result cache time(Day)
    };
    this.config=Object.assign({},baseOption,option);
    if(option.redis) this.config.redis=Object.assign({},option.redis)
    //Init redis client
    this.redis=redis(this.config.redis);
    //Add middleware function list
    this._middleware={
        profile:[],
        ranking:[]
    }
}
//Apply methods
tool.applyMethods(Orc,middleware);
module.exports = Orc;