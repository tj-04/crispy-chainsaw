'use strict';

const ax = require('axios');
const iM = require('../models/implio');
const formidable = require('formidable');

async function createPost(req, res) {
    const form = formidable({ multiples: true });
    // console.log('data ', req);
    // const a1 = await form.parse(req);
    // console.log('A1 ', a1.openedFiles);
    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.log('err ', err);
            res.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain' });
            res.end(String(err));
            return;
        }
        const totalFields = Object.keys(fields).length;
        const totalFiles = Object.keys(files).length;
        /*
        TODO: 
        What are mandatory?
        Id - (post id or story id),
        User[id]
        */

        const id = fields ? (fields.hasOwnProperty('id')) : false;
        const user_id = (fields.user) ? ((fields.user).hasOwnProperty('id')) : false;
        
        if (totalFields > 0 && id && user_id) {
            if (totalFiles > 0) {
                const implioDataObject = [];
                implioDataObject.push(fields);

                const isIterable = (value) => {
                    return Symbol.iterator in Object(value);
                }

                  if (isIterable(files.images)) {
                    implioDataObject[0]['content'].images = getSrc(files.images);
                  } else {
                    implioDataObject[0]['content'].images = [{'src': files.images.filepath}];
                  }

                  if (isIterable(files.videos)) {
                    implioDataObject[0]['content'].videos = getSrc(files.videos);
                  } else {
                    implioDataObject[0]['content'].videos = [{'src': files.videos.filepath}];
                  }

                // console.log('23 ', implioDataObject);
                const responseFromImplio = await callImplioApi(implioDataObject)
                console.log('res ', responseFromImplio);
                res.writeHead(200, { 'Content-Type': 'applicaiton/json' });
                res.end(JSON.stringify({ message: 'Needs development - Images and Videos - Prepare data object', fields, files, response: responseFromImplio }));
            } else {
                const implioDataObject = [fields];
                const responseFromImplio = await callImplioApi(implioDataObject)
                console.log('res ', responseFromImplio);
                // TODO: store the response in database
                res.writeHead(200, { 'Content-Type': 'applicaiton/json' });
                res.end(JSON.stringify({ message: 'Needs development - Only text - Prepare data object for implio', fields, files, response: responseFromImplio }));
            }
        } else {
            res.writeHead(200, { 'Content-Type': 'applicaiton/json' });
            res.end(JSON.stringify({ message: 'Id and User id are mandatory. One or more fields are missing please check you payload' }));
        }
    });
    return;
}

function getSrc(obj) {
    const dataArr = [];
    for (const rec of obj) {
        const src = rec.filepath;
        dataArr.push({ 'src': src });
    }

    return dataArr;
}

async function callImplioApi(data) {
    let finalResponse;
    // console.log('data ', data)
    try {
        const apiResponse = await ax({
            method: 'POST',
            url: 'https://api.implio.com/v1/ads',
            data: data,
            headers: {
                'X-Api-Key': 'be851f662fe1adacc0d9263cb0f9a06d28bafe87ac4fc8e925ad1732406ac123',
                'Content-Type': 'application/json'
            }
        })
        console.log('apiResponse ', apiResponse.data.rejected[0]);
        console.log('apiResponse 1 ', apiResponse.data.rejected[0].originalAd);
        console.log('apiResponse 2', apiResponse.data.rejected[0].errors);
        finalResponse = apiResponse.data;
    } catch (err) {
        console.log('err ', err);
        finalResponse = err;
    }
    return finalResponse;
}

module.exports = { createPost };