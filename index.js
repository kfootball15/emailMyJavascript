'use strict';
const fs = require('fs');
const path = require("path");
const chalk = require("chalk");
const stat = require('fs').statSync;
const AdmZip = require('adm-zip'); //https://github.com/cthackers/adm-zip/wiki/
const nodemailer = require('nodemailer'); //https://nodemailer.com/about/









// https://github.com/yargs/yargs/blob/HEAD/docs/examples.md
const argv = require('yargs')
	// How to use the command:
	.usage('Usage: $0 [send/detext] -e [email] -p [password] --t [email text] --m [email message] --et [example1@gmail.com] --srv [Email Service] --src [optional source directory, default=current] --dst [optional destination directory, default=downloads]')
    // An Example Command:
    .example('$0 send fenster.js@gmail.com src /Users/jeff/Documents dst /Users/jeff/downloads')
    .demandOption(['e', 'p'])
    // Set booleans for whether this a send or detext/download command
    .boolean('send') //send
    .boolean('detext')
    // Type for password
    .string('p')
    // Defaults:
    .default('send', true)
    .default('srv', 'gmail')
    .default('s', 'Project From EmailMyJavascript')
    .default('t', '')
    .default('src', path.join(__dirname))
    .default('dst', path.join('/Users', process.env.USER, 'downloads'))
	.argv

const source = argv.src;
const destination = argv.dst;
const date = Date.parse(new Date);
const emailFrom = argv.e;
const emailsTo = argv.to ? argv.to.split(',').map((email)=>{return email.trim()}).join(', ') : emailFrom; //String of emails to array
const password = argv.p;
const emailService = argv.srv;

console.log(emailFrom, emailsTo, argv.et, password)

if(argv.send) { // If user enters 'send' command, we want to copy files and send them
	//Synchronously Read Files
	const files = fs.readdirSync(source); //Reads through directory files

	// Create a new folder called 'root' inside the destination directory
	const rootname = "root";
	const rootFolder = `${destination}/${rootname}-${date}`;
	const zipTitle = `${rootname}-${date}.zip`;

	copyFilesToText(files, source, rootFolder) //Copys all files and folders with .txt properly applied
	.then(()=>{
		newArchive(zipTitle, rootFolder);
		// Generate test SMTP service account from ethereal.email
		// Only needed if you don't have a real mail account for testing
		// nodemailer.createTestAccount((err, account) => {


		    // create reusable transporter object using the default SMTP transport
			let transporter = nodemailer.createTransport({
			  service: emailService,
			  auth: {
			    user: emailFrom,
			    pass: password
			  }
			});


		    // setup email data with unicode symbols
		    let mailOptions = {
		        from: `<${emailFrom}>`, // sender address
		        to: emailsTo, // list of receivers
		        subject: argv.s, // Subject line
		        text: argv.t, // plain text body
		        html: '', // html body
			    attachments: [
			        {   // file on disk as an attachment
			            filename: 'project.zip',
			            path: `${source}/${zipTitle}` // stream this file
			        }
			    ]
		    };

		    // send mail with defined transport object
		    transporter.sendMail(mailOptions, (error, info) => {
		        if (error) {
		        	console.log(chalk.red("If you are using gmail, you may have to allow access for less secture apps"))
		        	console.log(chalk.red("Navigate here: https://myaccount.google.com/lesssecureapps"))
		            return console.log(error);
		        }
		        console.log('Message sent: %s', info.messageId);
		        // Preview only available when sending through an Ethereal account
		        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

		        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
		        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
		    });


		// });

	})
	.catch((errorMessage)=>{
		console.log(chalk.red(errorMessage));
	})
}

function copyFilesToText (files, source, destination) {
	
	var promise = new Promise((resolve, reject)=>{
		
		//Attempt to create directory 
		try {
			fs.mkdirSync(destination)
			console.log(chalk.blue(`Directory ${destination} was created successfully`));
		} catch (err) {
			console.error(chalk.red("Error creating directory. Aborting. Make sure destination directory does not already exist:", err));
			return;
		}
			
		//Error handling
		if (!destination) {
			console.log(chalk.red(`Directory ${destination} already exists, please clean folder and try again.`));
			reject(`Directory ${destination} already exists, please clean folder and try again.`);
			return console.log(err);
		} 


		//Checks if each file is a file or folder, and handles accordingly
		files.forEach((file)=>{ 
			let filePath = `${source}/${file}`;
			let stats = fs.lstatSync(filePath)

		    //Error handling
		    if(!stats) return console.log(chalk.red("Error reading if Folder:", err));

		    //Check if current file is a directory or a file
			if (stats.isDirectory()) {
				if ( file.indexOf('node_modules') <= -1){ //Avoids copying the node_modules folder contents
					let folderContents = fs.readdirSync(filePath)
					let folderName = file;
					copyFilesToText(folderContents, filePath, `${destination}/${folderName}`); //If its a folder, we recursively call this function
				}
			} else {

				//We only want to append .txt if its a JS file
				let finalDestination = file.split('.').indexOf('js') > -1 ? `${destination}/${file}.txt` : `${destination}/${file}`; 
				
				//Attempt to copy file
				if(file.indexOf('.zip') <= -1){
					try {
						fs.copyFileSync(`${source}/${file}`, finalDestination);
						console.log(chalk.green(`${file} was copied to ${file}.txt`));
					} catch (err) {
						console.error(chalk.red("Error creating file:", error));
					}
				}

			}

		})

		resolve();

	})

	return promise;
}

function newArchive(zipFileName, pathNames) {

	console.log("newArchive zip", zipFileName, "Path Names", pathNames)

    const zip = new AdmZip();
    zip.addLocalFolder(pathNames);

    zip.writeZip(zipFileName);

}








