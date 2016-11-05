//Orc Middleware Test
'use strict';
const should = require('should');
module.exports=function(orcClient){
    let profile=orcClient.getProfile;
    describe('Profile module', ()=>{
        it('Set/Update', done=>{
            profile.update([
            {
                userId:1,
                itemId:1,
                point:3.5
            }
            ]).then(result=>{
                done();
            }).catch(e=>{
                done(e);
            })
        })
        it('Set/Update mulit', done=>{
            profile.update([
            {
                userId:1,
                itemId:1,
                point:3
            },
            {
                userId:1,
                itemId:2,
                point:-1
            },
            {
                userId:1,
                itemId:3,
                point:10
            }
            ]).then(result=>{
                done();
            }).catch(e=>{
                done(e);
            })
        })
        it('Get', done=>{
            profile.get(1).then(result=>{
                done(!(parseInt(result[0])===2&&parseFloat(result[1])===-1&&parseInt(result[2])===1&&parseFloat(result[3])===6.5&&parseInt(result[4])===3&&parseFloat(result[5])===10));
            }).catch(e=>{
                done(e);
            })
        })
        it('Remove', done=>{
            profile.remove(1,2,3).then(result=>{
                done(parseInt(result)!==2);
            }).catch(e=>{
                done(e);
            })
        })
        it('Get new Data', done=>{
            profile.get(1).then(result=>{
                done(!(parseInt(result[0])===1&&parseFloat(result[1])===6.5));
            }).catch(e=>{
                done(e);
            })
        })
        it('Clear', done=>{
            profile.clear(1).then(result=>{
                done(parseInt(result)!==1);
            }).catch(e=>{
                done(e);
            })
        })
        it('Get clear Data', done=>{
            profile.get(1).then(result=>{
                done(result.length!==0);
            }).catch(e=>{
                done(e);
            })
        })
        it('Set/Update wrong type', done=>{
            profile.update(
            {
                userId:1,
                itemId:1,
                point:3.5
            }
            ).then(result=>{
                done('Should not over here');
            }).catch(e=>{
                done(!e);
                console.log('message:',e.message);
            })
        })
        it('Set/Update empty value', done=>{
            profile.update([]).then(result=>{
                done('Should not over here');
            }).catch(e=>{
                done(!e);
                console.log('message:',e.message);
            })
        })
        it('Set/Update wrong value', done=>{
            profile.update([{
                userId:1,
                itemId:1,
                point:'test'
            }]).then(result=>{
                done('Should not over here');
            }).catch(e=>{
                done(!e);
                console.log('message:',e.message);
            })
        })
        it('Set/Update value null', done=>{
            profile.update([null]).then(result=>{
                done('Should not over here');
            }).catch(e=>{
                done(!e);
                console.log('message:',e.message);
            })
        })
        it('remove without userId', done=>{
            profile.remove().then(result=>{
                done('Should not over here');
            }).catch(e=>{
                done(!e);
                console.log('message:',e.message);
            })
        })
        it('remove without itemId', done=>{
            profile.remove(1).then(result=>{
                done('Should not over here');
            }).catch(e=>{
                done(!e);
                console.log('message:',e.message);
            })
        })
    })
}