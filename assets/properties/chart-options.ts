import { ChartOptionsModel } from "../../app/models/chartOptions.model";

export const chartOptions: Partial<ChartOptionsModel> = {
  colors: ['#57BD0F'],
  chart: {
    type: "area",
    height: 500,
    fontFamily: 'Solway, sans-serif',
    animations: {
      enabled: false,
    },
    toolbar: {
      show: true,
      offsetX: 0,
      offsetY: 0,
      tools: {
        download: `<img src="./assets/img/download.svg" width="16" alt="Download">`,
        selection: true,
        zoom: `<img src="./assets/img/selection.svg" width="16" alt="Selection zoom">`,
        zoomin: `<img src="./assets/img/zoom-in.svg" width="20" alt="Zoom in">`,
        zoomout: `<img src="./assets/img/zoom-out.svg" width="20" alt="Zoom out">`,
        pan: false,
        reset: `<img src="./assets/img/reset.svg" width="16" alt="Reset">`,
        customIcons: [],
      },
      autoSelected: 'zoom'
    },
  },
  grid: {
    show: true,
    xaxis: {
      lines: {
        show: false,
      },
    },
    yaxis: {
      lines: {
        show: true,
      }
    },
  },
  theme: {
    mode: 'light',
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    width: 2,
  },
  markers: {
    size: 0,
  },
  xaxis: {
    type: "datetime",
    tickAmount: 6,
    labels: {
      style: {
        colors: '#b0b0b0',
      },
    }
  },
  yaxis: {
    labels: {
      style: {
        colors: ['#b0b0b0'],
      },
      formatter: function (value: number) {
        return "" + value;
      },
    },
  },
  tooltip: {
    enabled: true,
    intersect: false,
    followCursor: false,
    fixed: {
      enabled: false,
    },
    x: {
      format: 'dd MMM yyyy',
    }
  },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.9,
      stops: [0, 100]
    }
  },
};
