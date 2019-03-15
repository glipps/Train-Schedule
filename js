var recordCount = 0;

// Initialize Firebase
var config = {
    apiKey: "AIzaSyAciE5k7uDcvaxEpqiapOf_LSlJlSh910g",
    authDomain: "train-schedule-5071f.firebaseapp.com",
    databaseURL: "https://train-schedule-5071f.firebaseio.com",
    projectId: "train-schedule-5071f",
    storageBucket: "train-schedule-5071f.appspot.com",
    messagingSenderId: "824371310423"
  };
  firebase.initializeApp(config);

firebase.initializeApp(config);

var database = firebase.database();

$("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTrain = $("#first-train-input").val().trim();
    var frequency = $("#frequency-input").val().trim();

    recordCount = 0;

    database.ref().push({
        name: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency
    });
    alert("Train successfully added");
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");
});

database.ref().on("child_added", function (document) {
    recordCount += 1;

    console.log(document.key);
    console.log(document.val());

    var name = document.val().name;
    var destination = document.val().destination;
    var frequency = document.val().frequency;
    var firstTrain = document.val().firstTrain;
    var arrivalMinutes;
    var arrivalTime;

    var trainTime = moment(firstTrain, "hh:mm").subtract(1, "years");

    var minuteDifference = moment().diff(moment(trainTime), "minutes");
    var remainder = minuteDifference % frequency;
    arrivalMinutes = frequency - remainder;

    var nextTrain = moment().add(arrivalMinutes, "minutes");
    arrivalTime = moment(nextTrain).format("hh:mm");

    var anchor = "<a href=# onclick=deleteDocument('" + document.key + "');>X</a>";

    $("#train-table > tbody").append(
        $("<tr>").append(
            $("<td>").text(name),
            $("<td>").text(destination),
            $("<td>").text(frequency),
            $("<td>").text(arrivalTime),
            $("<td>").text(arrivalMinutes),
            $("<td>").html(anchor)
        )
    );

    console.log("Record:" + recordCount);
});

function deleteDocument(documentId) {
    database.ref().child(documentId).set(null);
    alert("Train successfully deleted!");
    location.reload();
}
