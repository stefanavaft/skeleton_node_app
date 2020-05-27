require('dotenv').config({path: __dirname + '/.env'});
const fetch = require('node-fetch');
const chartjs = require('chart.js');
const moment = require('moment');
const majorApps = require('../../constants/apps');

const monthlyDynoCost = 30;
const thisMonth = moment().format('MM');
const thisYear = moment().format('yyyy');
const sixMonthsAgoMonth = moment().subtract(moment.duration(6, 'M')).month();
const sixMonthsAgoYear = moment().subtract(moment.duration(6, 'M')).year();

// Select DOM nodes
const startMonthInput = document.getElementById('startMonth')
const startYearInput = document.getElementById('startYear');
const endMonthInput = document.getElementById('endMonth');
const endYearInput = document.getElementById('endYear');
const toggleTableButton = document.getElementById('toggle-table');
const refreshButton = document.getElementById('refresh-data');
const usageTableBody = document.getElementById('usageTableBody');
const usageTable = document.getElementById('usageTable');

// Set default dates
startMonthInput.value = sixMonthsAgoMonth;
startYearInput.value = sixMonthsAgoYear;
endMonthInput.value = thisMonth;
endYearInput.value = thisYear;


const fetchData = () => {
    fetch(`${process.env.HEROKU_BASE_URL}/teams/${process.env.IP_TEAM_ID}/usage/monthly?start=${startYearInput.value}-${startMonthInput.value}&end=${endYearInput.value}-${endMonthInput.value}`, {
        method: 'GET',
        headers: { 
            'Accept': 'application/vnd.heroku+json;version=3',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 21bd8d1a-a820-4ea3-8bbc-0cc4a23b982c'
        },
    }).then((res) => res.json())
    .then((monthlyUsage) => {
        const usage = [];
        let sortedApps;
        monthlyUsage.forEach(m => {
            const { apps, month } = m;
            sortedApps = colectUsageIntoTeams({apps: apps.filter(app => app.dynos > 0)});
            usage.push({
                month,
                apps: sortedApps
            });
        });
        const usageTableStr = buildUsageTable(sortedApps);
        usageTableBody.innerHTML = usageTableStr;
        paintGraph(usage);
    }).catch((err) => {
        console.log(err);
    });
}

const colectUsageIntoTeams = ({apps,}) => {
    const usage = {};
    apps.forEach((app) => {
        const { addons, app_name, dynos } = app;
        for(const name in majorApps) {
            if(!usage[name]) {
                usage[name] = {
                    addons: 0,
                    dynos: 0,
                    name: name,
                    total: 0,
                    color: majorApps[name].color
                };
            }
            if(RegExp(majorApps[name].regex).test(app_name)) {
                usage[name].total += Math.round(dynos * monthlyDynoCost + addons);
                usage[name].dynos += dynos;
                usage[name].addons += addons;
            }
        }
    });
    return usage;
}

const buildUsageTable = (apps) => {
    let usageStr = '';
    for(const key in apps){
        const { addons, name, dynos, total } = apps[key];
        usageStr += 
        `<tr>
            <td>${name}</td>
            <td>${dynos}</td>
            <td>${addons}</td>
            <td>${total}</td>
        </tr>`;
    };
    return usageStr;
}

const paintGraph = (usageData) => {
    const labels = [];
    const data = [];
    const apps = usageData[0].apps;
    for(const key in apps) {
        const { name, color } = apps[key];
        data.push({
            borderColor: color,
            fill: false,
            label: name,
            data: []
        });
    }
    usageData.forEach((monthData) => {
        const { month, apps } = monthData;
        labels.push(month);
        for(const key in apps){
            const { name, total } = apps[key];
            data.find(o => o.label === name).data.push(total);
        };
    });

    new chartjs(document.getElementById('herokUsage'), {
        type: 'line',
        data: {
            labels,
            datasets: data,
            options: {
                title: {
                    display: true,
                    text: 'IP Heroku spend'
                }
            }
        }
    });
}

const toggleTable = () => {
    if (usageTable.style.display === "none") {
        usageTable.style.display = "table";
    } else {
        usageTable.style.display = "none";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    refreshButton.addEventListener('click', () => {
        fetchData();
    });
    toggleTableButton.addEventListener('click', () => {
        toggleTable();
    });
});

fetchData();