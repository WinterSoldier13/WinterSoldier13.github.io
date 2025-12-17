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

var cmd_list = [];
var cmd_index = 0;
var cmd = document.getElementById("command");

cmd.addEventListener("keyup", function (e) {
  if (e.keyCode === 13) {
    // Enter
    e.preventDefault();
    run_command();
  } else if (e.keyCode === 38) {
    // Up Arrow
    e.preventDefault();
    cycle_command("up");
  } else if (e.keyCode === 40) {
    // Down Arrow
    e.preventDefault();
    cycle_command("down");
  } else if ((e.keyCode === 32 && e.ctrlKey) || e.keyCode === 9 || e.keyCode === 39) {
    // Ctrl + Space, Tab, or Right Arrow
    e.preventDefault();
    tab_completion();
  }
});

cmd.addEventListener("keydown", function(e) {
    if (e.keyCode === 9) { // Tab
        e.preventDefault();
    }
});

cmd.addEventListener("input", function() {
    suggest_command();
});

function run_command() {
  var cmd_element = document.getElementById("command");
  var cmd_val = cmd_element.value.toLowerCase();
  var result;

  if (cmd_val !== "") {
    var output_element = document.getElementById(cmd_val);
    if (available_cmd.indexOf(cmd_val) < 0) {
      output_element = document.getElementById("error");
    }

    if (cmd_val === "download") {
      window.open(
        "https://drive.google.com/file/d/18WSvCUixoKOrkHoTGbKKNCbnNQ75WrQk/view?usp=sharing",
        "_blank"
      );
    } else if (cmd_val === "clear") {
      clear_console();
      return;
    }

    if (output_element) {
        result = output_element.cloneNode(true);
        result.style = "display:block";
    }
  }

  var new_div = document.createElement("div");
  var new_command_line = document.createElement("div");
  new_div.appendChild(new_command_line);
  new_command_line.innerHTML =
    '<span style = "color:#3ffb57">guest@TheFlyingDutchman $</span> ' + cmd_val;

  if (cmd_val !== "") {
    if (result) {
        new_div.appendChild(result);
    }
    cmd_list.push(cmd_val);
  }

  var executed_commands = document.getElementById("executed_commands");
  executed_commands.appendChild(new_div);

  cmd_element.value = "";
  document.getElementById("suggestion").value = "";
  cmd_index = cmd_list.length - 1;

  var scrollingElement = document.scrollingElement || document.body;
  scrollingElement.scrollTop = scrollingElement.scrollHeight;
}

function cycle_command(direction) {
  if (direction === "up") {
    if (cmd_index > 0) cmd_index -= 1;
  } else if (direction === "down") {
    if (cmd_index < cmd_list.length - 1) cmd_index += 1;
  }

  var cmd_element = document.getElementById("command");
  if (cmd_list.length > 0 && cmd_list[cmd_index] !== undefined) {
    cmd_element.value = cmd_list[cmd_index];
  }
}

function tab_completion() {
  var cmd_element = document.getElementById("command");
  var input = cmd_element.value;
  var suggestion_element = document.getElementById("suggestion");

  if (suggestion_element.value !== "") {
      cmd_element.value = suggestion_element.value;
  }
}

function suggest_command() {
    var cmd_element = document.getElementById("command");
    var input = cmd_element.value.toLowerCase();
    var suggestion_element = document.getElementById("suggestion");

    if (input === "") {
        suggestion_element.value = "";
        return;
    }

    var found = false;
    for (var index = 0; index < available_cmd.length; index++) {
        if (available_cmd[index].startsWith(input)) {
            suggestion_element.value = available_cmd[index];
            found = true;
            break;
        }
    }

    if (!found) {
        suggestion_element.value = "";
    }
}

function clear_console() {
  document.getElementById("executed_commands").innerHTML = "<div></div>";
  document.getElementById("command").value = "";
  document.getElementById("suggestion").value = "";
}

$("html").click(function () {
  $("#command").focus();
});
