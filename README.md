# Email My Javascript

## Basic Description:

Node Script that allows you to email Javascript files to yourself by appending and stripping .txt to JS files extensions

### Instructions
SEND: 
```
$0 [send/detext] -e [email] -p [password] --s [email subject] --t [email text] --et [example1@gmail.com] --srv [Email Service] --src [optional source directory, default=current] --dst [optional destination directory, default=downloads]')

-e   --> From Email (required)
-p   --> From Emails password (required)
-s   --> Email Subject [default: Project From EmailMyJavascript]
-t   --> Email Body Text [default: '']
-et  --> Emails to send to [default: -e ]
-srv --> Email Sevice [default: 'gmail']
-src --> Source Directory of Project
-dst --> Destination of copied files 


node index.js send -e fenster.js -p password --et example1@gmail.com,example2@gmail.com -srv "gmail"
```
DL 
```
NOT YET AVAILABLE
node index.js detext <required source [default=current directory]> <optional destination [default=downloads]>
```


