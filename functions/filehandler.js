const model = require('./model.js');
const testData = require('./Tests/testData.js');
const Blob = require("cross-blob");

let GigModel = model.GigModel;

const testString = {hello: "world"};
const testBlob = new Blob([JSON.stringify(testString, null, 2)], {type : 'application/json'});

function setContract(dataBlob, gig, artist) {
    GigModel.findOne({where:{concertId: gig, artistId: artist } })
        .then(gig => {
            gig.update({contract: datablob});
        });
}

function getContract(concert){
    GigModel.findOne({where:{concertId: gig, artistId: artist }})
        .then(gig => {
            return gig.contract;
        });
}

function setRider(dataBlob, gig, artist){
    GigModel.findOne({where:{concertId: gig, artistId: artist }})
        .then(gig => {
            gig.update({rider: datablob});
        });
}

function getRider(gig){
    GigModel.findOne({where:{concertId: gig, artistId: artist }})
        .then(gig => {
            return gig.rider;
        });
}

function test() {
    testData.syncTestData().then(() => {
        setContract(testBlob, 1, 1);
        setRider(testBlob, 1, 1);
        }
    );
}

test();

