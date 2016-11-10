//Default Module-Ranking
'use strict';
function rankingModule(){}
rankingModule.prototype={
    init:function(){
        let orcConfig=this.getConfig();
        this.config={
            cache:orcConfig.rankingCache||1 //Ranking cache time
        }
    }
}
module.exports=rankingModule;