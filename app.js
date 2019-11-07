// display the current time
const arrivalTime = new Date()
const t = arrivalTime.toTimeString();
const tShort = t.substring(0, 5);
$("#curTime").text(tShort)



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
    // submit button listener

newTrainSubmitBtn.on('click', function(event) {
    event.preventDefault();

    let newTrain = new newTrainObj(newTrainName.val(), newTrainDest.val(), newTrainTime.val(), newTrainFreq.val());
    trainObjArr.push(newTrain);
    console.log('currently:', trainObjArr)
    showNewTrain(newTrain);
});