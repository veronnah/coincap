import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels, ApexFill, ApexLegend,
  ApexPlotOptions,
  ApexTitleSubtitle, ApexTooltip,
  ApexXAxis,
  ApexStroke,
  ApexYAxis,
  ApexMarkers
} from "ng-apexcharts";

export interface ChartOptionsModel {
  series?: ApexAxisChartSeries;
  chart?: ApexChart;
  xaxis?: ApexXAxis;
  markers?: ApexMarkers;
  stroke?: ApexStroke;
  yaxis?: ApexYAxis | ApexYAxis[];
  plotOptions?: ApexPlotOptions;
  dataLabels?: ApexDataLabels;
  colors?: string[];
  labels?: string[] | number[];
  title?: ApexTitleSubtitle;
  subtitle?: ApexTitleSubtitle;
  legend?: ApexLegend;
  fill?: ApexFill;
  tooltip?: ApexTooltip;
}
