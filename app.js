// jquery selectors
// train-times-table
const trainTableBody = $("#train-table-body");
// form
const newTrainName = $("#train-name");
const newTrainDest = $("#train-dest");
const newTrainTime = $("#first-train-time");
const newTrainFreq = $("#freq");
const newTrainSubmitBtn = $("#new-train-submit");


// train object constructer
const newTrainObj = function(name, dest, time, freq) {
    this.name = name;
    this.dest = dest;
    this.time = time;
    this.freq = freq;

};

// array of train objects 
let trainObjArr = [];

// MOMENT.JS stuff =========================================================
// =========================================================================



// calculate next Arrival

// trainArrival object constructer
const trainArrival = function(firstTime, freq) {
    this.firstTime = firstTime;
    this.freq = freq;
    self = this;

};
const calcNextArrival = (time, freq) => {
    var currentTime = moment();
    var firstTime = time;
    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");

    // Difference between the times
    var diffTime = currentTime.diff(moment(firstTimeConverted), "minutes");

    // Time apart (remainder)
    var tRemainder = diffTime % parseInt(freq);

    // Minute Until Train
    var tMinutesTillTrain = parseInt(freq) - tRemainder;

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    return [tMinutesTillTrain, moment(nextTrain).format("HH:mm")]
};
// MOMENT.JS stuff =========================================================
// =========================================================================


//  function to showNewTrain on table
const showNewTrain = (train) => {
    const tableRow = $("<tr>");
    const tableHead = $("<th>");
    tableHead.attr('scope', 'row');
    tableHead.text(train.name)
    const trainDest = $("<td>");
    trainDest.text(train.dest)
    const trainFreq = $("<td>");
    trainFreq.text(train.freq);

    // train time calculations and updates
    // create random identifier for updating times
    const random_id = Math.floor(Math.random() * 1000000000001);

    const trainNextArrival = $("<td>");
    trainNextArrival.attr('data-first-train-time', train.time)
    trainNextArrival.attr('data-freq', parseInt(train.freq))

    trainNextArrival.attr('id', random_id + "-next-arrival")
    trainNextArrival.text(calcNextArrival(train.time, train.freq)[1]);
    const trainMinsAway = $("<td>");
    trainMinsAway.attr('data-first-train-time', train.time);
    trainMinsAway.attr('data-freq', parseInt(train.freq));

    trainMinsAway.attr('id', random_id + "-mins-away");
    trainMinsAway.text(calcNextArrival(train.time, train.freq)[0]);

    // create interval
    // for updating the times
    setInterval(function() {

        var nextArr = '#' + random_id + '-next-arrival';
        var minsAway = '#' + random_id + '-mins-away';
        $(nextArr).text(calcNextArrival($(nextArr).attr('data-first-train-time'), parseInt($(nextArr).attr('data-freq')))[1]);
        $(minsAway).text(calcNextArrival($(minsAway).attr('data-first-train-time'), parseInt($(minsAway).attr('data-freq')))[0]);

    }, 1000)

    // end train time calculations and updates
    tableRow.append(tableHead);
    tableRow.append(trainDest);
    tableRow.append(trainFreq);
    tableRow.append(trainNextArrival);
    tableRow.append(trainMinsAway);

    trainTableBody.append(tableRow);
}

// FIREBASE STUFF =============================================================
// ============================================================================
// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyCPb7YSlT7tn3yrtvFRnlONmTRIqRjcx9Q",
    authDomain: "hyperbolic-train-times-chamber.firebaseapp.com",
    databaseURL: "https://hyperbolic-train-times-chamber.firebaseio.com",
    projectId: "hyperbolic-train-times-chamber",
    storageBucket: "hyperbolic-train-times-chamber.appspot.com",
    messagingSenderId: "826348737800",
    appId: "1:826348737800:web:e2c4ab7fbc9e903240c8bd"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//   database ref
var database = firebase.database();
var ref = database.ref();

// function to push stuff into db
const pushNewTrain = obj => {
    // console.log("We're adding a new train to the database! ->", obj)
    ref.push({
        trainName: obj.name,
        trainDest: obj.dest,
        trainTime: obj.time,
        trainFreq: obj.freq
    })
}

// listen for new values in db
ref.on('child_added', function(snapshot) {

        var snap = snapshot.val()
            // console.log("There's a new train on the database!", snap)
        var newTrain = new newTrainObj(snap.trainName, snap.trainDest, snap.trainTime, snap.trainFreq);
        showNewTrain(newTrain);
    },
    function(errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
// END FIREBASE STUFF =============================================================
// ============================================================================


// submit button listener

newTrainSubmitBtn.on('click', function(event) {
    event.preventDefault();
    if ((/^([01]\d|2[0-3]):?([0-5]\d)$/.test(newTrainTime.val()) && newTrainTime.val() <= 2301) && (/^[0-9]*$/.test(newTrainFreq.val())) && (newTrainName.val() !== '') && (newTrainDest.val() !== '')) {
        // console.log('it matches!')
        let newTrain = new newTrainObj(newTrainName.val(), newTrainDest.val(), newTrainTime.val(), newTrainFreq.val());
        trainObjArr.push(newTrain);
        // console.log('currently:', trainObjArr)
        pushNewTrain(newTrain);
    } else {
        alert('Please make sure that all fields are correctly filled out.')
    }

});
// display the current time

setInterval(function() {

    $("#curTime").text(moment().format("HH:mm:ss"))
}, 100);