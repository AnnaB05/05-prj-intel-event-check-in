//Get all needed DOM elements
const form = document.getElementById('checkInForm');
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

//track attendance
let count = 0;
const maxCount = 50;

// Function to load and display attendee list
function loadAttendeeList() {
  const attendeeListDiv = document.getElementById("attendeeList");
  let attendees = [];
  const savedAttendees = localStorage.getItem("attendees");
  if (savedAttendees !== null) {
    attendees = JSON.parse(savedAttendees);
  }
  let html = "<h3>Attendees</h3><ul class='attendee-list'>";
  for (let i = 0; i < attendees.length; i++) {
    html += `<li>${attendees[i].name} (${attendees[i].team})</li>`;
  }
  html += "</ul>";
  attendeeListDiv.innerHTML = html;
}

window.addEventListener("DOMContentLoaded", function() {
  // Load attendee list from localStorage
  let attendees = [];
  const savedAttendees = localStorage.getItem("attendees");
  if (savedAttendees !== null) {
    attendees = JSON.parse(savedAttendees);
  }

  // Set count to number of attendees
  count = attendees.length;
  document.getElementById("attendeeCount").textContent = `${count}`;
  const percentage = Math.round((count / maxCount) * 100) + "%";
  document.getElementById("progressBar").style.width = percentage;

  // Reset team counts
  const teams = ["water", "zero", "power"];
  for (let i = 0; i < teams.length; i++) {
    document.getElementById(teams[i] + "Count").textContent = "0";
  }

  // Recalculate team counts from attendee list
  for (let i = 0; i < attendees.length; i++) {
    if (attendees[i].team === "Team Water Wise") {
      document.getElementById("waterCount").textContent = parseInt(document.getElementById("waterCount").textContent) + 1;
    }
    if (attendees[i].team === "Team Net Zero") {
      document.getElementById("zeroCount").textContent = parseInt(document.getElementById("zeroCount").textContent) + 1;
    }
    if (attendees[i].team === "Team Renewables") {
      document.getElementById("powerCount").textContent = parseInt(document.getElementById("powerCount").textContent) + 1;
    }
  }

  // Show attendee list
  loadAttendeeList();
});

// Handle form submission
form.addEventListener("submit", function(event) {
  event.preventDefault();

  // Grab form values
  const name = nameInput.value;
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  console.log(name, teamName);

  // increment count
  count++;
  console.log("Total check-ins: ", count);
  
  //Update attendance counter
  const attendanceDisplay = document.getElementById("attendeeCount");
  attendanceDisplay.textContent = `${count}`;

  // Update progress bar
  const percentage = Math.round((count / maxCount) * 100) + "%";
  console.log(`Progress: ${percentage}`)

  // Set progress bar width
  const progressBar = document.getElementById("progressBar");
  progressBar.style.width = percentage;

  //Update team counter
  const teamCounter = document.getElementById(team + "Count");
  teamCounter.textContent = parseInt(teamCounter.textContent) + 1;

  // Save counts to localStorage
  localStorage.setItem("attendanceCount", count);
  localStorage.setItem(team + "Count", document.getElementById(team + "Count").textContent);

  // Save attendee to localStorage
  let attendees = [];
  const savedAttendees = localStorage.getItem("attendees");
  if (savedAttendees !== null) {
    attendees = JSON.parse(savedAttendees);
  }
  attendees.push({ name: name, team: teamName });
  localStorage.setItem("attendees", JSON.stringify(attendees));

  // Update attendee list display
  loadAttendeeList();


  //Show welcome message
  const message = `Welcome, ${name} from ${teamName}!`;
  const greeting = document.getElementById("greeting");
  greeting.textContent = message;
  greeting.style.display = "block";
  console.log(message);

  //Celebration and highlight when max is reached
  if (count === maxCount) {
    //show celebration message
    greeting.textContent = "🎉 Attendance goal reached! Congratulations to all teams!";

    //get team counts
    const waterCount = parseInt(document.getElementById("waterCount").textContent);
    const zeroCount = parseInt(document.getElementById("zeroCount").textContent);
    const powerCount = parseInt(document.getElementById("powerCount").textContent);

    // Find the highest count
    const maxTeamCount = Math.max(waterCount, zeroCount, powerCount);

    // Remove highlight from all teams first
    document.getElementById("waterCount").parentElement.style.border = "";
    document.getElementById("zeroCount").parentElement.style.border = "";
    document.getElementById("powerCount").parentElement.style.border = "";

    // Highlight the winning team(s)
    if (waterCount === maxTeamCount) {
      document.getElementById("waterCount").parentElement.style.border = "3px solid gold";
    }
    if (zeroCount === maxTeamCount) {
      document.getElementById("zeroCount").parentElement.style.border = "3px solid gold";
    }
    if (powerCount === maxTeamCount) {
      document.getElementById("powerCount").parentElement.style.border = "3px solid gold";
    }
  }

  //clears form
  form.reset();
  
})