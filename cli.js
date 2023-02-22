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


var lat;
if (args.n!=null){ lat = Math.round(args.n*100)/100}
else if (args.s!=null){ lat = -Math.round(args.s*100)/100}

var lon;
if (args.e!=null){lon = Math.round(args.e*100)/100}
else if (args.w!=null){lon = -Math.round(args.w*100)/100}

var timezone;
if (args.z){
    timezone = args.z;
} else {timezone = moment.tz.guess()}

var days = 1;
if (args.d!=null) {
    days = args.d
}

// Make a request
const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude='+lat+'&longitude='+lon+'&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_hours,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone='+timezone);

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
