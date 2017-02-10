//Default Module-Ranking
'use strict';
let dayTime=60*60*24; //One Day seconds
/**
 * Redis Dimension cache middleware
 * @param  {Object}   datas Redis result
 * @param  {Function} next  
 */
function redisDimensionCacheMiddleware(datas,next){
    let result=Object.create(null);
    datas.resultArray.forEach((dimension,index)=>{
        let dimensionCache=[];
        dimension[1].forEach((point,index)=>{
            if(index%2===1){
                dimensionCache.push({
                    'id':dimension[1][index-1],
                    'point':(Math.round(point*10000)/10000)
                });
            }
        });
        result[datas.nameArray[index]]=dimensionCache;
    });
    next(null,result);
}
/**
 * Redis cache middleware
 * @param  {Array}    datas Redis result array
 * @param  {Function} next  
 */
function redisCacheMiddleware(datas,next){
    let datasCache=datas.slice(0); //copy to cache
    datas=[];//reset datas
    datasCache.forEach((data,index)=>{
        if(index%2===1){
            datas.push({
                'id':datasCache[index-1],
                'point':(Math.round(data*10000)/10000)
            });
        }
    });
    next(null,datas);
}
/**
 * Redis Point Cache middleware
 * @param  {Number}   point point Array(gaussian Result, total item number, real count number, top point, bottom point)
 * @param  {Function} next  
 */
function redisPointCacheMiddleware(datas,next){
    let datasCache = datas.slice(1);
    let result = Math.round(datas[0]*10000)/10000;
    datasCache.unshift(result);
    next(null,datasCache);
}
function rankingModule(){}
rankingModule.prototype={
    init:function(){
        let error;
        let orcConfig=this.getConfig();
        let tools=this.getTools();
        if(!(orcConfig.dimensionWeight&&Array.isArray(orcConfig.dimensionWeight))) error=new Error('You must set config "dimensionWeight" when you use ranking module');
        if(!error&&orcConfig.rankingDimensionCache&&!(parseFloat(orcConfig.rankingDimensionCache)>0)) error=new Error('"rankingDimensionCache" must >0');
        if(!error&&orcConfig.rankingItemCache&&!(parseFloat(orcConfig.rankingItemCache)>0)) error=new Error('"rankingItemCache" must >0');
        if(!error&&orcConfig.rankingPointCache&&!(parseFloat(orcConfig.rankingPointCache)>0)) error=new Error('"rankingPointCache" must >0');
        if(!error&&orcConfig.rankingAvgPointCardinal&&!(parseFloat(orcConfig.rankingAvgPointCardinal)>0&&parseFloat(orcConfig.rankingAvgPointCardinal)<1)) error=new Error('"rankingAvgPointCardinal" must >0 && <1');
        if(!error&&orcConfig.rankingAvgPointMinNumber&&!(parseInt(orcConfig.rankingAvgPointMinNumber)>0)) error=new Error('"rankingAvgPointMinNumber" must >0');
        if(!error&&orcConfig.rankingAvgPointMaxNumber&&!(parseInt(orcConfig.rankingAvgPointMaxNumber)>10&&parseInt(orcConfig.rankingAvgPointMaxNumber)>=parseInt(orcConfig.rankingAvgPointMinNumber))) error=new Error('"rankingAvgPointMaxNumber" must >10 && >= "rankingAvgPointMinNumber"');
        if(!error){
            let valid=orcConfig.dimensionWeight.every(item=>{
                return tools.testStringArgument(item.name,3,20)&&!isNaN(item.weight);
            });
            if(!valid) error=new Error('"dimensionWeight" item must have name(word,3-20)&&weight(Number)');
        }
        if(error) throw error;
        this.config={
            dimensionWeight:orcConfig.dimensionWeight, //Dimension Weight const
            dimensionCache:parseFloat(orcConfig.rankingDimensionCache)||1, //Profile Dimension Type Cache(ranking/dimension:avg_point)
            itemCache:parseFloat(orcConfig.rankingItemCache)||1, //Item Recommend Cache(ranking/dimension:avg_point)
            pointCache:parseFloat(orcConfig.rankingPointCache)||1, //Item Recommend Point Cache(ranking/item:point)
            avgPointCardinal:parseFloat(orcConfig.rankingAvgPointCardinal)||0.2, //avg item point cardinal
            avgPointMinNumber:parseInt(orcConfig.rankingAvgPointMinNumber)||10, //avg item min number
            avgPointMaxNumber:parseInt(orcConfig.rankingAvgPointMaxNumber)||100 //avg item max number
        };
        //Handle Ranking Dimension Cache result
        this.use('rankingDimension',redisDimensionCacheMiddleware);
        this.use('rankingItemList',redisCacheMiddleware);
        this.use('rankingItemPoint',redisPointCacheMiddleware);
    },
    /**
     * Set Profile Dimension Type Cache
     * @param  {String} userId User ID
     * @return {Object}        Promise object
     */
    setDimensionCache:function(userId){
        let profileModule = this.getDependModule('profile');
        let itemModule = this.getDependModule('item');
        let redisClient = this.getRedisClient();
        let EXPIRE_TIME = this.config.dimensionCache*dayTime;
        return profileModule.get(userId).then(result=>{
            if(result.length>0){
                let redisPipeline=redisClient.pipeline();
                result.forEach((userPoint,index)=>{
                    //Get profile item point
                    if(index%2===1){
                        let itemId=result[index-1];
                        let weight=userPoint; //union weight
                        //Union with item point in pipeline
                        this.config.dimensionWeight.forEach((dimensionType)=>{
                            let redisKey = this.getRedisKey(userId+':dimension:'+dimensionType.name);
                            let itemRedisKey = itemModule.getRedisKey('item:'+dimensionType.name+':'+itemId);
                            redisPipeline.zunionstore(redisKey,2,redisKey,itemRedisKey,'WEIGHTS',1,weight);
                        });
                    }
                });
                let avgWeight=Math.round(20000/result.length)/10000; //weight 4 decimal places
                this.config.dimensionWeight.forEach(dimensionType=>{
                    let redisKey = this.getRedisKey(userId+':dimension:'+dimensionType.name);
                    redisPipeline.zunionstore(redisKey,1,redisKey,'WEIGHTS',avgWeight);
                    redisPipeline.expire(redisKey,EXPIRE_TIME);
                });
                return redisPipeline.exec();
            }else{
                let nextPromise = this.getTools().nextPromise;
                return nextPromise(null,[]);
            }
        });
    },
    /**
     * Get Profile Dimension Type Cache. if not exist, use setDimensionCache.
     * @param  {String} userId User ID
     * @return {Object}        Promise object
     */
    getDimensionCache:function(userId){
        let error;
        if(!userId){
            error=new Error('You must set "userId" when use ranking:getDimensionCache');
        }
        if(error){
            return new Promise((resolve,reject)=>{
                reject(error);
            });
        }
        let redisClient = this.getRedisClient();
        let redisTestKey = this.getRedisKey(userId+':dimension:'+this.config.dimensionWeight[0].name);
        let dimensionNameCache = [];
        return redisClient.exists(redisTestKey).then(result=>{ //Confirm redis key
            //if not exists this key
            if(parseInt(result)===0){ //Set cache
                return this.setDimensionCache(userId);
            }else{ //Continue
                let nextPromise = this.getTools().nextPromise;
                return nextPromise(null,[]);
            }
        }).then(()=>{ //Get all dimension
            let redisPipeline=redisClient.pipeline();
            this.config.dimensionWeight.forEach(dimensionType=>{
                let redisKey=this.getRedisKey(userId+':dimension:'+dimensionType.name);
                dimensionNameCache.push(dimensionType.name);
                redisPipeline.zrevrange(redisKey,0,-1,'WITHSCORES');
            });
            return redisPipeline.exec();
        }).then(cacheResult=>{
            return this.getMiddlewares('rankingDimension',{
                nameArray:dimensionNameCache,
                resultArray:cacheResult
            });
        });
    },
    /**
     * Set Item Recommend Cache
     * @param  {String} userId User ID
     * @return {Object}        Promise object
     */
    setItemRecommendCache(userId){
        let itemModule = this.getDependModule('item');
        let redisClient = this.getRedisClient();
        let EXPIRE_TIME = this.config.itemCache*dayTime;
        return this.getDimensionCache(userId).then(dimensionCache=>{
            let redisPipeline = redisClient.pipeline();
            let redisKey = this.getRedisKey(userId+':itemList');
            this.config.dimensionWeight.forEach(dimensionType=>{
                let dimensionTypeList=dimensionCache[dimensionType.name];
                dimensionTypeList.forEach(dimensionItem=>{
                    let redisDimensionKey = itemModule.getRedisKey('dimension:'+dimensionType.name+':'+dimensionItem.id);
                    let weight = dimensionItem.point * dimensionType.weight;
                    redisPipeline.zunionstore(redisKey,2,redisKey,redisDimensionKey,'WEIGHTS',1,weight);
                });
            });
            redisPipeline.expire(redisKey,EXPIRE_TIME);
            return redisPipeline.exec();
        });
    },
    /**
     * Get Item Recommend Cache
     * @param  {String} userId User ID
     * @param  {Number} top    Top result,>0 desc,<0 asc
     * @return {Object}        Promise object
     */
    getItemRecommendCache(userId,top){
        let error;
        top = parseInt(top);
        if(!userId){
            error=new Error('You must set "userId" when use ranking:getItemRecommendCache');
        }
        if(!error&&top===0){
            error=new Error('"top" must unequal to 0 when use ranking:getItemRecommendCache');
        }
        if(error){
            return new Promise((resolve,reject)=>{
                reject(error);
            });
        }
        let redisClient = this.getRedisClient();
        let redisKey = this.getRedisKey(userId+':itemList');
        return redisClient.exists(redisKey).then(result=>{ //Confirm redis key
            //if not exists this key
            if(parseInt(result)===0){ //Set cache
                return this.setItemRecommendCache(userId);
            }else{ //Continue
                let nextPromise = this.getTools().nextPromise;
                return nextPromise(null,[]);
            }
        }).then(()=>{ //Get all dimension
            if(!top){
                return redisClient.zrevrange(redisKey,0,-1,'WITHSCORES');
            }else if(top>0){
                return redisClient.zrevrange(redisKey,0,top-1,'WITHSCORES');
            }else{
                return redisClient.zrange(redisKey,0,-(top+1),'WITHSCORES');
            }
        }).then(cacheResult=>{
            return this.getMiddlewares('rankingItemList',cacheResult);
        });
    },
    setItemPoint(userId,itemId){
        let redisClient = this.getRedisClient();
        let EXPIRE_TIME = this.config.pointCache*dayTime;
        let redisitemListKey = this.getRedisKey(userId+':itemList');
        let topPoint = 0;
        let nextPromise = this.getTools().nextPromise;
        return this.getItemRecommendCache(userId,1).then(result=>{//Get list count
            if(result.length===0){ //if empty
                return nextPromise(null,0);
            }
            topPoint = result[0].point;
            return redisClient.zcard(redisitemListKey);
        }).then(itemCount=>{//Get List
            if(itemCount===0) return nextPromise(null,0);
            let topNumber = Math.round(parseInt(itemCount)*this.config.avgPointCardinal);
            topNumber = topNumber>this.config.avgPointMinNumber?topNumber:this.config.avgPointMinNumber;
            topNumber = topNumber<this.config.avgPointMaxNumber?topNumber:this.config.avgPointMaxNumber;
            return Promise.all([redisClient.zscore(redisitemListKey,itemId),this.getItemRecommendCache(userId,-topNumber)]).then(result=>{//Get avg item,cur item
                let gaussianFunc = this.getTools().gaussian;
                let dist = Math.round(result[0]*10000)/10000;
                if(dist===0) return nextPromise(null,[0]);
                let bottomPoint = result[1][0].point;
                //Get true standard deviation
                let totalPoint = 0;
                result[1].forEach(itemPoint=>{
                    totalPoint+=itemPoint.point;
                });
                let avgPoint = Math.round(totalPoint/result[1].length*10000)/10000;
                //Create Middleware: gaussian Result, total item number, real count number, top point, bottom point;
                return this.getMiddlewares('rankingItemPoint',[gaussianFunc(dist,avgPoint),itemCount,topNumber,topPoint,bottomPoint]);
            }).then(result=>{//Save key cache
                let point = result[0];
                let redisPipeline = redisClient.pipeline();
                let redisKey = this.getRedisKey(userId+':itemPoint:'+itemId);
                return redisPipeline.set(redisKey,point).expire(redisKey,EXPIRE_TIME).exec().then(()=>{
                    return nextPromise(null,point);
                });
            });
        });
    },
    getItemPoint(userId,itemId){
        let error;
        if(!userId){
            error=new Error('You must set "userId" when use ranking:getItemPoint');
        }
        if(!error&&!itemId){
            error=new Error('You must set "itemId" when use ranking:getItemPoint');
        }
        if(error){
            return new Promise((resolve,reject)=>{
                reject(error);
            });
        }
        let redisClient = this.getRedisClient();
        let redisKey = this.getRedisKey(userId+':itemPoint:'+itemId);
        return redisClient.get(redisKey).then(result=>{ //Confirm redis key
            if(result===null){ //Set cache
                return this.setItemPoint(userId,itemId);
            }else{
                let nextPromise = this.getTools().nextPromise;
                return nextPromise(null,parseFloat(result));
            }
        });
    }
};
module.exports=rankingModule;