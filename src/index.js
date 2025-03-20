let selectedDate;
document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("addTimeButton")
    .addEventListener("click", callAddItem);

  document.getElementById("saveTimeData")?.addEventListener("click", saveData);
  createTimeSlots();

  var calendarEl = document.getElementById("calendar");
  var calendar = new FullCalendar.Calendar(calendarEl, {
    events: function (fetchInfo, successCallback, failureCallback) {
      // Retrieve the saved data from local storage
      let savedData = localStorage.getItem("savedData");
      if (savedData) {
        savedData = JSON.parse(savedData);

        // Convert the saved data to the format expected by FullCalendar
        const events = savedData.map((data) => ({
          title: data.content,
          start: `${data.date}T${data.time.split(" - ")[0]}`,
          end: `${data.date}T${data.time.split(" - ")[1]}`,
        }));

        successCallback(events);
      } else {
        successCallback([]);
      }
    },
    initialView: "dayGridMonth",
    height: 350,
    width: 200,
    editable: false,
    selectable: true,
    dateClick: function (selectInfo) {
      // Handle date selection event
      selectedDate = selectInfo.startStr;
    },
    customButtons: {
      prevButton: {
        text: "<",
        click: function () {
          calendar.prev();
        },
      },
      nextButton: {
        text: ">",
        click: function () {
          calendar.next();
        },
      },
    },
    headerToolbar: {
      right: "nextButton",
      center: "title",
      left: "prevButton",
    },
  });
  calendar.render();

  // Dynamically set time slots height to fill remaining space
  function adjustTimeSlotHeight() {
    const timeSlots = document.querySelector(".time-slots");
    const calendar = document.getElementById("calendar");
    const totalHeight = window.innerHeight;
    const calendarHeight = calendar.offsetHeight;

    timeSlots.style.height = `${totalHeight - (calendarHeight + 80)}px`;
    timeSlots.style.overflowY = "auto";
  }

  // Call on initial load and on window resize
  adjustTimeSlotHeight();
  window.addEventListener("resize", adjustTimeSlotHeight);

  setInterval(updateCurrentTimeSelection, 60000);
  scrollToCurrentTime();
});

function callAddItem() {
  console.log("Start a new time log. > > > > > > > >>");
}

function scrollToCurrentTime() {
  const currentSlot = document.querySelector(".time-slot.current");
  if (currentSlot) {
    currentSlot.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

function createTimeSlots() {
  const sidebarMain = document.querySelector(".time-slots");
  const now = new Date();
  const currentHour = now.getHours();

  // Create 24 hour slots
  for (let i = 0; i < 24; i++) {
    const timeSlot = document.createElement("div");
    timeSlot.className = "time-slot";
    if (i === currentHour) {
      timeSlot.classList.add("current");
    }

    const startTime = `${i.toString().padStart(2, "0")}:00`;
    const endTime = `${(i + 1).toString().padStart(2, "0")}:00`;

    timeSlot.innerHTML = `${startTime} - ${endTime}`;

    timeSlot.addEventListener("click", () => {
      console.log(`Selected time slot: ${startTime} - ${endTime}`);
      document.querySelectorAll(".time-slot").forEach((slot) => {
        slot.classList.remove("selected");
      });
      timeSlot.classList.add("selected");

      // Update the selected date and time
      const selectedTime = `${startTime} - ${endTime}`;

      // Retrieve saved data for the selected date and time slot
      const savedData = localStorage.getItem("savedData");
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        console.log(selectedDate, parsedData, selectedTime);
        let date;
        if (!selectedDate) {
          const currentDate = new Date();
          date = currentDate.toISOString().split("T")[0];
        } else date = selectedDate;
        const selectedData = parsedData.find(
          (data) => data.date === date && data.time === selectedTime,
        );
        if (selectedData) {
          document.querySelector(".content-editor").value =
            selectedData.content;
        } else {
          document.querySelector(".content-editor").value = "";
        }
      } else {
        document.querySelector(".content-editor").value = "";
      }
    });

    sidebarMain.appendChild(timeSlot);
  }
}
function saveData() {
  const selectedTimeSlot = document.querySelector(".time-slot.selected");
  const content = document.querySelector(".content-editor").value;

  let date;
  let time;

  if (selectedDate) {
    date = selectedDate;
  } else {
    // Use current day if no date is selected
    const currentDate = new Date();
    date = currentDate.toISOString().split("T")[0];
  }

  if (selectedTimeSlot) {
    time = selectedTimeSlot.textContent.trim();
  } else {
    // Use current time slot if no time slot is selected
    const currentHour = new Date().getHours();
    const startTime = `${currentHour.toString().padStart(2, "0")}:00`;
    const endTime = `${(currentHour + 1).toString().padStart(2, "0")}:00`;
    time = `${startTime} - ${endTime}`;
  }

  const data = {
    date: date,
    time: time,
    content: content,
  };

  // Retrieve existing data from local storage
  let savedData = localStorage.getItem("savedData");
  if (savedData) {
    savedData = JSON.parse(savedData);
  } else {
    savedData = [];
  }

  savedData.push(data);

  // Store the updated data in local storage
  localStorage.setItem("savedData", JSON.stringify(savedData));

  console.log("Data saved:", data);
}

function updateCurrentTimeSelection() {
  const currentHour = new Date().getHours();
  document.querySelectorAll(".time-slot").forEach((slot, index) => {
    slot.classList.toggle("current", index === currentHour);
  });
}

function scrollToCurrentTime() {
  const currentSlot = document.querySelector(".time-slot.current");
  if (currentSlot) {
    currentSlot.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}
