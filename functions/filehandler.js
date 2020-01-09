const model = require('./model.js');
const testData = require('./tests/testData.js');
const Blob = require("cross-blob");

let GigModel = model.GigModel;

const testString = {hello: "world"};
const testBlob = new Blob([JSON.stringify(testString, null, 2)], {type : 'application/json'});

function setContract(dataBlob, gig) {
    GigModel.findOne({where:{gigId: gig } })
        .then(gig => {
            gig.update({contract: datablob});
        });
}

function getContract(concert){

}

function setRider(dataBlob, gig){
    GigModel.findOne({where:{gigId: gig } })
        .then(gig => {
            gig.update({rider: datablob});
        });
}

function getRider(gig){

}

function test() {
    testData.syncTestData().then(() => {
        setContract(testBlob, 1);
        setRider(testBlob, 1);
        }
    );
}

test();

