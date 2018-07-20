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
        $('#list_tbl tr:last').after('<tr><th>' + d.firstname + '</th><td id="' + id + '_1"></td><td id="' + id + '_2"></td><td id="' + id + '_3"></td><td id="' + id + '_4"></td><td id="' + id + '_5"></td><td id="' + id + '_6"></td><td id="' + id + '_total"></td></tr>');

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
function fillDates() {
  week = getUrlParams().week;
  console.log(getDateOfWeek(week, new Date().getFullYear()));
}
function getDateOfWeek(w, y) {
    var d = (1 + (w - 1) * 7); // 1st of January + 7 days for each week

    return new Date(y, 0, d);
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
