const promisify = require('es6-promisify');
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const juice = require('juice');
const htmlToText = require('html-to-text');
const emailTemplate = require('./views/email.ejs');

require('dotenv').config({ path: 'process.env' });

const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});



exports.send =  async (options) => {
   
    transport.sendMail(options, (error, info) => {

        if (error) {
            return console.log(error);
        }
    })
}