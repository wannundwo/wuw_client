"use strict";

angular.module("wuw.controllers")

.controller("LecturesWeeklyCtrl", function($scope, $locale, $ionicHistory, $translate, $ionicPopover, $state, $ionicPopup, Lectures, Settings) {

    // this list must be grouped by day and the events must be sorted!
    var events = [
        [
            {
                title: "M1",
                startTime: moment("2016-05-02T08:20:00+1000", moment.ISO_8601).toDate(),
                endTime: moment("2016-05-02T09:00:00+1000", moment.ISO_8601).toDate()
            },
            {
                title: "M1",
                startTime: moment("2016-05-02T10:00:00+1000", moment.ISO_8601).toDate(),
                endTime: moment("2016-05-02T11:00:00+1000", moment.ISO_8601).toDate()
            }
        ],
        [
            {
                title: "A1",
                startTime: moment("2016-05-03T08:30:00+1000", moment.ISO_8601).toDate(),
                endTime: moment("2016-05-03T11:30:00+1000", moment.ISO_8601).toDate()
            },
            {
                title: "A1",
                startTime: moment("2016-05-03T12:00:00+1000", moment.ISO_8601).toDate(),
                endTime: moment("2016-05-03T15:30:00+1000", moment.ISO_8601).toDate()
            },
            {
                title: "A2",
                startTime: moment("2016-05-03T12:30:00+1000", moment.ISO_8601).toDate(),
                endTime: moment("2016-05-03T14:00:00+1000", moment.ISO_8601).toDate()
            },
            {
                title: "A3",
                startTime: moment("2016-05-03T13:30:00+1000", moment.ISO_8601).toDate(),
                endTime: moment("2016-05-03T18:30:00+1000", moment.ISO_8601).toDate()
            }
        ],
        [
            {
                title: "B1",
                startTime: moment("2016-05-04T14:30:00+1000", moment.ISO_8601).toDate(),
                endTime: moment("2016-05-04T16:00:00+1000", moment.ISO_8601).toDate()
            },
            {
                title: "B2",
                startTime: moment("2016-05-04T16:00:00+1000", moment.ISO_8601).toDate(),
                endTime: moment("2016-05-04T17:00:00+1000", moment.ISO_8601).toDate()
            }
        ],
        [
            {
                title: "DO1",
                startTime: moment("2016-05-05T10:00:00+1000", moment.ISO_8601).toDate(),
                endTime: moment("2016-05-05T11:00:00+1000", moment.ISO_8601).toDate()
            }
        ],
        [
            {
                title: "F1",
                startTime: moment("2016-05-06T10:00:00+1000", moment.ISO_8601).toDate(),
                endTime: moment("2016-05-06T11:00:00+1000", moment.ISO_8601).toDate()
            },
            {
                title: "A1",
                startTime: moment("2016-05-06T12:00:00+1000", moment.ISO_8601).toDate(),
                endTime: moment("2016-05-06T13:10:00+1000", moment.ISO_8601).toDate()
            },
            {
                title: "A2",
                startTime: moment("2016-05-06T12:30:00+1000", moment.ISO_8601).toDate(),
                endTime: moment("2016-05-06T14:00:00+1000", moment.ISO_8601).toDate()
            }
        ]
    ];

    var weekViewContainer = document.getElementById("weekViewContainer");

    // the number of rendered days
    var days = 5;
    
    // at which amount of minutes of the day the grid starts
    var gridStart = 420; // 7am

    // at which amount of minutes of the day the grid ends
    var gridEnd = (24*60)-1; // 23:59

    // monday in current week 
    var monday = getMonday(new Date());

    // height of a cell
    var cellHeight = 15;
    var headerCellHeight = 0;

    // we can scale the entire view with this value
    var pixelPerMinute = 1;

    // seperator distance (in minutes)
    var seperatorGran = 60;

    var minutesInDay = 24 * 60;

    function renderWeekView(){
        // dynamic gridStart and gridEnd
        var birds = getBirds(events);
        gridStart = getMinutesOfDay(birds.earliestBird.startTime) 
                    - (getMinutesOfDay(birds.earliestBird.startTime) % 60) 
                    - 60;

        gridEnd = getMinutesOfDay(birds.latestBird.endTime) 
                    + (getMinutesOfDay(birds.latestBird.endTime) % 60) 
                    + 30;

        /****** Time Column ******/
        var timeColumn = document.createElement('div');
        timeColumn.setAttribute('class', 'weekViewTimeColumn');
        var timeHeader = document.createElement('div');
        timeHeader.innerHTML = "";
        timeColumn.appendChild(timeHeader);
        
        // render the hh:mm cells
        for (var i = gridStart; i < gridEnd; i += seperatorGran) {
            var minutes = i;
            var row = document.createElement('div');
            row.setAttribute('class', 'hhmmCell');
            row.style.height = seperatorGran * pixelPerMinute + "px";
            row.style.lineHeight = seperatorGran * pixelPerMinute + "px";
            row.innerHTML = minutesToTime(minutes);
            timeColumn.appendChild(row);
        }
        weekViewContainer.appendChild(timeColumn);
        var dayColumnsTotalWidth = weekViewContainer.clientWidth - timeColumn.clientWidth;

        /****** Day Columns ******/
        for (var d = 0; d < days; d++) {
            var currDay = moment(monday).add(d, "days");

            // create the column for this day
            var dayColumn = document.createElement('div');
            dayColumn.setAttribute('class', 'col weekViewDayCol');
            dayColumn.style.width = Math.floor((dayColumnsTotalWidth / days)) + "px";
            
            // render day header
            var dayHeader = document.createElement('div');
            dayHeader.innerHTML = moment(currDay).format("ddd,<br/>DD.MM");
            dayHeader.setAttribute('class', 'weekViewDayHeaderCell');
            dayHeader.style.height = seperatorGran / 2 + "px";
            dayHeader.style.overflow = "none";    
            dayColumn.appendChild(dayHeader);

            // iterate through all the events in this day, this constructs the actual "event-boxes"
            var eventGroups = groupByOverlapping(events[d]);
            var minutesCounter = gridStart;
            for (var groupId in eventGroups) {
                var group = eventGroups[groupId];

                // construct seperators
                var emptyMinutes = getMinutesOfDay(group.firstEvent.startTime) - minutesCounter;
                var isShiftedEventGroup = false;
                if (group.events.length > 1) {
                    // TODO: detect real shift by comparing if all event startTimes in this event group are not equal to each other
                    isShiftedEventGroup = true;
                }
                constructSeperators(minutesCounter, emptyMinutes, dayColumn, isShiftedEventGroup);

                // build the actual event group div
                var eventGroupMinutes = getMinutesOfDay(group.lastEvent.endTime) - getMinutesOfDay(group.firstEvent.startTime);
                var eventGroupDistance = eventGroupMinutes * pixelPerMinute;
                var eventGroupDiv = document.createElement('div');
                eventGroupDiv.style.height = eventGroupDistance + "px";

                eventGroupDiv.className += ' weekViewGroup';

                // render the various overlapping events in the event group
                var eventsSplitter = document.createElement('div')
                eventsSplitter.className += " row no-margin no-padding";
                for (var i = 0; i < group.events.length; i++) {
                    var event = group.events[i];
                    var groupStartMinutes = getMinutesOfDay(group.firstEvent.startTime);
                    var groupEndMinutes = getMinutesOfDay(group.lastEvent.endTime);
                    var eventStartMinutes = getMinutesOfDay(event.startTime);
                    var eventEndMinutes = getMinutesOfDay(event.endTime);
                    var eventMinutes = getMinutesOfDay(event.endTime) - getMinutesOfDay(event.startTime);
                    var minutesAfterEvent = groupEndMinutes - eventEndMinutes;
                    var eventEmptyMinutes = eventStartMinutes - groupStartMinutes;
                    var eventCol = document.createElement('div');
                    eventCol.style.wordWrap = "break-word";
                    
                    // distinguish inner and outer column
                    if (i != group.events.length - 1) {
                        eventCol.setAttribute('class', 'col weekViewEventCol weekViewEventColWithin no-padding no-margin');    
                    } else {
                        eventCol.setAttribute('class', 'col weekViewEventCol no-padding no-margin');    
                    }

                    // construct preeceding seperators
                    constructSeperators(groupStartMinutes, eventEmptyMinutes, eventCol);

                    // finally the actual event div
                    var eventDiv = document.createElement('div');
                    eventDiv.className += " weekViewEvent";
                    eventDiv.style.height = eventMinutes * pixelPerMinute + "px";

                    // place text inside the eventContentDiv
                    var eventContentDiv = document.createElement('div');
                    eventContentDiv.className += " weekViewEventContent";
                    eventContentDiv.innerHTML = moment(event.startTime).format("HH:mm") + " - " + moment(event.endTime).format("HH:mm") + "</br>EVENT TITLE";
                    eventDiv.appendChild(eventContentDiv);

                    // add event to the column
                    eventCol.appendChild(eventDiv);

                    // construct afterwards seperators
                    if (isShiftedEventGroup) {
                        constructSeperatorsAfterwards(eventEndMinutes, minutesAfterEvent, eventCol, isShiftedEventGroup);    
                    }
                    

                    eventsSplitter.appendChild(eventCol);
                }

                eventGroupDiv.appendChild(eventsSplitter);

                //eventGroupDiv.innerHTML = moment(group.firstEvent.startTime).format("HH:mm") + " - " + moment(group.firstEvent.endTime).format("HH:mm");
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
     * duration: the distance to the next event
     */
    function constructSeperators(minutesCounter, duration, column, isShiftedEventGroup) {
        // check if distance to next event is large enough for placing a seperator
        if (duration < seperatorGran) {
            // distance to next event is not large enough to place a seperator, so just place a filler
            if (isShiftedEventGroup) {
                var sepertor = getSeperator(duration);
                column.appendChild(sepertor);    
            } else {
                var filler = getFiller(duration);
                column.appendChild(filler);    
            }
            
        } else {
            // place a seperator so that we are now at a even seperatorGran
            var seperatorMinutes = (minutesCounter % seperatorGran);
            if (seperatorMinutes > 0 || minutesCounter === gridStart) {
                var seperator = getSeperator(seperatorMinutes);
                column.appendChild(seperator);
                duration = duration - seperatorMinutes;
            }

            // fill the other "full" seperators
            var neededSeperators = Math.floor(duration / seperatorGran);
            for (var s = 0; s < neededSeperators; s++) {
                var seperator = getSeperator(seperatorGran);
                
                column.appendChild(seperator);
                duration = duration - seperatorGran;
            }

            // and a possible last filler
            if (duration > 0) {
                var filler = getFiller(duration);
                column.appendChild(filler);    
            }
        }
    }

    /*
     * Constructs seperators after a event column
     * duration: the distance to the next event
     */
    function constructSeperatorsAfterwards(minutesCounter, duration, column, isShiftedEventGroup) {
        // check if distance to next event is large enough for placing a seperator
        if (duration < seperatorGran) {
            // event group ends in "duration" minutes
            var filler = getSeperator(duration);
            column.appendChild(filler);
        } else {
            // place a seperator so that we are now at a even seperatorGran
            var seperatorMinutes = seperatorGran - (minutesCounter % seperatorGran);
            if (seperatorMinutes > 0 || minutesCounter === gridStart) {
                var seperator = getSeperator(seperatorMinutes);
                column.appendChild(seperator);
                duration = duration - seperatorMinutes;
            }

            // fill the other "full" seperators
            var neededSeperators = Math.floor(duration / seperatorGran);
            for (var s = 0; s < neededSeperators; s++) {
                var seperator = getSeperator(seperatorGran);
                
                column.appendChild(seperator);
                duration = duration - seperatorGran;
            }

            // and a possible last filler
            if (duration > 0) {
                var filler = getFiller(duration);
                column.appendChild(filler);    
            }
        }
    }

    /*
     * Returns a filler div
     */
    function getFiller(minutes) {
        var filler = document.createElement('div');
        filler.style.height = minutes * pixelPerMinute + "px";
        filler.style.overflow = "none";    
        filler.className += " weekViewFiller";
        return filler;
    }

    /*
     * Returns a seperator div
     */
    function getSeperator(minutes) {
        var seperator = document.createElement('div');
        seperator.style.height = minutes * pixelPerMinute + "px";
        seperator.style.overflow = "none";    
        seperator.className += " weekViewSep";
        return seperator;
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
     * Returns the earliest and latest birds of all events.
     */
    function getBirds(events) {
        var earliestBird;
        var earliestBirdMinutes = 24*60;

        var latestBird;
        var latestBirdMinutes = 0;

        for (var i = 0; i < events.length; i++) {
            var day = events[i];
            for (var j = 0; j < day.length; j++) {
                var event = day[j];
                var eventStartMinutes = getMinutesOfDay(event.startTime);
                var eventEndMinutes = getMinutesOfDay(event.endTime);
                
                // check if this event is earlier
                if (eventStartMinutes < earliestBirdMinutes) {
                    earliestBird = event;
                    earliestBirdMinutes  = eventStartMinutes;
                }

                // check if this event is later
                if (eventEndMinutes > latestBirdMinutes) {
                    latestBird = event;
                    latestBirdMinutes = eventEndMinutes;
                }
            }
        }

        return {earliestBird: earliestBird, latestBird: latestBird};
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
