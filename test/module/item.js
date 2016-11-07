//Orc Item Module Test
'use strict';
const should = require('should');
module.exports=function(orcClient){
    let item=orcClient.getItem;
    describe('Item module', ()=>{
        it('Set/Update', done=>{
            item.update([
            {
                itemId:1,
                dId:1,
                point:0.5
            }
            ]).then(result=>{
                done();
            }).catch(e=>{
                done(e);
            })
        })
        it('Mulit set/update', done=>{
            item.update([
            {
                itemId:1,
                dId:1,
                point:-1.5
            },
            {
                itemId:1,
                dId:2,
                point:3
            },
            {
                itemId:1,
                dId:3,
                point:4
            }
            ]).then(result=>{
                done();
            }).catch(e=>{
                done(e);
            })
        })
        it('Get item', done=>{
            item.getItem(1).then(result=>{
                done(!(parseInt(result[0])===1&&parseFloat(result[1])===-1&&parseInt(result[2])===2&&parseFloat(result[3])===3&&parseInt(result[4])===3&&parseFloat(result[5])===4));
            }).catch(e=>{
                done(e);
            })
        })
        it('Get dimension', done=>{
            item.getDimension(1).then(result=>{
                done(!(parseInt(result[0])===1&&parseFloat(result[1])===-1));
            }).catch(e=>{
                done(e);
            })
        })
        it('Remove item dimension', done=>{
            item.removeItemDimension(1,1).then(result=>{
                done(!(parseInt(result[0][1])===1&&parseInt(result[1][1])===1));
            }).catch(e=>{
                done(e);
            })
        })
        it('Get new item', done=>{
            item.getItem(1).then(result=>{
                done(!(parseInt(result[0])===2&&parseFloat(result[1])===3&&parseInt(result[2])===3&&parseFloat(result[3])===4));
            }).catch(e=>{
                done(e);
            })
        })
        it('Get new dimension', done=>{
            item.getDimension(1).then(result=>{
                done(result.length!==0);
            }).catch(e=>{
                done(e);
            })
        })
        it('Set/Update wrong type', done=>{
            item.update(
            {
                itemId:1,
                dId:1,
                point:0.5
            }
            ).then(result=>{
                done('Should not over here');
            }).catch(e=>{
                done(!e);
                console.log('message:',e.message);
            })
        })
        it('Set/Update empty value', done=>{
            item.update([]).then(result=>{
                done('Should not over here');
            }).catch(e=>{
                done(!e);
                console.log('message:',e.message);
            })
        })
        it('Set/Update wrong value', done=>{
            item.update([{
                itemId:1,
                dId:1,
                point:'test'
            }]).then(result=>{
                done('Should not over here');
            }).catch(e=>{
                done(!e);
                console.log('message:',e.message);
            })
        })
        it('Set/Update value null', done=>{
            item.update([null]).then(result=>{
                done('Should not over here');
            }).catch(e=>{
                done(!e);
                console.log('message:',e.message);
            })
        })
        it('Get item without itemId', done=>{
            item.getItem().then(result=>{
                done('Should not over here');
            }).catch(e=>{
                done(!e);
                console.log('message:',e.message);
            })
        })
        it('Get dimension without dId', done=>{
            item.getDimension().then(result=>{
                done('Should not over here');
            }).catch(e=>{
                done(!e);
                console.log('message:',e.message);
            })
        })
        it('remove without itemId', done=>{
            item.removeItemDimension().then(result=>{
                done('Should not over here');
            }).catch(e=>{
                done(!e);
                console.log('message:',e.message);
            })
        })
        it('remove without dId', done=>{
            item.removeItemDimension(1).then(result=>{
                done('Should not over here');
            }).catch(e=>{
                done(!e);
                console.log('message:',e.message);
            })
        })
    })
}