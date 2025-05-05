'use client'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// Third Party Imports
import type { ApexOptions } from 'apexcharts'

// Components Imports
import OptionsMenu from '@core/components/option-menu'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

const EngagementChart = () => {
  // Hooks
  const theme = useTheme()

  // Define the score and thresholds
  const score = 84
  const threshold1 = 50
  const threshold2 = 80

  // Determine the color based on thresholds
  let chartColor: string
  if (score < threshold1) {
    chartColor = theme.palette.error.main
  } else if (score < threshold2) {
    chartColor = theme.palette.warning.main
  } else {
    chartColor = '#77B800'
  }

  // Apex options
  const options: ApexOptions = {
    chart: {
      sparkline: { enabled: true }
    },
    stroke: { lineCap: 'round' },
    grid: { padding: { top: -10 } },
    colors: [chartColor],
    fill: { type: 'solid' },
    states: {
      hover: { filter: { type: 'none' } },
      active: { filter: { type: 'none' } }
    },
    plotOptions: {
      radialBar: {
        startAngle: -180,
        endAngle: 180,
        inverseOrder: true,
        hollow: { size: '62%' },
        track: { background: 'var(--mui-palette-customColors-trackBg)' },
        dataLabels: {
          name: { show: false, offsetY: 26 },
          value: {
            offsetY: 0,
            fontWeight: 500,
            fontSize: '1.5rem',
            formatter: val => `${val}/100`,
            color: 'var(--mui-palette-text-primary)'
          },
          total: {
            show: false,
            label: 'Growth',
            fontWeight: 400,
            fontSize: '14px',
            color: 'var(--mui-palette-text-secondary)'
          }
        }
      }
    },
    tooltip: {
      enabled: true,
      shared: false,
      intersect: false,
      y: {
        // Your custom content
        formatter: () =>
          `Lower Threshold: ${threshold1}<br/>Higher Threshold: ${threshold2}`,
        // Remove the default "series1:" title
        title: {
          formatter: () => ''
        }
      }
    }
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title='Prospecting'
        action={
          <OptionsMenu
            iconProps={{ style: { color: chartColor } }}
            options={['Last 28 Days', 'Last Month', 'Last Year']}
          />
        }
      />
      <CardContent className='flex items-center flex-col'>
        <AppReactApexCharts
          type='radialBar'
          height={183}
          width='100%'
          series={[score]}
          options={options}
        />
      </CardContent>
    </Card>
  )
}

export default EngagementChart