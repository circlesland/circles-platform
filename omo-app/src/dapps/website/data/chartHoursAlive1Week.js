export let chartHoursAlive1Week = {
    title: "Accumulated hours you are alive over one week",
    design: {
        lineOptions: {
            regionFill: 1,
        },
        barOptions: {
            stacked: 1,
            spaceRatio: 0.5,
        },
        axisOptions: {
            xIsSeries: true,
        },
        colors: ["#9EDCBA"]
    },
    data: {
        labels: [
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
            "Sun",
        ],
        datasets: [
            {
                name: "hours alive",
                chartType: "bar",
                values: [
                    24,
                    48,
                    72,
                    96,
                    120,
                    144,
                    168
                ],
            }
        ],
    },
};
