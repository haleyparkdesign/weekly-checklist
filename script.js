var weekdates = [];
var weekdays = ['monDate', 'tueDate', 'wedDate', 'thuDate', 'friDate', 'satDate', 'sunDate'];
var static = ['Get up at 9 a.m.', 'Take shower', 'go outside and get sunlight'];
var weekdayHanja = ['月', '火', '水', '木', '金', '土', '日'];
var weekTasks = [[], [], [], [], [], [], []];
var endDates = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

addColumns();
addDate();
addStaticToDaily();

function addColumns() {
    for (i = 0; i < 7; i++) {
        var column = '<div class="column"> <div class="today">today</div> <div class="date" id="' + weekdays[i] + '">25</div> <div class="day">' + weekdayHanja[i] + '</div> <form class="px-4 py-3" data-id="taskForm"> <input type="text" class="form-control" placeholder="" name="text"> <button class="submit" data-id="addTaskButton">➕</button> </form><div class="tasks"></div><div class="completed"> <h3 class="percentage">0%</h3> <p>completed</p> </div></div>';
        $('.lists').append(column);
    }
}

function endDate() {
    var curr = new Date;
    var thisMonth = curr.getMonth();
    var endDate = endDates[thisMonth];
    return endDate;
}

function addDate() {
    var curr = new Date; // get current date
    var today = curr.getDay() - 1;
    if (today == -1) {
        today = 6;
    }

    var first = curr.getDate() - today; // First day is the day of the month - the day of the week
    var last = first + 6; // last day is the first day + 6

    var firstday = new Date(curr.setDate(first));
    var lastday = new Date(curr.setDate(last));
    console.log(first, last, firstday, lastday);

    for (i = 0; i < 7; i++) {
        weekdates.push(firstday.getDate() + i);
    }

    var j = 1;
    for (i = 0; i < weekdates.length; i++) {
        if (weekdates[i] > endDate()) {
            weekdates[i] = j;
            j++;
        }
    }

    for (i = 0; i < 7; i++) {
        $('#' + weekdays[i]).text(weekdates[i]);
    }

    addTodayMark(today);
    sundayRed();
}

function addTodayMark(today) {
    console.log(today);
    var $todayColumn = $('#' + weekdays[today]).closest('.column');
    var $todayIndicator = $todayColumn.find('.today');
    console.log($todayColumn);
    $todayIndicator.css("visibility", "visible");
}

function sundayRed() {
    $('#sunDate').css("color", "#f12029");
    var sunday = $('#sunDate').closest('.column');
    var sundayDay = sunday.find('.day')
    sundayDay.css("color", "#f12029");
}

function addStaticToDaily() {
    for (i = 0; i < weekTasks.length; i++) {
        for (j = 0; j < static.length; j++) {
            weekTasks[i].push(static[j]);
        }
    }
    console.log(weekTasks);
}

function addTasksToDOM() {
    $('.tasks').empty();
    for (i = 0; i < 7; i++) {
        var $dayColumn = $('#' + weekdays[i]).closest('.column');
        var $tasks = $dayColumn.find('.tasks');

        for (j = 0; j < weekTasks[i].length; j++) {
            $tasks.append(makeCheckbox(weekTasks[i][j]));

        }
        console.log('#' + weekdays[i] + 'appendiing tasks');
    }
}

function makeCheckbox(task) {
    var checkBox =
        '<label class="form-check-label"> <input class="form-check-input" type="checkbox" value=""> ' + task + '<Button class="delete" data-id="delete">✖️</button></label>';
    return checkBox;
}

$(document).on('click', '.load', function () {
    if (localStorage.length === 0) {
        addTasksToDOM();
    } else {
        weekTasks = JSON.parse(localStorage.getItem("myTasks"));
        addTasksToDOM();
        return weekTasks;
    }
})

$(document).on('change', '.form-check-input', function () {
    var theLabel = $(this).closest('.form-check-label');
    // this function will get executed every time the #home element is clicked (or tab-spacebar changed)
    if ($(this).is(":checked")) {
        theLabel.addClass('done');
    } else {
        theLabel.removeClass('done');
    }
    var thisColumn = $(this).closest('.column');
    thisColumn.find('.percentage').text(percentage(thisColumn) + '%');
})

function whatDay(column) {
    var $whatDay = column.find('.day');
    var dayHanja = $whatDay.text();
    console.log($whatDay);

    for (i = 0; i < 7; i++) {
        if (dayHanja === weekdayHanja[i]) {
            return i;
        }
    }
}

$(document).on('click', '[data-id="addTaskButton"]', function () {
    event.preventDefault();
    var data = {};
    var $dayColumn = $(this).closest('.column');
    var theTaskForm = $dayColumn.find('[data-id="taskForm"]');

    theTaskForm.serializeArray().forEach(function (item) {
        var addedTask = '' + item.value + '';
        console.log('added task is' + item.value);
        weekTasks[whatDay($dayColumn)].push(addedTask);
        console.log(weekTasks[whatDay($dayColumn)]);
    });

    var taskDOM = makeCheckbox(weekTasks[whatDay($dayColumn)][weekTasks[whatDay($dayColumn)].length - 1]);

    $dayColumn.find('.tasks').append(taskDOM);
    localStorage.setItem('myTasks', JSON.stringify(weekTasks));
    $('[data-id="taskForm"]')[0].reset();
})

function percentage(column) {
    var $items = column.find('.done');
    console.log($items.length);
    console.log(weekTasks[whatDay(column)].length);
    return (Math.round(($items.length / weekTasks[whatDay(column)].length) * 100))
}

$(document).on('click', '[data-id="delete"]', function () {
    var $dayColumn = $(this).closest('.column');
    var theTask = $(this).closest('.form-check-label');
    console.log(whatDay($dayColumn));
    console.log(weekTasks[whatDay($dayColumn)]);
    var taskString = theTask.text().replace('✖️', '');
    taskString = taskString.replace('  ', '');
    console.log(taskString);
    removeItem(weekTasks[whatDay($dayColumn)], taskString);
    theTask.remove();
    localStorage.setItem('myTasks', JSON.stringify(weekTasks));
})

function removeItem(array, item) {
    for (var i in array) {
        if (array[i] == item) {
            array.splice(i, 1);
            break;
        }
    }
}
