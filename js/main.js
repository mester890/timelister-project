const db = firebase.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true};
db.settings(settings);


// populating list of employees
db.collection("employees").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        id = doc.id;
        d = doc.data();
        $('#emp_tbl tr:last').after('<tr><td>' + id + '</td><td>' + d.firstname + '</td><td>' + d.lastname + '</td><td>' + d.username + '</td><td>' + d.hourpay + '</td></tr>');
    });
});



// populating lists of working hours
db.collection("employees").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        id = doc.id;
        d = doc.data();
        $('#list_tbl tr:last').after(
          `<tr>
            <th> ${d.firstname} </th>
            <td id="${id}_1" class="data_cell" data-day="1" data-employee="${d.username}" data-busy="false" onclick="getCellData(this)">x</td>
            <td id="${id}_2" class="data_cell" data-day="2" data-employee="${d.username}" data-busy="false" onclick="getCellData(this)">x</td>
            <td id="${id}_3" class="data_cell" data-day="3" data-employee="${d.username}" data-busy="false" onclick="getCellData(this)">x</td>
            <td id="${id}_4" class="data_cell" data-day="4" data-employee="${d.username}" data-busy="false" onclick="getCellData(this)">x</td>
            <td id="${id}_5" class="data_cell" data-day="5" data-employee="${d.username}" data-busy="false" onclick="getCellData(this)">x</td>
            <td id="${id}_6" class="data_cell" data-day="6" data-employee="${d.username}" data-busy="false" onclick="getCellData(this)">x</td>
            <td id="${id}_total" class="data_cell"></td>
          </tr>`);

        //populates select-form on addWork.html -> page
        $('#emp_list_sel option:last').after('<option>' + d.username + '</option>');


        //checks if the week is defined, if not -> nothing happens.
        if (getUrlParams().week) {
          fillColumns(d.username);
          fillDates();
        } else {
          return;
        }
    });
    if (getUrlParams().week) {
      fillDates();
    } else {
      return;
    }
});

function getCellData(e) {
  var isBusy = $(e).attr('data-busy');
  var employee = $(e).attr('data-employee');
  var day = $(e).attr('data-day');
  console.log(isBusy);
  if(isBusy == 'true') {
    console.log(employee + " is already booked for this day");
  } else {
    console.log('open modal to add new booking for day: ' + day);
    // date = calc from week and day nr.
  }
}

function addWork() {
  var username = $('#emp_list_sel').find(":selected").text();
  var hours = $('#emp_hours').val();

  var week = $('#emp_week').val();
  debugger;
/*
  db.collection('lists').doc().set({
    date: date,
    hours: hours,
    username: username,
    week: week
  });
*/
}

// TODO: Make function for filling day names and dates in table header
// TODO: Fix date / timestamp in firebase for adding new entries
function fillDates() {
  week = getUrlParams().week;
  //console.log(getDateOfWeek(week, new Date().getFullYear()));
}


function fillColumns(username) {
  var week = getUrlParams().week;
  db.collection("lists")
    .where("week", "==", week).where("username", "==", username)
    .onSnapshot(function(snapshot) {
        snapshot.forEach(function (doc) {
            d = doc.data();
            date = d.date.toDate();
            day = date.getDay();
            $("#" + username + "_" + day).css('background-color', 'green');
            $("#" + username + "_" + day).attr('data-busy', 'true');
        });
    });
}


function getUrlParams(url) {
  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
  var obj = {};
  if (queryString) {
    queryString = queryString.split('#')[0];
    var arr = queryString.split('&');
    for (var i=0; i<arr.length; i++) {
      var a = arr[i].split('=');
      var paramNum = undefined;
      var paramName = a[0].replace(/\[\d*\]/, function(v) {
        paramNum = v.slice(1,-1);
        return '';
      });
      var paramValue = typeof(a[1])==='undefined' ? true : a[1];
      paramName = paramName.toLowerCase();
      paramValue = paramValue.toLowerCase();
      if (obj[paramName]) {
        if (typeof obj[paramName] === 'string') {
          obj[paramName] = [obj[paramName]];
        }
        if (typeof paramNum === 'undefined') {
          obj[paramName].push(paramValue);
        }
        else {
          obj[paramName][paramNum] = paramValue;
        }
      }
      else {
        obj[paramName] = paramValue;
      }
    }
  }
  return obj;
}
