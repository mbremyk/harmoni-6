const model = require('./model.js');
const Blob = require("cross-blob");
const fs = require("fs");
var FileReader = require('filereader');
//import { base64StringToBlob } from 'blob-util';
//const testfile = "test.txt"
const testString = "test";
/*const contentType = 'image/png';
const b64Data = 'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';*/
let GigModel = model.GigModel;
//const blob = base64StringToBlob(b64Data, contentType);

function setContract(dataBlob, gig, artist) {
    /*console.log("Uploading: ");*/
    console.log("Data: "+new ArrayBuffer(dataBlob));
    model.GigModel.findOne({where:{eventId: gig, artistId: artist } })
        .then(gig => {
            console.log("updating: ");
            gig.update({contract: dataBlob});
        });
    console.log("upload done");

    model.GigModel.findOne({where:{eventId: 1, artistId: 1 }})
        .then(gig => {
                //console.log(gig.rider);
                console.log(gig.contract);
                let reader = new FileReader();

                reader.onload = function() {
                    console.log(reader.result);
                }
                console.log(gig.rider.toString());

            }
        );


}

function getContract(concert){
    GigModel.findOne({where:{eventId: gig, artistId: artist }})
        .then(gig => {
            return gig.contract;
        });
}

function setRider(dataBlob, gig, artist){
    GigModel.findOne({where:{eventId: gig, artistId: artist }})
        .then(gig => {
            gig.update({rider: dataBlob});
        });
}

function getRider(gig){
    GigModel.findOne({where:{eventId: gig, artistId: artist }})
        .then(gig => {
            return gig.rider;
        });
}

function test() {
    console.log("running test");
   // model.syncModels();
   /*model.syncTestData().then(() => {
        /*setContract(testBlob, 1, 1);
        setRider(testBlob, 1, 1);
        }
    );
    //let testBlob = fs.readFileSync(testfile, 'utf8');
   // console.log(testBlob);

    setContract(testString, 1, 1);*/
    //setRider(testString, 1, 1);

    GigModel.findOne({where:{eventId: 1, artistId: 1 }})
        .then(gig => {
            //console.log(gig.rider);
            console.log(gig.contract);
            let reader = new FileReader();

            reader.onload = function() {
                console.log(reader.result);
            }
            console.log("result: "+gig.contract.toString());

        }
    );

}

module.exports = {getContract, getRider, setRider, setContract};
    //new File(new Blob(["test"], {type : 'text'}), "test");
setContract(new ArrayBuffer(8), 1, 1);
//data.append('file', new File(new Blob(["test"], {type : 'text'}), "test"));
test();


