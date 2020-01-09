const model = require('./model.js');
const Blob = require("cross-blob");
const fs = require("fs");
var FileReader = require('filereader');
import { base64StringToBlob } from 'blob-util';

let GigModel = model.GigModel;
//const testfile = "test.txt"
const testString = "test";
//const testBlob = new Blob(["testtest"], {type : 'text'});
const contentType = 'image/png';
const b64Data = 'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';

const blob = base64StringToBlob(b64Data, contentType);

function setContract(dataBlob, gig, artist) {
    console.log(dataBlob);
    GigModel.findOne({where:{concertId: gig, artistId: artist } })
        .then(gig => {
            gig.update({contract: dataBlob});
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
            gig.update({rider: dataBlob});
        });
}

function getRider(gig){
    GigModel.findOne({where:{concertId: gig, artistId: artist }})
        .then(gig => {
            return gig.rider;
        });
}

function test() {
   // model.syncModels();
   /*model.syncTestData().then(() => {
        setContract(testBlob, 1, 1);
        setRider(testBlob, 1, 1);
        }
    );*/
    //let testBlob = fs.readFileSync(testfile, 'utf8');
   // console.log(testBlob);

    setContract(testString, 1, 1);
    setRider(testString, 1, 1);

    GigModel.findOne({where:{concertId: 1, artistId: 1 }})
        .then(gig => {
            //console.log(gig.rider);
            console.log(gig.rider);
            let reader = new FileReader();

            reader.onload = function() {
                console.log(reader.result);
            }
            console.log(gig.rider.toString());

        }
    );

}

module.exports = {getContract, getRider, setRider, setContract};
//test();

