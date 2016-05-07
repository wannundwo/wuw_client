"use strict";

angular.module("wuw.controllers")

.controller("LecturesWeeklyCtrl", function($scope, $locale, $ionicHistory, $translate, $ionicPopover, $state, $ionicPopup, Lectures, Settings) {

    // this list must be grouped by day and the events must be sorted!
    var events = [
        [
            {
                title: "M1",
                startTime: new Date("2016-05-02T08:20:00+1000"),
                endTime: new Date("2016-05-02T09:00:00+1000")
            },
            {
                title: "M1",
                startTime: new Date("2016-05-02T10:00:00+1000"),
                endTime: new Date("2016-05-02T11:00:00+1000")
            }
        ],
        [
            {
                title: "A1",
                startTime: new Date("2016-05-03T12:00:00+1000"),
                endTime: new Date("2016-05-03T15:30:00+1000")
            },
            {
                title: "A2",
                startTime: new Date("2016-05-03T12:30:00+1000"),
                endTime: new Date("2016-05-03T14:00:00+1000")
            },
            {
                title: "A3",
                startTime: new Date("2016-05-03T14:00:00+1000"),
                endTime: new Date("2016-05-03T14:30:00+1000")
            }
        ],
        [
            {
                title: "B1",
                startTime: new Date("2016-05-04T14:30:00+1000"),
                endTime: new Date("2016-05-04T16:00:00+1000")
            },
            {
                title: "B2",
                startTime: new Date("2016-05-04T16:00:00+1000"),
                endTime: new Date("2016-05-04T17:00:00+1000")
            }
        ],
        [],
        []

    ];

    var hiddenDayEndEvent = {}

    console.log(checkOverlapp(events[0], events[1])); // should be true
    console.log(checkOverlapp(events[2], events[3])); // should be false

    var weekViewContainer = document.getElementById("weekViewContainer");

    // the number of rendered days
    var days = 5;

    // grid granularity (in minutes)
    var gridGran = 5;

    // at which amount of minutes of the day the grid starts
    var gridStart = 420; // 7am

    // at which amount of minutes of the day the grid ends
    var gridEnd = (24*60)-1; // 23:59

    // how long a intervall in the time column is (in minutes)
    var timeIntervall = 60;

    // monday in current week 
    var monday = getMonday(new Date());

    // height of a cell
    var cellHeight = 15;
    var headerCellHeight = 40;

    // we can scale the entire view with this value
    var pixelPerMinute = 1;

    // seperator distance (in minutes)
    var seperatorGran = 60;

    var minutesInDay = 24 * 60;

    var renderWeekView = function() {
        
        /****** Time Column ******/
        var timeColumn = document.createElement('div');
        timeColumn.setAttribute('class', 'weekViewTimeColumn');
        var timeHeader = document.createElement('div');
        timeHeader.innerHTML = "";
        timeHeader.style.height = headerCellHeight + "px";
        timeColumn.appendChild(timeHeader);
        
        // render the hh:mm cells
        for (var i = gridStart; i < minutesInDay; i += timeIntervall) {
            var minutes = i;
            var row = document.createElement('div');
            row.setAttribute('class', 'hhmmCell');
            row.style.height = timeIntervall * pixelPerMinute + "px";
            row.style.lineHeight = timeIntervall * pixelPerMinute + "px";
            row.innerHTML = minutesToTime(minutes);
            timeColumn.appendChild(row);
        }
        weekViewContainer.appendChild(timeColumn);

        /****** Day Columns ******/
        for (var d = 0; d < days; d++) {
            var currDay = moment(monday).add(d, "days");

            // create the column for this day
            var dayColumn = document.createElement('div');
            dayColumn.setAttribute('class', 'col weekViewDayCol');
            
            // render day header
            var dayHeader = document.createElement('div');
            dayHeader.innerHTML = moment(currDay).format("ddd, DD.MM");
            dayHeader.style.height = (headerCellHeight + seperatorGran / 2) + "px";
            dayHeader.style.overflow = "none";    
            dayColumn.appendChild(dayHeader);

            // iterate through all the events in this day, this constructs the actual "event-boxes"
            var eventGroups = groupByOverlapping(events[d]);
            var minutesCounter = gridStart;
            for (var groupId in eventGroups) {
                var group = eventGroups[groupId];

                // construct seperators
                var emptyMinutes = getMinutesOfDay(group.firstEvent.startTime) - minutesCounter;
                constructSeperators(minutesCounter, emptyMinutes, dayColumn, seperatorGran);

                // build the actual event group div
                var eventGroupMinutes = getMinutesOfDay(group.lastEvent.endTime) - getMinutesOfDay(group.firstEvent.startTime);
                var eventGroupDistance = eventGroupMinutes * pixelPerMinute;
                var eventGroupDiv = document.createElement('div');
                eventGroupDiv.style.height = eventGroupDistance + "px";
                eventGroupDiv.style.overflow = "none";    
                eventGroupDiv.className += " weekViewGroup";
                eventGroupDiv.innerHTML = moment(group.firstEvent.startTime).format("HH:mm")
                                            + " - " + moment(group.firstEvent.endTime).format("HH:mm");
                dayColumn.appendChild(eventGroupDiv);
                minutesCounter = getMinutesOfDay(group.lastEvent.endTime);

            }
            // construct seperators till end of day
            constructSeperators(minutesCounter, gridEnd - minutesCounter, dayColumn)
            weekViewContainer.appendChild(dayColumn);
        }
    }

    /*
     * Constructs seperators for a specific column.
     * emptyMinutes: the distance to the next event
     */
    function constructSeperators(minutesCounter, emptyMinutes, column) {
        // check if distance to next event is large enough for placing a seperator
        if (emptyMinutes < seperatorGran) {
            // distance to next event is not large enough to place a seperator, so just place a filler
            var filler = document.createElement('div');
            filler.style.height = emptyMinutes * pixelPerMinute + "px";
            filler.style.overflow = "none";    
            filler.className += " weekViewFiller";
            column.appendChild(filler);

        } else {
            // we need seperators
            // place seperator to next full seperatorGran
            var seperator = document.createElement('div');
            var seperatorMinutes = (minutesCounter % seperatorGran);
            if (seperatorMinutes > 0 || minutesCounter === gridStart) {
                seperator.style.height = seperatorMinutes * pixelPerMinute + "px";
                seperator.style.overflow = "none";    
                seperator.className += " weekViewSep";
                column.appendChild(seperator);
                minutesCounter += seperatorMinutes
                emptyMinutes = emptyMinutes - seperatorMinutes;
            }

            // fill the other "full" seperators
            var neededSeperators = Math.floor((emptyMinutes) / seperatorGran);
            for (var s = 0; s < neededSeperators; s++) {
                var seperator = document.createElement('div');
                seperator.style.height = seperatorGran * pixelPerMinute + "px";
                seperator.style.overflow = "none";    
                seperator.className += " weekViewSep";
                column.appendChild(seperator);
                emptyMinutes = emptyMinutes - seperatorGran;
            }

            // and a possible last filler
            var filler = document.createElement('div');
            filler.style.height = emptyMinutes * pixelPerMinute + "px";
            filler.style.overflow = "none";    
            filler.className += " weekViewFiller";
            column.appendChild(filler);
        }
    }

    /*
     * Returns how many minutes today already passed.
     * eg: a date with hour=2 and minutes=10 would return 2*60+10=130
     */
    function getMinutesOfDay(date) {
        var minutes = date.getHours() * 60;
        minutes += date.getMinutes();
        return minutes;
    }

    /*
     * Returns true if the two events overlapp each other.
     */
    function checkOverlapp(event1, event2) {
        // find earlier event
        var earlierEvent;
        var laterEvent;

        if (event1.startTime < event2.startTime) {
            earlierEvent = event1;
            laterEvent = event2;
        } else {
            earlierEvent = event2;
            laterEvent = event1;
        }

        // check for overlapp
        // Events overlapp if E2 starts between the start and end of E1
        if (laterEvent.startTime >= earlierEvent.startTime && laterEvent.startTime < earlierEvent.endTime) {
            return true;
        } else {
            return false;
        }
    }

    /*
     * Groupes overlapping events.
     */
    function groupByOverlapping(eventsArr) {
        var newOverlappId = 1;

        // assigning overlapp ids
        for (var i = 0; i < eventsArr.length; i++) {
            var event1 = eventsArr[i];
            for (var j = 0; j < eventsArr.length; j++) {
                var event2 = eventsArr[j];
                if (checkOverlapp(event1, event2)) {
                    // so these both events overlapp, assign overlapp ids
                    if (event1.overlappId) {
                        event2.overlappId = event1.overlappId
                    } else if (event2.overlappId) {
                        event1.overlappId = event2.overlappId;
                    } else {
                        event1.overlappId = newOverlappId;
                        event2.overlappId = newOverlappId;
                        newOverlappId++;
                    }
                }
            }
        }

        // grouping
        var overlappingGroups = {};
        for (var i = 0; i < eventsArr.length; i++) {
            var event = eventsArr[i];
            if (typeof overlappingGroups[event.overlappId] === 'undefined') {
                overlappingGroups[event.overlappId] = {};
                overlappingGroups[event.overlappId].events = [];
                overlappingGroups[event.overlappId].events.push(event);
                overlappingGroups[event.overlappId].firstEvent = event;
                overlappingGroups[event.overlappId].lastEvent = event;
            } else {
                overlappingGroups[event.overlappId].events.push(event);
                // check if this event is the first or last one in the group
                if (event.startTime < overlappingGroups[event.overlappId].firstEvent.startTime) {
                    overlappingGroups[event.overlappId].firstEvent = event;
                }
                if (event.endTime > overlappingGroups[event.overlappId].lastEvent.endTime) {
                    overlappingGroups[event.overlappId].lastEvent = event;
                }
            }
        }
        return overlappingGroups
    }

    /* 
     * Returns the monday of the week in d.
     */
    function getMonday(d) {
        d = new Date(d);
        var day = d.getDay();
        var diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
        return new Date(d.setDate(diff));
    }

    /*
     * Minutes into Time (hh:mm)
     */
    function minutesToTime(m) {
        var hours = Math.floor(m / 60);          
        var minutes = m % 60;
        if (hours.toString().length == 1) {
            hours = "0" + hours;
        }
        if (minutes.toString().length == 1) {
            minutes = "0" + minutes;
        }
        
        return hours + ":" + minutes;
    }

    /*
     * Navigates to the list view of the lectures and remembers this,
     * so when the user opens the lectures tab again, he will automatically
     * see the last choosen type of view.
     */
    $scope.switchToList = function() {
        Settings.setSetting("lecturesView", "lecturesList");
        $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });
        $state.go("tab.lecturesList", {location: "replace"});
    };

    renderWeekView();
});
