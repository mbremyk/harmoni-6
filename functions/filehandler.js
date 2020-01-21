const model = require('./model.js');
const Blob = require("cross-blob");
const fs = require("fs");
var FileReader = require('filereader');
const uuidv4 = require('uuid/v4');

const Cloud = require('@google-cloud/storage');
const path = require('path');
const serviceKey = path.join(__dirname, './fbcredential.json');
//const serviceKey = 'fbcredential.json';

const { Storage } = Cloud;
const storage = new Storage({
    keyFilename: serviceKey,
    projectId: 'harmoni-6',
});

const util = require('util');
const bucket = storage.bucket('harmoni-6.appspot.com');

const uploadToCloud = (base64String, filename ) => {
    let data = base64String.split(",", 2 );
    console.log("Setting buffer for"+filename);
    let buf = new Buffer.from(data[1], "base64");
    let newFileName = uuidv4() + filename;
    return uploadImage(buf, newFileName, data[0]).then(res => {
        console.log("Recieved from promise: "+res);
        return res;
    })
        .catch(err => console.log(err));
};

const uploadImage = (buffer, name, mimetype) => new Promise((resolve, reject) => {
    //const { originalname, buffer } = file;
    console.log(name);
    const blob = bucket.file(name.replace(/ /g, "_"));
    console.log("Setting stream2");
    console.log(mimetype);
    const blobStream = blob.createWriteStream({
        resumable: false
    });
    console.log("Stream set");
    blobStream.on('finish', () => {
        console.log("returning url");
        const publicUrl = util.format(
            `https://storage.googleapis.com/${bucket.name}/${blob.name}`
        );
        resolve(publicUrl)
    })
        .on('error',  function(err) {
            console.log(err);
            reject(`Unable to upload image, something went wrong`)
        })
        .end(buffer)
})




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

module.exports = {getContract, getRider, setRider, setContract, uploadToCloud};
    //new File(new Blob(["test"], {type : 'text'}), "test");
//setContract(new ArrayBuffer(8), 1, 1);
//data.append('file', new File(new Blob(["test"], {type : 'text'}), "test"));
//test();


