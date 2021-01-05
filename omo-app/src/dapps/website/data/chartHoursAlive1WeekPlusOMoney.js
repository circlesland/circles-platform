export let chartHoursAlive1WeekPlusOMoney = {
    title: "accumulated hours you are alive and the money you are harvesting over one week",
    design: {
        lineOptions: {
            regionFill: 1,
        },
        barOptions: {
            spaceRatio: 0.5,
        },
        axisOptions: {
            xIsSeries: true,
        },
        colors: ["#9EDCBA", "#1A338D"]
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
                    168,
                ],
            },
            {
                name: "⦿ money supply",
                chartType: "line",
                values: [
                    24,
                    48,
                    72,
                    96,
                    120,
                    144,
                    168,
                ],
            },
        ],
    },
};
