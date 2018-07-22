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
            <td id="${id}_1" class="data_cell" data-day="1" data-employee="${d.username}" data-docid="null" data-date="null" data-busy="false" onclick="getCellData(this)"></td>
            <td id="${id}_2" class="data_cell" data-day="2" data-employee="${d.username}" data-docid="null" data-date="null" data-busy="false" onclick="getCellData(this)"></td>
            <td id="${id}_3" class="data_cell" data-day="3" data-employee="${d.username}" data-docid="null" data-date="null" data-busy="false" onclick="getCellData(this)"></td>
            <td id="${id}_4" class="data_cell" data-day="4" data-employee="${d.username}" data-docid="null" data-date="null" data-busy="false" onclick="getCellData(this)"></td>
            <td id="${id}_5" class="data_cell" data-day="5" data-employee="${d.username}" data-docid="null" data-date="null" data-busy="false" onclick="getCellData(this)"></td>
            <td id="${id}_6" class="data_cell" data-day="6" data-employee="${d.username}" data-docid="null" data-date="null" data-busy="false" onclick="getCellData(this)"></td>
            <td id="${id}_total" class="data_cell"></td>
          </tr>`);

        //populates select-form on addWork.html -> page
        $('#emp_list_sel option:last').after('<option>' + d.username + '</option>');


        //checks if the week is defined, if not -> nothing happens.
        if (getUrlParams().week) {
          fillColumns(d.username);
          fillDates(d.username);
          return;
        }
    });
});

function getCellData(e) {
  var isBusy = $(e).attr('data-busy');
  var employee = $(e).attr('data-employee');
  var day = $(e).attr('data-day');
  console.log(isBusy);
  if(isBusy == 'true') {
    removeWork(e);
  } else if(isBusy == 'false') {
    addWork(day, e);
    // date = calc from week and day nr.
  }
}

function addWork(day, e) {
  week = getUrlParams().week;
  date = $(e).attr('data-date');
  employee = $(e).attr('data-employee');
  if (day == 6) { hours = 6 } else { hours = 8 };
  console.log("add-work - " + date);
  db.collection('lists').doc().set({
    date: date,
    hours: hours,
    username: employee,
    week: week
  });
}

function removeWork(e) {
  docid = $(e).attr('data-docid');
  db.collection('lists').doc(docid).delete();
  $(e).css('background-color', 'inherit');
  $(e).attr('data-busy', 'false');
}

function fillDates(username) {
  week = getUrlParams().week;
  daterange = getDateRangeOfWeek(week);
  $('#daterange').html('UKE: ' + week + "<br>" + $.format.date(new Date(daterange[0]), "dd-MM-yyyy") + " - " + $.format.date(new Date(daterange[1]), "dd-MM-yyyy"));
  //console.log(getDateOfWeek(week, new Date().getFullYear()));
  datesArray = getDates(new Date(daterange[0]), new Date(daterange[1]));
  $("#d_1").html($.format.date(new Date(datesArray[0]), "ddd <br> dd/MM-yyyy"));
  $("#d_2").html($.format.date(new Date(datesArray[1]), "ddd <br> dd/MM-yyyy"));
  $("#d_3").html($.format.date(new Date(datesArray[2]), "ddd <br> dd/MM-yyyy"));
  $("#d_4").html($.format.date(new Date(datesArray[3]), "ddd <br> dd/MM-yyyy"));
  $("#d_5").html($.format.date(new Date(datesArray[4]), "ddd <br> dd/MM-yyyy"));
  $("#d_6").html($.format.date(new Date(datesArray[5]), "ddd <br> dd/MM-yyyy"));

  $('#' + username + "_1").attr('data-date', $.format.date(new Date(datesArray[0]), "yyyy-MM-dd"));
  $('#' + username + "_2").attr('data-date', $.format.date(new Date(datesArray[1]), "yyyy-MM-dd"));
  $('#' + username + "_3").attr('data-date', $.format.date(new Date(datesArray[2]), "yyyy-MM-dd"));
  $('#' + username + "_4").attr('data-date', $.format.date(new Date(datesArray[3]), "yyyy-MM-dd"));
  $('#' + username + "_5").attr('data-date', $.format.date(new Date(datesArray[4]), "yyyy-MM-dd"));
  $('#' + username + "_6").attr('data-date', $.format.date(new Date(datesArray[5]), "yyyy-MM-dd"));

}


function fillColumns(username) {
  var week = getUrlParams().week;
  db.collection("lists")
    .where("week", "==", week).where("username", "==", username)
    .onSnapshot(function(snapshot) {
        snapshot.forEach(function (doc) {
            d = doc.data();
            date = new Date(d.date);
            console.log(date);
            day = date.getDay();
            $("#" + username + "_" + day).css('background-color', 'green');
            $("#" + username + "_" + day).attr('data-busy', 'true');
            $("#" + username + "_" + day).attr('data-docid', doc.id);
        });
    });
}


function weekDateToDate (year, week, day) {
  const firstDayOfYear = new Date(year, 0, 1)
  const days = 2 + day + (week - 1) * 7 - firstDayOfYear.getDay()
  return new Date(year, 0, days)
}


function getDateRangeOfWeek(weekNo){
    var d1 = new Date();
    numOfdaysPastSinceLastMonday = eval(d1.getDay()- 1);
    d1.setDate(d1.getDate() - numOfdaysPastSinceLastMonday);
    var weekNoToday = d1.getWeek();
    var weeksInTheFuture = eval( weekNo - weekNoToday );
    d1.setDate(d1.getDate() + eval( 7 * weeksInTheFuture ));
    var rangeIsFrom =  eval(d1.getMonth()+1) + "/" + d1.getDate()  + "/" + d1.getFullYear();
    var rangeIsFromDate = d1.getDate();
    d1.setDate(d1.getDate() + 5);
    var rangeIsTo = eval(d1.getMonth()+1) + "/" + d1.getDate() + "/" + d1.getFullYear() ;
    var rangeIsToDate = d1.getDate();
    var dates = [rangeIsFrom, rangeIsTo]
    return dates;

    //return rangeIsFrom + " - " + rangeIsTo;
};

Date.prototype.addDays = function(days) {
    var dat = new Date(this.valueOf())
    dat.setDate(dat.getDate() + days);
    return dat;
}

function getDates(startDate, stopDate) {
   var dateArray = new Array();
   var currentDate = startDate;
   while (currentDate <= stopDate) {
     dateArray.push(currentDate)
     currentDate = currentDate.addDays(1);
   }
   return dateArray;
 }




Date.prototype.getWeek = function() {
var onejan = new Date(this.getFullYear(),0,1);
return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
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
