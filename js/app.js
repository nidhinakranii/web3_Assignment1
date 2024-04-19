// jQuery is a JS library designed to simplify working with the DOM (Document Object Model) and event handling.
// This code runs the function createBugList() only after the DOM has completely loaded, ensuring safe DOM element interaction.
$(document).ready(function () {
  createBugList();
  retrieveResolvedBugs(); // Call function to retrieve resolved bugs from local storage
});

// Auto-focus on input of add task modal
$("#add-bug-container").on("shown.bs.modal", function () {
  $("#new-bug").trigger("focus");
});

function getCriticalityLabel(criticality) {
  switch (criticality) {
      case "0":
          return "Low";
      case "1":
          return "Medium";
      case "2":
          return "Critical";
      default:
          return "Unknown";
  }
}

async function createBugList() {
  try {
      await getAccount();
      contract = new web3.eth.Contract(contractABI, contractAddress);
      try {
          bugNum = await contract.methods.getBugCount().call({
              from: web3.eth.defaultAccount,
          });
          if (bugNum != 0) {
              let bugIndex = 0;
              while (bugIndex < bugNum) {
                  try {
                      let bug = await contract.methods.getBug(bugIndex).call({
                          from: web3.eth.defaultAccount,
                      });
                      console.log(bug);

                      if (bug.description != "") {
                          addBugToList(bugIndex, bug.description, bug.bugID, bug.criticality, bug.isResolved);
                      } else {
                          console.log("The index is empty: " + bugIndex);
                      }
                  } catch {
                      console.log("Failed to get bug: " + bugIndex);
                  }
                  bugIndex++;
              }
          }
      } catch {
          console.log("Failed to retrieve bug count from blockchain.");
      }
  } catch {
      console.log("Failed to retrieve default account from blockchain.");
  }
}

function addBugToList(id, name, bugId, criticality, isResolved) {
  let list = document.getElementById("list");
  let item = document.createElement("li");
  item.classList.add(
      "list-group-item",
      "border-0",
      "d-flex",
      "justify-content-between",
      "align-items-center"
  );
  item.id = "item-" + id;
  let bugDescription = document.createElement("span");
  bugDescription.textContent =
      "ID: " +
      bugId +
      " | Description: " + 
      name + 
      " | Criticality: " +
      getCriticalityLabel(criticality.toString()) +
      " | Resolved: " +
      isResolved;
  var resolveButton = document.createElement("button");
  resolveButton.textContent = "Resolve Bug";
  resolveButton.setAttribute("id", "resolve-button-" + id);
  resolveButton.classList.add("resolve-button");
  var deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete Bug";
  deleteButton.setAttribute("id", "delete-button-" + id);
  deleteButton.classList.add("delete-button");

  list.appendChild(item);
  item.appendChild(bugDescription);
  item.appendChild(resolveButton);
  item.appendChild(deleteButton);
  resolveButton.onclick = function () {
      changeBugStatus(id);
      resolveButton.disabled = true;
      localStorage.setItem("resolvedBug-" + id, "true"); // Store resolved status in local storage
  };
  deleteButton.onclick = function () {
      deleteBug(id);
      localStorage.removeItem("resolvedBug-" + id); // Remove resolved status from local storage when bug is deleted
  };

  // Check if bug was previously marked as resolved and apply visual indication
  if (isResolved || localStorage.getItem("resolvedBug-" + id)) {
      item.classList.add("bug-done");
      resolveButton.disabled = true;
  }
}

async function deleteBug(id) {
  try {
      await contract.methods.deleteBug(id).send({
          from: web3.eth.defaultAccount,
          gas: "1000000",
          gasPrice: 1000000000,
      });
      console.log("Bug deleted.");

      // Disable the resolve button after marking the bug as done
      let resolveButton = document.getElementById("resolve-button-" + id);
      if (resolveButton) {
          resolveButton.disabled = true;
      }

      // Add a visual indication that the bug is resolved
      let bugItem = document.getElementById("item-" + id);
      if (bugItem) {
          bugItem.classList.add("bug-done");
      }
  } catch (e) {
      console.log("bug id not deleted " + id, e);
  }
}


async function changeBugStatus(id) {
  try {
      await contract.methods.updateBugStatus(id).send({
          from: web3.eth.defaultAccount,
          gas: "1000000",
          gasPrice: 1000000000,
      });
      console.log("Bug status updated successfully.");
  } catch (e) {
      console.log("Failed to change status of bug. Bug ID: " + id, e);
  }
}

async function addBug(name) {
  let form = document.getElementById("add-bug-container");
  document.getElementById("new-bug").value = "";
  let bugId = document.getElementById("new-bug-id").value; // Retrieve Bug ID from input field
  let criticality = document.getElementById("new-bug-criticality").value; // Retrieve Criticality from dropdown menu

  console.log(criticality);

  form.classList.remove("was-validated");
  contract.methods
      .getBugCount()
      .call({
          from: web3.eth.defaultAccount,
      })
      .then(
          (bugNum) => {
              addBugToList(bugNum, name, false);
          },
          (err) => {
              console.log("Failed to retrieve the number of bugs from Ganache.");
          }
      );
  console.log("h");
  try {
      await contract.methods.addBug(bugId, name, criticality).send({
          from: web3.eth.defaultAccount,
          gas: "1000000",
          gasPrice: 1000000000,
      });
  } catch (e) {
      console.log("Failed to save bug to blockchain.", e);
  }
}

// Function to retrieve resolved bugs from local storage and apply visual indication
function retrieveResolvedBugs() {
  for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith("resolvedBug-")) {
          const bugId = key.replace("resolvedBug-", "");
          const bugItem = document.getElementById("item-" + bugId);
          const resolveButton = document.getElementById("resolve-button-" + bugId);
          if (bugItem && resolveButton) {
              bugItem.classList.add("bug-done");
              resolveButton.disabled = true;
          }
      }
  }
}
