"use strict";
moment.locale('cs');
function parseWBS(text) {
    let lines = text.split("\n").filter(l => !l.startsWith("//") && l.trim().length > 0);
    let indentSize = 4;
    let parents = {};
    var previousLevel = -1;
    var previousId = "";
    let items = lines
        .map((l) => {
        let indent = l.length - l.trimLeft().length;
        let level = indent / indentSize;
        let parts = l.trim().split("|");
        let name = parts[0].split(":").length > 1 ? parts[0].split(":")[1] : parts[0].split(":")[0];
        let id = parts[0].split(":")[0].replace(/[ ,\(\)]/g, "");
        let parent = parents[String(level - 1)];
        parents[String(level)] = id;
        let result = {
            id: id,
            name: name,
            duration: daysToMinutes(Number((parts[1] || "0").trim())),
            level: level,
            resources: (parts[2] || "").split(",").map(r => r.trim()),
            parent: parent,
            previous: previousLevel == level ? previousId : "",
            dependsOn: (parts[3] || "").split(",").map(i => i.trim()),
            leaf: false
        };
        previousLevel = level;
        previousId = id;
        return result;
    });
    return Enumerable
        .from(items)
        .select(i => {
        i.leaf = !items.some(p => p.parent === i.id);
        i.dependsOn = Enumerable.from(i.dependsOn)
            .where(i => !!i)
            .selectMany(a => leavesOf(items, a))
            .select(a => a.id)
            .where(a => a != i.id)
            .toArray();
        return i;
    })
        .toArray();
}
function leavesOf(wbs, itemId) {
    let items = Enumerable.from(wbs);
    return items.where(i => i.leaf)
        .where(i => isDescendantOrSelf(wbs, i, items.singleOrDefault(i => i.id == itemId)))
        .toArray();
}
function isDescendantOrSelf(items, item, parent) {
    if (!item || !parent)
        return false;
    if (item.id === parent.id)
        return true;
    else
        return isDescendantOrSelf(items, Enumerable.from(items).singleOrDefault(i => i.id === item.parent), parent);
}
function getWBSItems() {
    return parseWBS(document.getElementById("wbs").innerText);
}
function renderTable(wbs, timetable) {
    let html = `<table class="confluenceTable" style="margin-top:24px">`;
    html += `<thead>
            <tr>
                <th class="confluenceTh">Name</th>
                <th class="confluenceTh">Duration</th>
                <th class="confluenceTh">Resource</th>
                <th class="confluenceTh">Start</th>
                <th class="confluenceTh">End</th>
            </tr>
        </thead>`;
    html += "<tbody>";
    for (let item of wbs) {
        html += `<tr>
                <td class="confluenceTd">${"&nbsp;".repeat(item.level * 2)}${item.name}</td>
                <td class="confluenceTd">${item.leaf ? item.duration / daysToMinutes(1) + "d" : ""}</td>
                <td class="confluenceTd">${item.leaf ? item.resources.join(", ") : ""}</td>
                <td class="confluenceTd">${item.leaf ? moment(timetable.scheduledTasks[item.id].earlyStart).format('L') : ""}</td>
                <td class="confluenceTd">${item.leaf ? moment(timetable.scheduledTasks[item.id].earlyFinish).format('L') : ""}</td>
            </tr>`;
    }
    html += `</tbody><tfoot>`;
    let totals = Enumerable
        .from(getWBSItems())
        .where(i => i.leaf)
        .selectMany(i => Enumerable.from(i.resources).select(a => (Object.assign({}, i, { resource: a }))).toArray())
        .groupBy(i => i.resource)
        .select(i => `${i.key()}: ${i.sum(i => i.duration / daysToMinutes(1))}md`)
        .toArray()
        .join(", ");
    html += `<tr>
                <td class="confluenceTd highlight-grey" colspan="5">Effort: ${totals} </td></tr>
                <td class="confluenceTd highlight-grey" colspan="5">Resources: ${document.getElementById("resources").innerText} </td></tr>
                <td class="confluenceTd highlight-grey" colspan="5">Plan: ${moment(timetable.start).format('L')} - ${moment(timetable.end).format('L')} (${(timetable.end - timetable.start) / (1000 * 60 * 60 * 24)}d)</td>
            </tfoot>`;
    html += "</table>";
    return html;
}
// GANTT CHART LOADER
function daysToMinutes(days) {
    return days * 24 * 60;
}
function daysToMiliseconds(days) {
    return days * 24 * 60 * 60 * 1000;
}
function row(taskId, taskName, dependencies, resource, percentComplete, duration, startDate, endDate) {
    return [
        taskId ? taskId : null,
        taskName ? taskName : taskId,
        resource ? resource : null,
        startDate ? startDate : null,
        endDate ? endDate : null,
        duration ? duration : null,
        percentComplete ? percentComplete : 0,
        dependencies ? dependencies.join(", ") : null
    ];
}
function gantt(elementId, rows, width) {
    google.charts.load('current', { 'packages': ['gantt'] });
    google.charts.setOnLoadCallback(function () {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Task ID');
        data.addColumn('string', 'Task Name');
        data.addColumn('string', 'Resource');
        data.addColumn('date', 'Start Date');
        data.addColumn('date', 'End Date');
        data.addColumn('number', 'Duration');
        data.addColumn('number', 'Percent Complete');
        data.addColumn('string', 'Dependencies');
        data.addRows(rows);
        var options = {
            width: width,
            height: rows.length * 42 + 42,
            gantt: {
                criticalPathEnabled: true,
                criticalPathStyle: {
                    stroke: '#e64a19',
                    strokeWidth: 5
                },
                arrow: {}
            }
        };
        var chart = new google.visualization.Gantt(document.getElementById(elementId));
        chart.draw(data, options);
        var resizeObserver = new ResizeObserver(function () {
            chart.draw(data, options);
        });
        resizeObserver.observe(document.getElementById(elementId));
    });
}
// LOADER
document.addEventListener('DOMContentLoaded', function () {
    let wbs = getWBSItems();
    try {
        let resources = Enumerable
            .from(document.getElementById("resources").innerText.split(","))
            .select(r => r.trim())
            .select(r => ({ id: r })); //available: later.parse.text('after 9:00am and before 5:00pm'),
        //resources = TA_1, TA_2, BA_1, BA_2
        //t.resources = TA, BA
        //=> [[TA_1, TA_2], [BA_1, BA_2]]
        let tasks = Enumerable
            .from(wbs)
            .where(i => i.leaf)
            .select(t => (Object.assign({}, t, { resources: Enumerable
                .from(t.resources)
                .select(r => resources.where(ar => ar.id.startsWith(r)).select(ar => ar.id).toArray()).toArray() })));
        var timetable = schedule.create(tasks.toArray(), resources.toArray(), later.parse.text('every weekday'), new Date());
        console.log(timetable);
        gantt("chart", wbs
            .filter(i => i.leaf)
            .map(i => {
            let t = timetable.scheduledTasks[i.id];
            return row(i.id, i.name, i.dependsOn, t.schedule[0].resources.join(", "), undefined, undefined, new Date(t.earlyStart), new Date(t.earlyFinish));
        }), (timetable.end - timetable.start) / 2000000);
    }
    catch (ex) {
        console.log(ex);
    }
    try {
        document.getElementById("table").innerHTML = renderTable(wbs, timetable);
    }
    catch (ex) {
        document.getElementById("table").innerText = ex;
    }
}, false);
