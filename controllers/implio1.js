'use strict';

const ax = require('axios');
const iM = require('../models/implio');
const formidable = require('formidable');

async function createPost(req, res) {
    const form = formidable({ multiples: true });
    
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
            const {id, content, user, videos, images} = fields;
            const implioDataObject = [{
                id,
                content: {
                    body: content.body,
                    images: JSON.parse(images),
                    videos: JSON.parse(videos),
                },
                user,
            }];
            console.log('im ', implioDataObject);
            const responseFromImplio = await callImplioApi(implioDataObject)
            console.log('res ', responseFromImplio);
            // TODO: store the response in database
            res.writeHead(200, { 'Content-Type': 'applicaiton/json' });
            res.end(JSON.stringify({ message: 'Needs development - Only text - Prepare data object for implio', fields, files , d: implioDataObject}));

        } else {
            res.writeHead(200, { 'Content-Type': 'applicaiton/json' });
            res.end(JSON.stringify({ message: 'Id and User id are mandatory. One or more fields are missing please check you payload' }));
        }
    });
    return;
}

async function callImplioApi(data) {
    let finalResponse;
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
        finalResponse = apiResponse.data;
    } catch (err) {
        console.log('err ', err);
        finalResponse = err;
    }
    return finalResponse;
}

module.exports = { createPost };