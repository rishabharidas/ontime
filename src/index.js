document.addEventListener("DOMContentLoaded", () => {
    document
      .getElementById("addTimeButton")
      .addEventListener("click", callAddItem);
  
    createTimeSlots();
  
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
    const sidebarMain = document.querySelector(".sidebar-main");
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
        // Remove current selection
        document.querySelectorAll(".time-slot").forEach((slot) => {
          slot.classList.remove("selected");
        });
        // Add selection to clicked slot
        timeSlot.classList.add("selected");
      });
  
      sidebarMain.appendChild(timeSlot);
    }
  }
  
  function updateCurrentTimeSelection() {
    const currentHour = new Date().getHours();
    document.querySelectorAll(".time-slot").forEach((slot, index) => {
      slot.classList.toggle("current", index === currentHour);
    });
  }
  