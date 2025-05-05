'use client'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { lighten, useTheme } from '@mui/material/styles'

// Third Party Imports
import type { ApexOptions } from 'apexcharts'

// Components Imports
import OptionMenu from '@core/components/option-menu'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

// Adjusted series data to match the new labels (assuming the first 3 values are used)
const DistributionChartSeries = [13, 25, 22] // Assuming these values correspond to Completed, Incomplete, Abandoned

const UserDistributionChart = () => {
  // Hooks
  const theme = useTheme()

  const options: ApexOptions = {
    // Updated labels
    labels: ['Completed', 'Incomplete', 'Abandoned'],
    stroke: {
      width: 0
    },
    colors: [
      // Adjusted colors to match the number of labels (3 colors)
      'var(--mui-palette-success-main)',
      lighten(theme.palette.success.main, 0.2),
      lighten(theme.palette.success.main, 0.4),
      // removed the 4th color
    ],
    dataLabels: {
      enabled: false,
      formatter(val: string) {
        return `${Number.parseInt(val)}%`
      }
    },
    legend: {
      show: true,
      position: 'bottom',
      offsetY: 10,
      markers: {
        width: 8,
        height: 8,
        offsetY: 1,
        offsetX: theme.direction === 'rtl' ? 8 : -4
      },
      itemMargin: {
        horizontal: 15,
        vertical: 5
      },
      fontSize: '13px',
      fontWeight: 400,
      labels: {
        colors: 'var()',
        useSeriesColors: false
      }
    },
    grid: {
      padding: {
        top: 15
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
          labels: {
            show: true,
            value: {
              fontSize: '24px',
              color: 'var(--mui-palette-text-primary)',
              fontWeight: 500,
              offsetY: -20
            },
            name: { offsetY: 20 },
            total: {
              show: true,
              fontSize: '0.9375rem',
              fontWeight: 400,
              // Updated label
              label: 'Total interactions',
              color: 'var(--mui-palette-text-secondary)',
              // Updated formatter to calculate and show total sum
              formatter() {
                 const total = DistributionChartSeries.reduce((acc, val) => acc + val, 0);
                 return total.toString();
              }
            }
          }
        }
      }
    }
  }

  return (
    <Card className='bs-full'>
      <CardHeader
        title='Delivery exceptions'
        action={<OptionMenu iconClassName='text-textPrimary' options={['Select All', 'Refresh', 'Share']} />}
      />
      <CardContent>
        <AppReactApexCharts
          type='donut'
          height={336} // Keep original height
          width='100%'
          series={DistributionChartSeries}
          options={options}
        />
      </CardContent>
    </Card>
  )
}

export default UserDistributionChart
