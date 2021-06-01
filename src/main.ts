import * as fs from 'fs';

const INPUT_PATH = './timetables.csv';

interface TimeTable {
    opening_day: string;
    opening_time: string;
    closing_day: string;
    closing_time: string;
}

interface ProcessedTimeTables {
    start_date: string;
    end_date: string;
    timetables: ConcatTimeTable[]
}

interface ConcatTimeTable {
    opening_datetime: string;
    closing_datetime: string;
}

function main(): void {
    const csvContent = fs.readFileSync(INPUT_PATH);

    const timeTables = parseCSV(csvContent.toString());

    console.log('**** Input ****')
    console.log(timeTables);

    const processedTimeTables = processTimeTables(timeTables);

    console.log('**** Output ****');
    console.log(processedTimeTables);
}

function parseCSV(content: string): TimeTable[] {
    const lines = content.split('\r\n').slice(1, -1);

    return lines.map((line) => {
        const columns = line.split(';');

        return {
            opening_day: columns[0],
            opening_time: columns[1],
            closing_day: columns[2],
            closing_time: columns[3]
        };
    })
}

function processTimeTables(timeTables: TimeTable[]): ProcessedTimeTables {
    const results: ProcessedTimeTables = {
        start_date: getStartDate(timeTables),
        end_date: getEndDate(timeTables),
        timetables: getConcatTimeTables(timeTables)
    };

    return results;
}

function getStartDate(timeTables: TimeTable[]): string {
    let startDate = timeTables[0].opening_day;

    for (let t of timeTables) {
        if (new Date(t.opening_day) < new Date(startDate)) {
            startDate = t.opening_day;
        }
    }

    return startDate;
}

function getEndDate(timeTables: TimeTable[]): string {
    let endDate = timeTables[0].closing_day;

    for (let t of timeTables) {
        if (new Date(t.closing_day) > new Date(endDate)) {
            endDate = t.closing_day;
        }
    }

    return endDate;
}

function getConcatTimeTables(timeTables: TimeTable[]): ConcatTimeTable[] {
    const concatTimeTables: ConcatTimeTable[] = [];

    const prevTimeTable = timeTables[0];

    let continueConcat = false;

    concatTimeTables.push({
        opening_datetime: new Date(timeTables[0].opening_day + 'T' + timeTables[0].opening_time + 'Z').toString(),
        closing_datetime: ''
    })

    for (let i = 0; i < timeTables.length; i++) {
        const timeTable = timeTables[i];

        if (timeTable.closing_time === '23:59:59' && (i + 1 < timeTables.length) && (new Date(timeTables[i+1].opening_day).getDay()) && (timeTables[i+1].opening_time === '00:00:00')) {
            continueConcat = true;
        }
    }

    return concatTimeTables;
}

main();
