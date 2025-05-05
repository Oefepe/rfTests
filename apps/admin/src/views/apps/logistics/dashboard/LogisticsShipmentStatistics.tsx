'use client'

// React Imports
// Removed imports related to MonthButton

// Next Imports
import dynamic from 'next/dynamic'

// Mui Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { useTheme } from '@mui/material/styles'

// Third Party Imports
import type { ApexOptions } from 'apexcharts'

const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

// Style Imports
import './styles.css'


// --- Threshold Definitions ---
const lowerThreshold = 50;
const higherThreshold = 80;

// --- Color Definitions ---
const errorColor = '#FF4560';
const alertColor = '#FFC107';
const successColor = '#77B800';

// Example data for course completion rates (replace with real data as needed)
const coursesData = [
  { name: 'Introduction to Programming', completionRate: 60 },
  { name: 'Data Structures and Algorithms', completionRate: 40 },
  { name: 'Web Development Fundamentals', completionRate: 75 },
  { name: 'Computer Networks', completionRate: 80 },
  { name: 'Machine Learning Basics', completionRate: 55 },
  { name: 'Database Management Systems', completionRate: 68 },
  { name: 'Operating Systems', completionRate: 72 },
  { name: 'Software Engineering', completionRate: 85 },
  { name: 'Artificial Intelligence', completionRate: 90 },
  { name: 'Cybersecurity Fundamentals', completionRate: 48 }
];

// Sort courses by completion rate from least to most completed
coursesData.sort((a, b) => a.completionRate - b.completionRate);

// Prepare series data from sorted courses
const series = [
  {
    name: 'Completion Rate',
    type: 'bar',
    data: coursesData.map(course => course.completionRate)
  }
];

// --- Generate colors array based on sorted data and thresholds ---
const barColors = coursesData.map(course => {
  if (course.completionRate < lowerThreshold) {
    return errorColor;
  } else if (course.completionRate < higherThreshold) {
    return alertColor;
  } else {
    return successColor;
  }
});

const CourseCompletionStatistics = () => {
  // Hooks
  const theme = useTheme();

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      stacked: false,
      parentHeightOffset: 0,
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
        columnWidth: '55%',
        distributed: false,
        colors: {
          ranges: [{
             from: 0,
             to: lowerThreshold - 0.01,
             color: errorColor
           }, {
             from: lowerThreshold,
             to: higherThreshold - 0.01,
             color: alertColor
           }, {
             from: higherThreshold,
             to: 100,
             color: successColor
           }],
           backgroundBarColors: [],
           backgroundBarOpacity: 1,
           backgroundBarRadius: 0
        }
      }
    },
    markers: {
      size: 0
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: coursesData.map(course => course.name),
      labels: {
        show: false,
        style: {
          colors: 'var(--mui-palette-text-disabled)',
          fontSize: '13px',
          fontWeight: 400
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      crosshairs: {
        show: false
      }
    },
    yaxis: {
      min: 0,
      max: 100,
      tickAmount: 5,
      labels: {
        formatter: (val: number) => `${Math.round(val)}%`,
        style: {
          colors: 'var(--mui-palette-text-disabled)',
          fontSize: '13px',
          fontWeight: 400
        }
      }
    },
    legend: {
      show: false,
    },
    grid: {
      strokeDashArray: 8,
      borderColor: 'var(--mui-palette-divider)',
    },
    fill: {
      opacity: [1]
    },
    dataLabels: {
      enabled: true,
      textAnchor: 'middle',
      offsetY: 0,
      formatter: function (val: number) {
        return `${Math.round(val)}%`;
      },
      style: {
        colors: ['#fff'],
        fontSize: '12px',
        fontWeight: 'bold',
        textOutline: '0px black'
      }
    },
    tooltip: {
      custom: function({ series, seriesIndex, dataPointIndex, w }) {
        const courseName = coursesData[dataPointIndex].name;
        const completionRate = series[seriesIndex][dataPointIndex];

        return `<div class="apexcharts-tooltip-custom">
                  <div>Course: <strong>${courseName}</strong></div>
                  <div>Completion: <strong>${completionRate}%</strong></div>
                </div>`;
      },
      y: {
        formatter: function (val: number) {
          return `${Math.round(val)}%`;
        }
      }
    },
    annotations: {
        yaxis: [
          {
            y: lowerThreshold,
            borderColor: errorColor,
            strokeDashArray: 4,
          },
          {
            y: higherThreshold,
            borderColor: successColor,
            strokeDashArray: 4,
          }
        ]
    }
  };

  return (
    <Card>
      <CardHeader
        title='Course Completion Rate'
        subheader='Percentage of course completion by course'
      />
      <CardContent>
        <AppReactApexCharts
          id='course-completion-rate'
          type='bar' 
          height={313}
          width='100%'
          series={series}
          options={options}
        />
      </CardContent>
    </Card>
  );
};

export default CourseCompletionStatistics;
