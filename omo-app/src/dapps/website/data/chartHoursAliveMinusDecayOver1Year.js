export let chartHoursAliveMinusDecayOver1Year = {
    title: "accumulated hours you are alive, minus decay over the course of 1 year results in your total accumulated ⦿",
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
        colors: ["#9EDCBA", "#1A338D", "red",]
    },
    data: {
        labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "Mai",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Okt",
            "Nov",
            "Dez",
        ],
        datasets: [
            {
                name: "hours alive",
                chartType: "bar",
                values: [
                    720,
                    1440,
                    2160,
                    2880,
                    3600,
                    4320,
                    5040,
                    5760,
                    6480,
                    7200,
                    7920,
                    8640,
                ]
            },
            {
                name: "⦿ money supply",
                chartType: "line",
                values: [
                    720,
                    1436,
                    2147,
                    2855,
                    3558,
                    4257,
                    4953,
                    5644,
                    6331,
                    7014,
                    7693,
                    8368,
                ],
            },
            {
                name: "⦿ money decay",
                chartTyp: "line",
                values: [
                    0,
                    13,
                    25,
                    42,
                    63,
                    88,
                    118,
                    151,
                    189,
                    231,
                    277,
                    328,
                ]
            },
        ],
    },
};
