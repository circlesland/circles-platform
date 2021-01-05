export let chartHoursAliveMinusDecayOver10Years = {
    title: "accumulated hours you are alive, minus decay over the course of 10 years results is your total accumulated ⦿",
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
            "Year 1",
            "Year 2",
            "Year 3",
            "Year 4",
            "Year 5",
            "Year 6",
            "Year 7",
            "Year 8",
            "Year 9",
            "Year 10",
        ],
        datasets: [
            {
                name: "⦿ time alive",
                chartType: "bar",
                values: [
                    8760,
                    17520,
                    26280,
                    35040,
                    43800,
                    52560,
                    61320,
                    70080,
                    78840,
                    87600,
                ]
            },
            {
                name: "⦿ money supply",
                chartType: "line",
                values: [
                    8146,
                    16907,
                    24483,
                    31529,
                    38082,
                    44177,
                    49844,
                    55115,
                    60017,
                    64576,
                ],
            },
        ],
    },
};
