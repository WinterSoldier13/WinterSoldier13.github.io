var cmd_list = [];
var cmd_index = 0;
var available_cmd = [
  "about",
  "education",
  "projects",
  "experience",
  "skills",
  "achievements",
  "contact",
  "download",
  "help",
  "clear",
  "ls",
  "book-a-time",
];

var cmd = document.getElementById("command");

cmd.addEventListener("keydown", function (event) {
  if (event.keyCode === 13) {
    // Enter
    event.preventDefault();
    run_command();
  } else if (event.keyCode === 38) {
    // Up Arrow
    event.preventDefault();
    cycle_command("up");
  } else if (event.keyCode === 40) {
    // Down Arrow
    event.preventDefault();
    cycle_command("down");
  } else if (event.keyCode === 9) {
    // Tab
    event.preventDefault();
    handle_tab_completion();
  } else if (event.keyCode === 32 && event.ctrlKey) {
    // Ctrl + Space (Keep for backward compatibility or remove?)
    event.preventDefault();
    handle_tab_completion();
  }
});

cmd.addEventListener("input", function(e) {
   var val = this.value;
   var suggestion_field = document.getElementById("suggestion");

   if (!suggestion_field) return; // Guard clause if suggestion field doesn't exist yet

   suggestion_field.value = "";

   if (val.length > 0) {
       for (var i = 0; i < available_cmd.length; i++) {
           if (available_cmd[i].startsWith(val.toLowerCase())) {
               suggestion_field.value = available_cmd[i];
               break;
           }
       }
   }
});

function run_command() {
  var cmd_input = document.getElementById("command");
  var cmd_value = cmd_input.value.toLowerCase();
  var element;

  if (cmd_value != "") {
    var result_element = document.getElementById(cmd_value);
    if (available_cmd.indexOf(cmd_value) < 0) {
        result_element = document.getElementById("error");
    }

    if (cmd_value == "download") {
      window.open("https://drive.google.com/file/d/18WSvCUixoKOrkHoTGbKKNCbnNQ75WrQk/view?usp=sharing", "_blank");
    } else if (cmd_value == "clear") {
      clear_console();
      return;
    }

    // Check if result_element exists before cloning
    if (result_element) {
        element = result_element.cloneNode(true);
        element.style = "display:block";
    }
  }

  // Create wrapper
  var wrapper_div = document.createElement("div");

  // Create prompt div
  var prompt_div = document.createElement("div");
  prompt_div.innerHTML = '<span style = "color:#3ffb57">guest@TheFlyingDutchman $</span> ' + cmd_value;
  wrapper_div.appendChild(prompt_div);

  // Append result if command was not empty
  if (cmd_value != "" && element) {
    wrapper_div.appendChild(element);
    cmd_list.push(cmd_value);
  }

  // Append wrapper to main container
  document.getElementById("executed_commands").appendChild(wrapper_div);

  // Reset input and suggestion
  cmd_input.value = "";
  var suggestion_field = document.getElementById("suggestion");
  if(suggestion_field) suggestion_field.value = "";

  cmd_index = cmd_list.length;

  var scrollingElement = document.scrollingElement || document.body;
  scrollingElement.scrollTop = scrollingElement.scrollHeight;
}

function cycle_command(direction) {
  if (direction === "up") {
    if (cmd_index > 0) cmd_index -= 1;
  } else if (direction === "down") {
    if (cmd_index < cmd_list.length) cmd_index += 1; // Allow going back to empty/new command?
  }

  var cmd_input = document.getElementById("command");
  var suggestion_field = document.getElementById("suggestion");

  if (cmd_index < cmd_list.length) {
      cmd_input.value = cmd_list[cmd_index];
  } else {
      cmd_input.value = ""; // New command line
  }

  // Update suggestion when cycling
  if (suggestion_field) {
      suggestion_field.value = "";
      if (cmd_input.value.length > 0) {
           for (var i = 0; i < available_cmd.length; i++) {
               if (available_cmd[i].startsWith(cmd_input.value.toLowerCase())) {
                   suggestion_field.value = available_cmd[i];
                   break;
               }
           }
      }
  }
}

function handle_tab_completion() {
  var cmd_input = document.getElementById("command");
  var suggestion_field = document.getElementById("suggestion");

  if (suggestion_field && suggestion_field.value !== "") {
      cmd_input.value = suggestion_field.value;
  } else {
      // Fallback if suggestion field not working or empty, try to compute match
      var input_val = cmd_input.value.toLowerCase();
       for (index = 0; index < available_cmd.length; index++) {
        if (available_cmd[index].startsWith(input_val)) {
            cmd_input.value = available_cmd[index];
            break;
        }
      }
  }
}

function clear_console() {
  document.getElementById("executed_commands").innerHTML = "<div></div>";
  document.getElementById("command").value = "";
  var suggestion_field = document.getElementById("suggestion");
  if(suggestion_field) suggestion_field.value = "";
}

$("html").click(function () {
  $("#command").focus();
});
