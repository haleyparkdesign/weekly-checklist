var weekdates = [];
var $weekDates = ['#monDate', '#tueDate', '#wedDate', '#thuDate', '#friDate', '#satDate', '#sunDate'];
var static = ['Get up at 9 a.m.', 'Take shower', 'go outside and get sunlight'];
var weekdayHanja = ['月', '火', '水', '木', '金', '土', '日'];
var monTasks = [];
var tueTasks = [];
var wedTasks = [];
var thuTasks = [];
var friTasks = [];
var satTasks = [];
var sunTasks = [];
var weekTasks = [monTasks, tueTasks, wedTasks, thuTasks, friTasks, satTasks, sunTasks];

function addDate() {
    var curr = new Date; // get current date
    var first = curr.getDate() - curr.getDay() + 1; // First day is the day of the month - the day of the week
    var last = first + 6; // last day is the first day + 6

    var firstday = new Date(curr.setDate(first));
    var lastday = new Date(curr.setDate(last));
    console.log(first, last, firstday, lastday);

    for (i = 0; i < 7; i++) {
        weekdates.push(firstday.getDate() + i);
        $($weekDates[i]).text(weekdates[i]);
    }

    addTodayMark();
    sundayRed();
}

addDate();

function addTodayMark() {
    var curr = new Date;
    var today = curr.getDay() - 1;
    var $todayColumn = $($weekDates[today]).closest('.column');
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

    for (i = 0; i < weekTasks.length; i++) {
        var $dayColumn = $($weekDates[i]).closest('.column');
        var tasks = $('<div class="tasks"></div>');

        for (j = 0; j < weekTasks[i].length; j++) {
            tasks.append(makeCheckbox(weekTasks[i][j]))
        }

        $dayColumn.append(tasks);
        console.log($weekDates[i] + 'appendiing tasks');
    }
}

function makeCheckbox(task) {
    var checkBox =
        '<label class="form-check-label"> <input class="form-check-input" type="checkbox" value=""> ' + task + '</label>';
    return checkBox;
}

addStaticToDaily();
addTasksToDOM();

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

    for (i = 0; i < weekdayHanja.length; i++) {
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
})

function percentage (column) {
    var $items = column.find('.done');
    console.log($items.length);
    console.log(weekTasks[whatDay(column)].length);
    return (Math.round(($items.length / weekTasks[whatDay(column)].length)*100))
}