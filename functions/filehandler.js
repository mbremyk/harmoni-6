const model = require('./model.js');
const Blob = require("cross-blob");
const fs = require("fs");
var FileReader = require('filereader');

//Todo: Convert and serve images to base64
//Todo: Set read/write access in db
//Todo: check read/write how?


function setContract(path, gig, artist) {

}

function getContract(concert){
}

function setRider(path, gig, artist){

}

function getRider(gig){

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
   // console.log(testBlob);*/

    setContract(testString, 1, 1);
    setRider(testString, 1, 1);

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
//setContract(new ArrayBuffer(8), 1, 1);
//data.append('file', new File(new Blob(["test"], {type : 'text'}), "test"));
//test();


