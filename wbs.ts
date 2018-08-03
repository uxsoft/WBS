moment.locale('cs')

declare namespace Enumerable
{
    export var Utils: {
        createLambda(expression: any): (...params: any[]) => any;
        createEnumerable<T>(getEnumerator: () => IEnumerator<T>): IEnumerable<T>;
        createEnumerator<T>(initialize: () => void, tryGetNext: () => boolean, dispose: () => void): IEnumerator<T>;
        extendTo(type: any): void;
    };
    export function choice<T>(...params: T[]): IEnumerable<T>;
    export function cycle<T>(...params: T[]): IEnumerable<T>;
    export function empty<T>(): IEnumerable<T>;
    export function from(): IEnumerable<any>; // empty
    export function from<T>(obj: IEnumerable<T>): IEnumerable<T>;
    export function from(obj: number): IEnumerable<number>;
    export function from(obj: boolean): IEnumerable<boolean>;
    export function from(obj: string): IEnumerable<string>;
    export function from<T>(obj: T[]): IEnumerable<T>;
    export function from<T>(obj: { length: number;[x: number]: T; }): IEnumerable<T>;
    export function from(obj: any): IEnumerable<{ key: string; value: any }>;
    export function make<T>(element: T): IEnumerable<T>;
    export function matches<T>(input: string, pattern: RegExp): IEnumerable<T>;
    export function matches<T>(input: string, pattern: string, flags?: string): IEnumerable<T>;
    export function range(start: number, count: number, step?: number): IEnumerable<number>;
    export function rangeDown(start: number, count: number, step?: number): IEnumerable<number>;
    export function rangeTo(start: number, to: number, step?: number): IEnumerable<number>;
    export function repeat<T>(element: T, count?: number): IEnumerable<T>;
    export function repeatWithFinalize<T>(initializer: () => T, finalizer: (element: T) => void): IEnumerable<T>;
    export function generate<T>(func: () => T, count?: number): IEnumerable<T>;
    export function toInfinity(start?: number, step?: number): IEnumerable<number>;
    export function toNegativeInfinity(start?: number, step?: number): IEnumerable<number>;
    export function unfold<T>(seed: T, func: (value: T) => T): IEnumerable<T>;
    export function defer<T>(enumerableFactory: () => IEnumerable<T>): IEnumerable<T>;

    export interface IEnumerable<T>
    {
        constructor(getEnumerator: () => IEnumerator<T>): IEnumerable<T>;
        getEnumerator(): IEnumerator<T>;

        // Extension Methods
        traverseBreadthFirst(childrenSelector: (element: T) => IEnumerable<T>): IEnumerable<T>;
        traverseBreadthFirst<TResult>(childrenSelector: (element: T) => IEnumerable<T>, resultSelector: (element: T, nestLevel: number) => TResult): IEnumerable<TResult>;
        traverseDepthFirst<TResult>(childrenSelector: (element: T) => IEnumerable<T>): IEnumerable<T>;
        traverseDepthFirst<TResult>(childrenSelector: (element: T) => IEnumerable<T>, resultSelector?: (element: T, nestLevel: number) => TResult): IEnumerable<TResult>;
        flatten(): IEnumerable<any>;
        pairwise<TResult>(selector: (prev: T, current: T) => TResult): IEnumerable<TResult>;
        scan(func: (prev: T, current: T) => T): IEnumerable<T>;
        scan<TAccumulate>(seed: TAccumulate, func: (prev: TAccumulate, current: T) => TAccumulate): IEnumerable<TAccumulate>;
        select<TResult>(selector: (element: T, index: number) => TResult): IEnumerable<TResult>;
        selectMany<TOther>(collectionSelector: (element: T, index: number) => IEnumerable<TOther>): IEnumerable<TOther>;
        selectMany<TCollection, TResult>(collectionSelector: (element: T, index: number) => IEnumerable<TCollection>, resultSelector: (outer: T, inner: TCollection) => TResult): IEnumerable<TResult>;
        selectMany<TOther>(collectionSelector: (element: T, index: number) => TOther[]): IEnumerable<TOther>;
        selectMany<TCollection, TResult>(collectionSelector: (element: T, index: number) => TCollection[], resultSelector: (outer: T, inner: TCollection) => TResult): IEnumerable<TResult>;
        selectMany<TOther>(collectionSelector: (element: T, index: number) => { length: number;[x: number]: TOther; }): IEnumerable<TOther>;
        selectMany<TCollection, TResult>(collectionSelector: (element: T, index: number) => { length: number;[x: number]: TCollection; }, resultSelector: (outer: T, inner: TCollection) => TResult): IEnumerable<TResult>;
        where(predicate: (element: T, index: number) => boolean): IEnumerable<T>;
        choose(selector: (element: T, index: number) => T): IEnumerable<T>;
        ofType<TResult>(type: any): IEnumerable<TResult>;
        zip<TResult>(second: IEnumerable<T>, resultSelector: (first: T, second: T, index: number) => TResult): IEnumerable<TResult>;
        zip<TResult>(second: { length: number;[x: number]: T; }, resultSelector: (first: T, second: T, index: number) => TResult): IEnumerable<TResult>;
        zip<TResult>(second: T[], resultSelector: (first: T, second: T, index: number) => TResult): IEnumerable<TResult>;
        zip<TResult>(...params: any[]): IEnumerable<TResult>; // last one is selector
        merge<TResult>(...params: IEnumerable<T>[]): IEnumerable<T>;
        merge<TResult>(...params: { length: number;[x: number]: T; }[]): IEnumerable<T>;
        merge<TResult>(...params: T[][]): IEnumerable<T>;
        join<TInner, TKey, TResult>(inner: IEnumerable<TInner>, outerKeySelector: (outer: T) => TKey, innerKeySelector: (inner: TInner) => TKey, resultSelector: (outer: T, inner: TInner) => TResult, compareSelector?: (obj: T) => TKey): IEnumerable<TResult>;
        join<TInner, TKey, TResult>(inner: { length: number;[x: number]: TInner; }, outerKeySelector: (outer: T) => TKey, innerKeySelector: (inner: TInner) => TKey, resultSelector: (outer: T, inner: TInner) => TResult, compareSelector?: (obj: T) => TKey): IEnumerable<TResult>;
        join<TInner, TKey, TResult>(inner: TInner[], outerKeySelector: (outer: T) => TKey, innerKeySelector: (inner: TInner) => TKey, resultSelector: (outer: T, inner: TInner) => TResult, compareSelector?: (obj: T) => TKey): IEnumerable<TResult>;
        groupJoin<TInner, TKey, TResult>(inner: IEnumerable<TInner>, outerKeySelector: (outer: T) => TKey, innerKeySelector: (inner: TInner) => TKey, resultSelector: (outer: T, inner: IEnumerable<TInner>) => TResult, compareSelector?: (obj: T) => TKey): IEnumerable<TResult>;
        groupJoin<TInner, TKey, TResult>(inner: { length: number;[x: number]: TInner; }, outerKeySelector: (outer: T) => TKey, innerKeySelector: (inner: TInner) => TKey, resultSelector: (outer: T, inner: IEnumerable<TInner>) => TResult, compareSelector?: (obj: T) => TKey): IEnumerable<TResult>;
        groupJoin<TInner, TKey, TResult>(inner: TInner[], outerKeySelector: (outer: T) => TKey, innerKeySelector: (inner: TInner) => TKey, resultSelector: (outer: T, inner: IEnumerable<TInner>) => TResult, compareSelector?: (obj: T) => TKey): IEnumerable<TResult>;
        all(predicate: (element: T) => boolean): boolean;
        any(predicate?: (element: T) => boolean): boolean;
        isEmpty(): boolean;
        concat(...sequences: IEnumerable<T>[]): IEnumerable<T>;
        concat(...sequences: { length: number;[x: number]: T; }[]): IEnumerable<T>;
        concat(...sequences: T[]): IEnumerable<T>;
        insert(index: number, second: IEnumerable<T>): IEnumerable<T>;
        insert(index: number, second: { length: number;[x: number]: T; }): IEnumerable<T>;
        alternate(alternateValue: T): IEnumerable<T>;
        alternate(alternateSequence: { length: number;[x: number]: T; }): IEnumerable<T>;
        alternate(alternateSequence: IEnumerable<T>): IEnumerable<T>;
        alternate(alternateSequence: T[]): IEnumerable<T>;
        contains(value: T): boolean;
        contains<TCompare>(value: T, compareSelector?: (element: T) => TCompare): boolean;
        defaultIfEmpty(defaultValue?: T): IEnumerable<T>;
        distinct(): IEnumerable<T>;
        distinct<TCompare>(compareSelector: (element: T) => TCompare): IEnumerable<T>;
        distinctUntilChanged(): IEnumerable<T>;
        distinctUntilChanged<TCompare>(compareSelector: (element: T) => TCompare): IEnumerable<T>;
        except(second: { length: number;[x: number]: T; }): IEnumerable<T>;
        except<TCompare>(second: { length: number;[x: number]: T; }, compareSelector: (element: T) => TCompare): IEnumerable<T>;
        except(second: IEnumerable<T>): IEnumerable<T>;
        except<TCompare>(second: IEnumerable<T>, compareSelector: (element: T) => TCompare): IEnumerable<T>;
        except(second: T[]): IEnumerable<T>;
        except<TCompare>(second: T[], compareSelector: (element: T) => TCompare): IEnumerable<T>;
        intersect(second: { length: number;[x: number]: T; }): IEnumerable<T>;
        intersect<TCompare>(second: { length: number;[x: number]: T; }, compareSelector: (element: T) => TCompare): IEnumerable<T>;
        intersect(second: IEnumerable<T>): IEnumerable<T>;
        intersect<TCompare>(second: IEnumerable<T>, compareSelector: (element: T) => TCompare): IEnumerable<T>;
        intersect(second: T[]): IEnumerable<T>;
        intersect<TCompare>(second: T[], compareSelector: (element: T) => TCompare): IEnumerable<T>;
        union(second: { length: number;[x: number]: T; }): IEnumerable<T>;
        union<TCompare>(second: { length: number;[x: number]: T; }, compareSelector: (element: T) => TCompare): IEnumerable<T>;
        union(second: IEnumerable<T>): IEnumerable<T>;
        union<TCompare>(second: IEnumerable<T>, compareSelector: (element: T) => TCompare): IEnumerable<T>;
        union(second: T[]): IEnumerable<T>;
        union<TCompare>(second: T[], compareSelector: (element: T) => TCompare): IEnumerable<T>;
        sequenceEqual(second: { length: number;[x: number]: T; }): boolean;
        sequenceEqual<TCompare>(second: { length: number;[x: number]: T; }, compareSelector: (element: T) => TCompare): boolean;
        sequenceEqual(second: IEnumerable<T>): boolean;
        sequenceEqual<TCompare>(second: IEnumerable<T>, compareSelector: (element: T) => TCompare): boolean;
        sequenceEqual(second: T[]): boolean;
        sequenceEqual<TCompare>(second: T[], compareSelector: (element: T) => TCompare): boolean;
        orderBy<TKey>(keySelector: (element: T) => TKey): IOrderedEnumerable<T>;
        orderByDescending<TKey>(keySelector: (element: T) => TKey): IOrderedEnumerable<T>;
        reverse(): IEnumerable<T>;
        shuffle(): IEnumerable<T>;
        weightedSample(weightSelector: (element: T) => number): IEnumerable<T>;
        groupBy<TKey>(keySelector: (element: T) => TKey): IEnumerable<IGrouping<TKey, T>>;
        groupBy<TKey, TElement>(keySelector: (element: T) => TKey, elementSelector: (element: T) => TElement): IEnumerable<IGrouping<TKey, TElement>>;
        groupBy<TKey, TElement, TResult>(keySelector: (element: T) => TKey, elementSelector: (element: T) => TElement, resultSelector: (key: TKey, element: IEnumerable<TElement>) => TResult): IEnumerable<TResult>;
        groupBy<TKey, TElement, TResult, TCompare>(keySelector: (element: T) => TKey, elementSelector: (element: T) => TElement, resultSelector: (key: TKey, element: IEnumerable<TElement>) => TResult, compareSelector: (element: T) => TCompare): IEnumerable<TResult>;
        // :IEnumerable<IGrouping<TKey, T>>
        partitionBy<TKey>(keySelector: (element: T) => TKey): IEnumerable<IGrouping<TKey, any>>;
        // :IEnumerable<IGrouping<TKey, TElement>>
        partitionBy<TKey, TElement>(keySelector: (element: T) => TKey, elementSelector: (element: T) => TElement): IEnumerable<IGrouping<TKey, TElement>>;
        partitionBy<TKey, TElement, TResult>(keySelector: (element: T) => TKey, elementSelector: (element: T) => TElement, resultSelector: (key: TKey, element: IEnumerable<TElement>) => TResult): IEnumerable<TResult>;
        partitionBy<TKey, TElement, TResult, TCompare>(keySelector: (element: T) => TKey, elementSelector: (element: T) => TElement, resultSelector: (key: TKey, element: IEnumerable<TElement>) => TResult, compareSelector: (element: T) => TCompare): IEnumerable<TResult>;
        buffer(count: number): IEnumerable<T>;
        aggregate(func: (prev: T, current: T) => T): T;
        aggregate<TAccumulate>(seed: TAccumulate, func: (prev: TAccumulate, current: T) => TAccumulate): TAccumulate;
        aggregate<TAccumulate, TResult>(seed: TAccumulate, func: (prev: TAccumulate, current: T) => TAccumulate, resultSelector: (last: TAccumulate) => TResult): TResult;
        average(selector?: (element: T) => number): number;
        count(predicate?: (element: T, index: number) => boolean): number;
        max(selector?: (element: T) => number): number;
        min(selector?: (element: T) => number): number;
        maxBy<TKey>(keySelector: (element: T) => TKey): T;
        minBy<TKey>(keySelector: (element: T) => TKey): T;
        sum(selector?: (element: T) => number): number;
        elementAt(index: number): T;
        elementAtOrDefault(index: number, defaultValue?: T): T;
        first(predicate?: (element: T, index: number) => boolean): T;
        firstOrDefault(predicate?: (element: T, index: number) => boolean, defaultValue?: T): T;
        last(predicate?: (element: T, index: number) => boolean): T;
        lastOrDefault(predicate?: (element: T, index: number) => boolean, defaultValue?: T): T;
        single(predicate?: (element: T, index: number) => boolean): T;
        singleOrDefault(predicate?: (element: T, index: number) => boolean, defaultValue?: T): T;
        skip(count: number): IEnumerable<T>;
        skipWhile(predicate: (element: T, index: number) => boolean): IEnumerable<T>;
        take(count: number): IEnumerable<T>;
        takeWhile(predicate: (element: T, index: number) => boolean): IEnumerable<T>;
        takeExceptLast(count?: number): IEnumerable<T>;
        takeFromLast(count: number): IEnumerable<T>;
        indexOf(item: T): number;
        indexOf(predicate: (element: T, index: number) => boolean): number;
        lastIndexOf(item: T): number;
        lastIndexOf(predicate: (element: T, index: number) => boolean): number;
        asEnumerable(): IEnumerable<T>;
        cast<TResult>(): IEnumerable<TResult>;
        toArray(): T[];
        toLookup<TKey>(keySelector: (element: T) => TKey): ILookup<TKey, T>;
        toLookup<TKey, TElement>(keySelector: (element: T) => TKey, elementSelector: (element: T) => TElement): ILookup<TKey, TElement>;
        toLookup<TKey, TElement, TCompare>(keySelector: (element: T) => TKey, elementSelector: (element: T) => TElement, compareSelector: (key: TKey) => TCompare): ILookup<TKey, TElement>;
        toObject(keySelector: (element: T) => any, elementSelector?: (element: T) => any): Object;
        // :IDictionary<TKey, T>
        toDictionary<TKey>(keySelector: (element: T) => TKey): IDictionary<TKey, any>;
        toDictionary<TKey, TValue>(keySelector: (element: T) => TKey, elementSelector: (element: T) => TValue): IDictionary<TKey, TValue>;
        toDictionary<TKey, TValue, TCompare>(keySelector: (element: T) => TKey, elementSelector: (element: T) => TValue, compareSelector: (key: TKey) => TCompare): IDictionary<TKey, TValue>;
        toJSONString(replacer: (key: string, value: any) => any): string;
        toJSONString(replacer: any[]): string;
        toJSONString(replacer: (key: string, value: any) => any, space: any): string;
        toJSONString(replacer: any[], space: any): string;
        toJoinedString(separator?: string): string;
        toJoinedString<TResult>(separator: string, selector: (element: T, index: number) => TResult): string;
        doAction(action: (element: T, index: number) => void): IEnumerable<T>;
        doAction(action: (element: T, index: number) => boolean): IEnumerable<T>;
        forEach(action: (element: T, index: number) => void): void;
        forEach(action: (element: T, index: number) => boolean): void;
        write(separator?: string): void;
        write<TResult>(separator: string, selector: (element: T) => TResult): void;
        writeLine(): void;
        writeLine<TResult>(selector: (element: T) => TResult): void;
        force(): void;
        letBind<TResult>(func: (source: IEnumerable<T>) => { length: number;[x: number]: TResult; }): IEnumerable<TResult>;
        letBind<TResult>(func: (source: IEnumerable<T>) => TResult[]): IEnumerable<TResult>;
        letBind<TResult>(func: (source: IEnumerable<T>) => IEnumerable<TResult>): IEnumerable<TResult>;
        share(): IDisposableEnumerable<T>;
        memoize(): IDisposableEnumerable<T>;
        catchError(handler: (exception: any) => void): IEnumerable<T>;
        finallyAction(finallyAction: () => void): IEnumerable<T>;
        log(): IEnumerable<T>;
        log<TValue>(selector: (element: T) => TValue): IEnumerable<T>;
        trace(message?: string): IEnumerable<T>;
        trace<TValue>(message: string, selector: (element: T) => TValue): IEnumerable<T>;
    }

    export interface IEnumerator<T>
    {
        current(): T;
        moveNext(): boolean;
        dispose(): void;
    }

    export interface IOrderedEnumerable<T> extends IEnumerable<T>
    {
        createOrderedEnumerable<TKey>(keySelector: (element: T) => TKey, descending: boolean): IOrderedEnumerable<T>;
        thenBy<TKey>(keySelector: (element: T) => TKey): IOrderedEnumerable<T>;
        thenByDescending<TKey>(keySelector: (element: T) => TKey): IOrderedEnumerable<T>;
    }

    export interface IDisposableEnumerable<T> extends IEnumerable<T>
    {
        dispose(): void;
    }

    export interface IDictionary<TKey, TValue>
    {
        add(key: TKey, value: TValue): void;
        get(key: TKey): TValue;
        set(key: TKey, value: TValue): boolean;
        contains(key: TKey): boolean;
        clear(): void;
        remove(key: TKey): void;
        count(): number;
        toEnumerable(): IEnumerable<{ key: TKey; value: TValue }>;
    }

    export interface ILookup<TKey, TElement>
    {
        count(): number;
        get(key: TKey): IEnumerable<TElement>;
        contains(key: TKey): boolean;
        toEnumerable(): IEnumerable<IGrouping<TKey, TElement>>;
    }

    export interface IGrouping<TKey, TElement> extends IEnumerable<TElement>
    {
        key(): TKey;
        getSource(): TElement[];
    }
}

interface WBSItem
{
    id: string
    name: string
    level: number
    duration: number
    leaf: boolean
    parent: string
    resources: string[]
    dependsOn: string[]
}

function parseWBS(text: string): WBSItem[]
{
    let lines = text.split("\n").filter(l => !l.startsWith("//") && l.trim().length > 0)
    let indentSize = 4
    let parents: { [key: string]: string } = {}
    var previousLevel = -1
    var previousId = ""

    let items: WBSItem[] = lines
        .map((l) =>
        {
            let indent = l.length - l.trimLeft().length
            let level = indent / indentSize
            let parts = l.trim().split("|")
            let name = parts[0].split(":").length > 1 ? parts[0].split(":")[1] : parts[0].split(":")[0]
            let id = parts[0].split(":")[0].replace(/[ ,\(\)]/g, "")


            let parent = parents[String(level - 1)]
            parents[String(level)] = id


            let result = <WBSItem>{
                id: id,
                name: name,
                duration: daysToMinutes(Number((parts[1] || "0").trim())),
                level: level,
                resources: (parts[2] || "").split(",").map(r => r.trim()),
                parent: parent,
                previous: previousLevel == level ? previousId : "",
                dependsOn: (parts[3] || "").split(",").map(i => i.trim()),
                leaf: false
            }

            previousLevel = level
            previousId = id
            return result;
        })

    return Enumerable
        .from(items)
        .select(i =>
        {
            i.leaf = !items.some(p => p.parent === i.id)

            i.dependsOn = Enumerable.from(i.dependsOn)
                .where(i => !!i)
                .selectMany(a => leavesOf(items, a))
                .select(a => a.id)
                .where(a => a != i.id)
                .toArray()

            return i;
        })

        .toArray();
}

function leavesOf(wbs: WBSItem[], itemId: string)
{
    let items = Enumerable.from(wbs)

    return items.where(i => i.leaf)
        .where(i => isDescendantOrSelf(wbs, i, items.singleOrDefault(i => i.id == itemId)))
        .toArray()
}

function isDescendantOrSelf(items: WBSItem[], item: WBSItem, parent: WBSItem): boolean
{
    if (!item || !parent)
        return false;

    if (item.id === parent.id)
        return true;

    else return isDescendantOrSelf(items, Enumerable.from(items).singleOrDefault(i => i.id === item.parent), parent)
}

function getWBSItems(): WBSItem[]
{
    return parseWBS(document.getElementById("wbs")!.innerText)
}

function renderTable(wbs: WBSItem[], timetable: any)
{
    let html = `<table class="confluenceTable" style="margin-top:24px">`
    html += `<thead>
            <tr>
                <th class="confluenceTh">Name</th>
                <th class="confluenceTh">Duration</th>
                <th class="confluenceTh">Resource</th>
                <th class="confluenceTh">Start</th>
                <th class="confluenceTh">End</th>
            </tr>
        </thead>`
    html += "<tbody>"
    for (let item of wbs)
    {
        html += `<tr>
                <td class="confluenceTd">${"&nbsp;".repeat(item.level * 2)}${item.name}</td>
                <td class="confluenceTd">${item.leaf ? item.duration / daysToMinutes(1) + "d" : ""}</td>
                <td class="confluenceTd">${item.leaf ? item.resources.join(", ") : ""}</td>
                <td class="confluenceTd">${item.leaf ? moment(timetable.scheduledTasks[item.id].earlyStart).format('L') : ""}</td>
                <td class="confluenceTd">${item.leaf ? moment(timetable.scheduledTasks[item.id].earlyFinish).format('L') : ""}</td>
            </tr>`
    }
    html += `</tbody><tfoot>`
    let totals = Enumerable
        .from(getWBSItems())
        .where(i => i.leaf)
        .selectMany(i => Enumerable.from(i.resources).select(a => ({ ...i, resource: a })).toArray())
        .groupBy(i => i.resource)
        .select(i => `${i.key()}: ${i.sum(i => i.duration / daysToMinutes(1))}md`)
        .toArray()
        .join(", ")
    html += `<tr>
                <td class="confluenceTd highlight-grey" colspan="5">Effort: ${totals} </td></tr>
                <td class="confluenceTd highlight-grey" colspan="5">Resources: ${document.getElementById("resources")!.innerText} </td></tr>
                <td class="confluenceTd highlight-grey" colspan="5">Plan: ${moment(timetable.start).format('L')} - ${moment(timetable.end).format('L')} (${(timetable.end - timetable.start) / (1000 * 60 * 60 * 24)}d)</td>
            </tfoot>`
    html += "</table>"
    return html
}

// GANTT CHART LOADER
function daysToMinutes(days: number)
{
    return days * 24 * 60;
}

function daysToMiliseconds(days: number)
{
    return days * 24 * 60 * 60 * 1000;
}

function row(taskId: string, taskName: string, dependencies: string[], resource: string, percentComplete?: number, duration?: number, startDate?: Date, endDate?: Date)
{
    return [
        taskId ? taskId : null,
        taskName ? taskName : taskId,
        resource ? resource : null,
        startDate ? startDate : null,
        endDate ? endDate : null,
        duration ? duration : null,
        percentComplete ? percentComplete : 0,
        dependencies ? dependencies.join(", ") : null
    ]
}

function gantt(elementId: string, rows: any[], width: number)
{

    google.charts.load('current', { 'packages': ['gantt'] });
    google.charts.setOnLoadCallback(function ()
    {
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
                arrow: {

                }
            }
        };

        var chart = new google.visualization.Gantt(document.getElementById(elementId));
        chart.draw(data, options);

        var resizeObserver = new ResizeObserver(function ()
        {
            chart.draw(data, options);
        });
        resizeObserver.observe(document.getElementById(elementId));
    });
}

// LOADER
document.addEventListener('DOMContentLoaded', function ()
{
    let wbs = getWBSItems()
    try
    {
        let resources = Enumerable
            .from(document.getElementById("resources")!.innerText.split(","))
            .select(r => r.trim())
            .select(r => ({ id: r }))//available: later.parse.text('after 9:00am and before 5:00pm'),


        //resources = TA_1, TA_2, BA_1, BA_2
        //t.resources = TA, BA
        //=> [[TA_1, TA_2], [BA_1, BA_2]]
        let tasks = Enumerable
            .from(wbs)
            .where(i => i.leaf)
            .select(t => ({
                ...t,
                resources: Enumerable
                    .from(t.resources)
                    .select(r => resources.where(ar => ar.id.startsWith(r)).select(ar => ar.id).toArray()).toArray()
            }))

        var timetable = schedule.create(tasks.toArray(), resources.toArray(), later.parse.text('every weekday'), new Date())
        console.log(timetable)

        gantt(
            "chart",
            wbs
                .filter(i => i.leaf)
                .map(i =>
                {
                    let t = timetable.scheduledTasks[i.id]
                    return row(i.id, i.name, i.dependsOn, t.schedule[0].resources.join(", "), undefined, undefined, new Date(t.earlyStart), new Date(t.earlyFinish))
                }),
            (timetable.end - timetable.start) / 2000000
        )
    }
    catch (ex)
    {
        console.log(ex)
    }

    try
    {
        document.getElementById("table")!.innerHTML = renderTable(wbs, timetable)
    }
    catch (ex)
    {
        document.getElementById("table")!.innerText = ex
    }
}, false);