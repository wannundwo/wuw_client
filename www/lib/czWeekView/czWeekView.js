'use strict';

angular.module('wuw.czWeekView', [])

.controller('czWeekViewCtrl', ['$scope', '$ionicSlideBoxDelegate', '$ionicSideMenuDelegate', '$timeout', function($scope, $ionicSlideBoxDelegate, $ionicSideMenuDelegate, $timeout) {
    var el;

    var events = $scope.events;

    $scope.$watch('events', function(newEvents, oldEvents) {
        console.log('new data');
        if (newEvents) {
            events = newEvents; 
            renderWeekView();
        }
    }, true);

    this.init = function(element, events) {
        el = angular.element(element);
        renderWeekView();
    };

    var weekViewContainer = document.getElementById('weekViewContainer');
    var dayHeadersContainer = document.getElementById('weekViewDayHeaderContainer');

    // the number of rendered days
    var days;
    
    // at which amount of minutes of the day the grid starts
    var gridStart;

    // at which amount of minutes of the day the grid ends
    var gridEnd;

    // monday in current week 
    var monday;

    // we can scale the entire view with this value
    var pixelPerMinute;

    // seperator distance (in minutes)
    var seperatorGran;

    function renderWeekView() {
        // if no events are given, abort the rendering
        if (events.length === 0) {
            return;
        }

        // initialization
        days = events.length;
        monday = getMonday(new Date());
        pixelPerMinute = 1;
        seperatorGran = 60;

        // empty all the container divs
        weekViewContainer.innerHTML = '';
        dayHeadersContainer.innerHTML = '';

        // dynamic gridStart and gridEnd
        var birds = getBirds(events);
        gridStart = getMinutesOfDay(birds.earliestBird.startTime) 
                - (getMinutesOfDay(birds.earliestBird.startTime) % 60) 
                - 60;

        gridEnd = getMinutesOfDay(birds.latestBird.endTime) 
                + (getMinutesOfDay(birds.latestBird.endTime) % 60) 
                + 60;    

        /****** Time Column ******/
        var timeColumn = document.createElement('div');
        timeColumn.setAttribute('class', 'weekViewTimeColumn');
        var timeHeader = document.createElement('div');
        timeColumn.appendChild(timeHeader);
        
        // render the hh:mm cells
        for (var i = gridStart; i < gridEnd; i += seperatorGran) {
            var minutes = i;
            var row = document.createElement('div');
            row.setAttribute('class', 'hhmmCell');
            row.style.height = seperatorGran * pixelPerMinute + 'px';
            //row.style.lineHeight = seperatorGran * pixelPerMinute + 'px';
            row.innerHTML = minutesToTime(minutes);
            timeColumn.appendChild(row);

            // full width seperators
            var fwSep = document.createElement('div');
            fwSep.className += ' weekViewFullWidthSeperator';
            fwSep.style.width = weekViewContainer.clientWidth - timeColumn.clientWidth + 'px';
            fwSep.style.height = 5 + 'px';
            fwSep.innerHTML = '';
            fwSep.style.top = (minutes * pixelPerMinute)-gridStart + 'px'
            weekViewContainer.appendChild(fwSep);

        }
        weekViewContainer.appendChild(timeColumn);
        
        // calculate some widthes
        var dayColumnsTotalWidth = weekViewContainer.clientWidth - timeColumn.clientWidth;
        var timeColumnOffsetDiv = document.createElement('div');
        timeColumnOffsetDiv.style.width = timeColumn.clientWidth +'px';
        timeColumnOffsetDiv.setAttribute('class', 'weekViewDayHeaderCell');
        dayHeadersContainer.appendChild(timeColumnOffsetDiv);
        

        /****** Day Columns ******/
        for (var d = 0; d < days; d++) {
            var currDay = moment(monday).add(d, 'days');

            // create the column for this day
            var dayColumn = document.createElement('div');
            dayColumn.setAttribute('class', 'col weekViewDayCol');
            dayColumn.style.width = Math.floor((dayColumnsTotalWidth / days)) + 'px';
            
            // render day header
            var dayHeader = document.createElement('div');
            dayHeader.innerHTML = moment(currDay).format('ddd,<br/>DD.MM');
            dayHeader.setAttribute('class', 'col weekViewDayHeaderCell');
            dayHeader.style.overflow = 'none';  
            dayHeadersContainer.appendChild(dayHeader);

            // iterate through all the events in this day, this constructs the actual 'event-boxes'
            var eventGroups = groupByOverlapping(events[d]);
            var minutesCounter = gridStart;
            for (var groupId in eventGroups) {
                var group = eventGroups[groupId];

                // construct seperators
                var emptyMinutes = getMinutesOfDay(group.firstEvent.startTime) - minutesCounter;
                var filler = getFiller(emptyMinutes);
                dayColumn.appendChild(filler);    


                // build the actual event group div
                var eventGroupMinutes = getMinutesOfDay(group.lastEvent.endTime) - getMinutesOfDay(group.firstEvent.startTime);
                var eventGroupDistance = eventGroupMinutes * pixelPerMinute;
                var eventGroupDiv = document.createElement('div');
                eventGroupDiv.style.height = eventGroupDistance + 'px';

                eventGroupDiv.className += ' weekViewGroup';

                // render the various overlapping events in the event group
                var eventsSplitter = document.createElement('div')
                eventsSplitter.className += ' row no-margin no-padding';
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
                    eventCol.style.wordWrap = 'break-word';

                    // construct preeceding fillers
                    var filler = getFiller(eventEmptyMinutes);
                    
                    // distinguish inner and outer columns
                    eventCol.setAttribute('class', 'col weekViewEventCol no-padding no-margin');    
                    if (i != group.events.length - 1) {
                        filler.className += ' weekViewEventColWithin';
                        eventCol.className += ' weekViewEventColWithin';
                    }

                    eventCol.appendChild(filler);    



                    // finally the actual event div
                    var eventDiv = document.createElement('div');
                    eventDiv.className += ' weekViewEvent';
                    eventDiv.style.height = eventMinutes * pixelPerMinute + 'px';

                    // place text inside the eventContentDiv
                    var eventContentDiv = document.createElement('div');
                    eventContentDiv.className += ' weekViewEventContent';
                    eventContentDiv.innerHTML = moment(event.startTime).format('HH:mm') + ' - ' + moment(event.endTime).format('HH:mm')
                    eventContentDiv.innerHTML += '<br>';
                    eventContentDiv.innerHTML += event.title;
                    eventDiv.appendChild(eventContentDiv);

                    // add event to the column
                    eventCol.appendChild(eventDiv);
                    eventsSplitter.appendChild(eventCol);
                }
                eventGroupDiv.appendChild(eventsSplitter);
                dayColumn.appendChild(eventGroupDiv);
                minutesCounter = getMinutesOfDay(group.lastEvent.endTime);
            }
            // construct filler till end of day
            var filler = getFiller(gridEnd-minutesCounter);
            dayColumn.appendChild(filler);    
            weekViewContainer.appendChild(dayColumn);
        }
    }

    /*
     * Returns a filler div
     */
    function getFiller(minutes) {
        var filler = document.createElement('div');
        filler.style.height = minutes * pixelPerMinute + 'px';
        filler.style.overflow = 'none';    
        filler.className += ' weekViewFiller';
        return filler;
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

        if (events.length === 0) {
            return undefined;
        }

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
            hours = '0' + hours;
        }
        if (minutes.toString().length == 1) {
            minutes = '0' + minutes;
        }
        
        return hours + ':' + minutes;
    }
}])

.directive('czWeekView', function () {
    return {
        restrict: 'E',
        controller: 'czWeekViewCtrl',
        template:
                '<div id="weekViewDayHeaderContainer" class="row no-padding no-margin"></div>' +
                '<ion-content>' +
                    '<div id="weekViewContainer" class="row no-padding no-margin">' +
                    '</div>' +
                '</ion-content>',
        transclude: true,
        scope: {
            events: '='
        },
        link: function(scope, element, attrs, czWeekViewCtrl) {
            czWeekViewCtrl.init(element[0].children[0]);
        }
    };
});
