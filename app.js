// // <!-- Powered by Ahmedraza https://ahmedrazabaloch.netlify.app -->
// Register service worker if supported
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/serviceworker.js")
      .then((res) => console.log(res, "Service worker registered"))
      .catch((err) => console.log("Service worker not registered", err));
  });
}

// Request notification permission on page load
window.addEventListener("load", () => {
  Notification.requestPermission((result) => {
    if (result === "granted") {
      // Uncomment this line if displayConfirmNotification is defined
      // displayConfirmNotification();
    }
  });
});

// Logout
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    location.href = "index.html";
  });
}

// Namaz & Task Section Show Hide
const namaz = document.querySelector(".namaz");
const hideSection = document.querySelector(".sectionBox");
const userSelect = document.querySelector(".hide");
const hideinnher = document.querySelector("#hideinnher");

if (namaz) {
  setTimeout(() => {
    namaz.style.display = "block";
  }, 1500);
}

function newTask() {
  if (namaz) namaz.style.display = "none";
  if (hideSection) hideSection.style.display = "block";
  if (userSelect) userSelect.style.display = "block";
  if (hideinnher) hideinnher.style.display = "flex";
}

function namazR() {
  if (hideinnher) hideinnher.style.display = "none";
  if (namaz) namaz.style.display = "block";
  if (hideSection) hideSection.style.display = "none";
  if (userSelect) userSelect.style.display = "none";
}

// >>>>>> Main Page Code <<<<<<

// Set date on top of the display
const dateElement = document.getElementById("date");
if (dateElement) {
  const clockDate = moment().format("ll");
  dateElement.innerHTML = clockDate;
}

// Set Timer on top of the display
const timerClock = document.getElementById("time");
if (timerClock) {
  setInterval(() => {
    const currentTime = moment().format("LTS");
    timerClock.innerHTML = currentTime;
  }, 1000);
}

// Namaz Timing
const prayerTimes = {
  fajar: "5:31:01 am",
  zuhar: "12:30:01 pm",
  asar: "3:45:01 pm",
  magrib: "6:15:01 pm",
  esha: "8:30:01 pm",
};

let notification;
setInterval(() => {
  const timeClock = moment().format("h:mm:ss a");
  for (const [prayer, time] of Object.entries(prayerTimes)) {
    if (time === timeClock) {
      notification = new Notification(
        `${prayer.charAt(0).toUpperCase() + prayer.slice(1)} Prayer Time`
      );
    }
  }
}, 1000);

// Getting Data from User
const userTitles = document.getElementById("userTitle");
const userDiscerption = document.getElementById("userDis");
const inputTime = document.getElementById("setTime");
const inputDate = document.getElementById("setDate");
let formattedTime;
let timerArr = [];
let newTasks = []; // Array for storing tasks

// Save Data to newTasks array
function saveData() {
  // Validation
  if (!userTitles.value.trim()) {
    Swal.fire({
      title: "Title can't be empty",
      showClass: {
        popup: "animate__animated animate__fadeInUp animate__faster",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutDown animate__faster",
      },
    });
    return;
  }
  if (!userDiscerption.value.trim()) {
    Swal.fire({
      title: "Description can't be empty",
      showClass: {
        popup: "animate__animated animate__fadeInUp animate__faster",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutDown animate__faster",
      },
    });
    return;
  }
  formattedTime = moment(inputTime.value, "HH:mm:ss").format("h:mm:ss A");
  timerArr.push(formattedTime);

  // Create a new task object
  const newTask = {
    id: Date.now(), // Generate unique ID
    title: userTitles.value.trim(),
    description: userDiscerption.value.trim(),
    time: formattedTime,
    date: inputDate.value.trim() || "Once", // Default changed to Once
  };
  newTasks.push(newTask); // Add to newTasks array

  renderTasks(); // Display updated tasks

  userTitles.value = "";
  userDiscerption.value = "";
  inputTime.value = "";
  inputDate.value = "";

  Swal.fire({
    position: "top-end",
    icon: "success",
    title: "Set alarm",
    showConfirmButton: false,
    timer: 2000,
  });

  // Matching Time & send notification
  setInterval(() => {
    const timeClock = moment().format("LTS");
    timerArr.forEach((v) => {
      if (v === timeClock) {
        if (!("Notification" in window)) {
          alert("This browser does not support desktop notification");
        } else if (Notification.permission === "granted") {
          new Notification("Reminder! Time's up");
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              new Notification("Notification Permission Granted");
            }
          });
        }
      }
    });
  }, 1000);
}