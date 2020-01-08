import { GigModel } from "./model.js"

const testString = {hello: "world"};
const testBlob = new Blob([JSON.stringify(testString, null, 2)], {type : 'application/json'});

export function setContract(dataBlob, gig) {
    GigModel.findOne({where:{gigId: gig } })
        .then(gig => {
            gig.update({contract: datablob});
        });
}

export function getContract(concert){

}

export function setRider(dataBlob, gig){
    GigModel.findOne({where:{gigId: gig } })
        .then(gig => {
            gig.update({rider: datablob});
        });
}

export function getRider(gig){

}

function test() {
    setContract(testBlob, 1);
    setRider(testBlob, 1);
}

