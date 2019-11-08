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

    console.log(this);
};

// array of train objects 
let trainObjArr = [];




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
    const trainNextArrival = $("<td>");
    trainNextArrival.text(train.time);
    const trainMinsAway = $("<td>");
    trainMinsAway.text("0");
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
    console.log("We're adding a new train to the database! ->", obj)
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
        console.log("There's a new train on the database!", snap)
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

    let newTrain = new newTrainObj(newTrainName.val(), newTrainDest.val(), newTrainTime.val(), newTrainFreq.val());
    trainObjArr.push(newTrain);
    console.log('currently:', trainObjArr)
    pushNewTrain(newTrain);
});
// display the current time
const arrivalTime = new Date()
const t = arrivalTime.toTimeString();
const tShort = t.substring(0, 5);
$("#curTime").text(tShort)