$(function () {

    buildRamChart()
    buildCpuChart()
    buildGpuChart()


    channel.bind('client-pcinfos-load',function (data) {
        pcInfo = data.pcInfo;

        Ramoption.series[0].data[0].value = (pcInfo.memoryRam).toFixed(2) - 0;
        ramChart.setOption(Ramoption, true);

        CpuOption.series[0].data[0].value = ( pcInfo.CpuUsage ).toFixed(2) - 0;
        cpuChart.setOption(CpuOption, true);

        GpuOption.series[0].data[0].value = ( pcInfo.GpuTemperature ).toFixed(2) - 0;
        GpuChart.setOption(GpuOption, true);

        $("#totalRam").text(bytesToSize(pcInfo.TotalRam))
        $("#cpuName").text(pcInfo.CpuName)
        $("#gpuName").text(pcInfo.GpuName);

    })

})

function bytesToSize(bytes) {
    var sizes = ['Bytes', 'GB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

function buildRamChart() {
    // based on prepared DOM, initialize echarts instance
    var chartDom = document.getElementById('ram');
     ramChart = echarts.init(chartDom);

    Ramoption = {
        series: [{
            type: 'gauge',
            startAngle: 180,
            endAngle: 0,
            min: 0,
            max: 100,
            splitNumber: 10,
            itemStyle: {
                color: '#58D9F9',
                shadowColor: 'rgba(0,138,255,0.45)',
                shadowBlur: 10,
                shadowOffsetX: 2,
                shadowOffsetY: 2
            },
            progress: {
                show: true,
                roundCap: true,
                width: 12
            },
            pointer: {
                icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
                length: '75%',
                width: 12,
                offsetCenter: [0, '5%']
            },
            axisLine: {
                roundCap: true,
                lineStyle: {
                    width: 12
                }
            },
            axisTick: {
                splitNumber: 2,
                lineStyle: {
                    width: 2,
                    color: '#ffffff'
                }
            },
            splitLine: {
                length: 12,
                lineStyle: {
                    width: 3,
                    color: '#ffffff'
                }
            },
            axisLabel: {
                distance: 30,
                color: '#ffffff',
                fontSize: 0
            },
            title: {
                show: false
            },
            detail: {
                backgroundColor: '#4db6ac',
                borderColor: '#999',
                borderWidth: 0,
                width: 150,
                lineHeight: 40,
                height: 70,
                padding: [0,0,0,0],
                borderRadius: 8,
                offsetCenter: [0, '70%'],
                valueAnimation: true,
                formatter: function (value) {
                    return '{value|' + value.toFixed(0) + '%}\n{unit|}';
                },
                rich: {
                    value: {
                        fontSize: 30,
                        fontWeight: 'bolder',
                        color: '#ffffff',
                        padding: [0,0,0,0]
                    },
                    unit: {
                        fontSize: 20,
                        color: '#ffffff',
                        padding: [0, 0, 0, 0]
                    }
                }
            },
            data: [{
                value: 100
            }]
        }]
    };

    /*
    socket.on('status_ram',function (data) {
        Ramoption.series[0].data[0].value = (100 - data.freeMemPercentage).toFixed(2) - 0;
        myChart.setOption(option, true);
    })
*/
    Ramoption && ramChart.setOption(Ramoption);
}

function buildCpuChart() {
    // based on prepared DOM, initialize echarts instance
    var chartDom = document.getElementById('cpu');
     cpuChart = echarts.init(chartDom);

    CpuOption = {
        series: [{
            type: 'gauge',
            startAngle: 180,
            endAngle: 0,
            min: 0,
            max: 100,
            splitNumber: 10,
            itemStyle: {
                color: '#58D9F9',
                shadowColor: 'rgba(0,138,255,0.45)',
                shadowBlur: 10,
                shadowOffsetX: 2,
                shadowOffsetY: 2
            },
            progress: {
                show: true,
                roundCap: true,
                width: 12
            },
            pointer: {
                icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
                length: '75%',
                width: 12,
                offsetCenter: [0, '5%']
            },
            axisLine: {
                roundCap: true,
                lineStyle: {
                    width: 12
                }
            },
            axisTick: {
                splitNumber: 2,
                lineStyle: {
                    width: 2,
                    color: '#ffffff'
                }
            },
            splitLine: {
                length: 12,
                lineStyle: {
                    width: 3,
                    color: '#ffffff'
                }
            },
            axisLabel: {
                distance: 30,
                color: '#ffffff',
                fontSize: 0
            },
            title: {
                show: false
            },
            detail: {
                backgroundColor: '#4db6ac',
                borderColor: '#999',
                borderWidth: 0,
                width: 150,
                lineHeight: 40,
                height: 70,
                padding: [0,0,0,0],
                borderRadius: 8,
                offsetCenter: [0, '70%'],
                valueAnimation: true,
                formatter: function (value) {
                    return '{value|' + value.toFixed(0) + '%}\n{unit|}';
                },
                rich: {
                    value: {
                        fontSize: 30,
                        fontWeight: 'bolder',
                        color: '#ffffff',
                        padding: [0,0,0,0]
                    },
                    unit: {
                        fontSize: 20,
                        color: '#ffffff',
                        padding: [0, 0, 0, 0]
                    }
                }
            },
            data: [{
                value: 100
            }]
        }]
    };
/*
    socket.on('status_cpu',function (data) {
        CpuOption.series[0].data[0].value = ( data ).toFixed(2) - 0;
        myChart.setOption(CpuOption, true);
    })
*/
    CpuOption && cpuChart.setOption(CpuOption);
}

function buildGpuChart() {
    // based on prepared DOM, initialize echarts instance
    var chartDom = document.getElementById('gpu');
     GpuChart = echarts.init(chartDom);

    GpuOption = {
        series: [{
            type: 'gauge',
            startAngle: 180,
            endAngle: 0,
            min: 0,
            max: 100,
            splitNumber: 10,
            itemStyle: {
                color: '#58D9F9',
                shadowColor: 'rgba(0,138,255,0.45)',
                shadowBlur: 10,
                shadowOffsetX: 2,
                shadowOffsetY: 2
            },
            progress: {
                show: true,
                roundCap: true,
                width: 12
            },
            pointer: {
                icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
                length: '75%',
                width: 12,
                offsetCenter: [0, '5%']
            },
            axisLine: {
                roundCap: true,
                lineStyle: {
                    width: 12
                }
            },
            axisTick: {
                splitNumber: 2,
                lineStyle: {
                    width: 2,
                    color: '#ffffff'
                }
            },
            splitLine: {
                length: 12,
                lineStyle: {
                    width: 3,
                    color: '#ffffff'
                }
            },
            axisLabel: {
                distance: 30,
                color: '#ffffff',
                fontSize: 0
            },
            title: {
                show: false
            },
            detail: {
                backgroundColor: '#4db6ac',
                borderColor: '#999',
                borderWidth: 0,
                width: 150,
                lineHeight: 40,
                height: 70,
                padding: [0,0,0,0],
                borderRadius: 8,
                offsetCenter: [0, '70%'],
                valueAnimation: true,
                formatter: function (value) {
                    return '{value|' + value.toFixed(0) + 'c}\n{unit|}';
                },
                rich: {
                    value: {
                        fontSize: 30,
                        fontWeight: 'bolder',
                        color: '#ffffff',
                        padding: [0,0,0,0]
                    },
                    unit: {
                        fontSize: 20,
                        color: '#ffffff',
                        padding: [0, 0, 0, 0]
                    }
                }
            },
            data: [{
                value: 100
            }]
        }]
    };
/*
    socket.on('status_cpu',function (data) {
        GpuOption.series[0].data[0].value = ( data ).toFixed(2) - 0;
        GpuChart.setOption(GpuOption, true);
    })
*/
    GpuOption && GpuChart.setOption(GpuOption);
}