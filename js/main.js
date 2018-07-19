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
        $('#list_tbl tr:last').after('<tr><th>' + d.firstname + '</th><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>');

        // Call second function to get days the employee is going to work, based on wich week (getUrlParams(url).week) -> query based on id from employee. using the reference from firestore.
    });
});

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
