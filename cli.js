#!/usr/bin/env node

import moment from 'moment-timezone';
import fetch from 'node-fetch';
import minimist from 'minimist';

// Grab provided args.
//const [,, ... args] = process.argv


const args  = minimist(process.argv.slice(2));
//console.log(args)
if (args.h){
    let help_text = `Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
    -h            Show this help message and exit.
    -n, -s        Latitude: N positive; S negative.
    -e, -w        Longitude: E positive; W negative.
    -z            Time zone: uses tz.guess() from moment-timezone by default.
    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
    -j            Echo pretty JSON from open-meteo API and exit.`
    console.log(help_text);
    process.exit();


    }


var lat=0;
if (args.n && args.s){console.log('Cannot specify LATITUDE twice')}
else if (args.n){ lat = Math.round(args.n*100)/100}
else if (args.s){ lat = -Math.round(args.s*100)/100}
else{console.log('ERROR: Must specify both LATITUDE and LONGITUDE.')
    process.exit(1);}


var lon=0;
if (args.w && args.e){console.log('Cannot specify LONGITUDE twice')}
else if (args.e){lon = Math.round(args.e*100)/100}
else if (args.w){lon = -Math.round(args.w*100)/100}
else{console.log('ERROR: Must specify both LATITUDE and LONGITUDE.')
 process.exit(1);}

var timezone;
if (args.z){
    timezone = args.z;
} else {timezone = moment.tz.guess()}

var days = 1;
if (args.d!=null) {
    days = args.d
}

// Make a request
var url = 'https://api.open-meteo.com/v1/forecast?latitude='
+lat
+'&longitude='
+lon
+'&timezone='
+timezone
+'&daily=precipitation_hours';
//console.log(url)
const response = await fetch(url);

// Get the data from the request
const data = await response.json()

//console.log(JSON.stringify(data))
//console.log(data);

if (args.j){
    console.log(data)
    process.exit();
}

const precipitation_hours = data.daily.precipitation_hours
//console.log(data.daily.precipitation_hours)



if (days == 0) {
  console.log("today.")
} else if (days > 1) {
  console.log("in " + days + " days.")
} else {
  console.log("tomorrow.")
}
if (days<0 || days<precipitation_hours.length){
    console.log(precipitation_hours[days])
}
