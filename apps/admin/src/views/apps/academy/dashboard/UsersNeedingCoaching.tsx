'use client';

import React, { useState, useMemo } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
// No need for useTheme

// your own avatar + menu components
import CustomAvatar from '@core/components/mui/Avatar'
import OptionMenu from '@core/components/option-menu'

// Updated KPIType: Removed 'Average'
type KPIType = 'Prospecting' | 'Follow Up' | 'Engagement' | 'Conversion'

// UserType remains the same
type UserType = {
  name: string
  avatar: string
  kpis: {
    prospecting: number
    followUp: number
    engagement: number
    conversion: number
  }
}

// Dummy data with some lower scores
const data: UserType[] = [
  { name: 'Jordan Stevenson', avatar: '/images/avatars/1.png', kpis: { prospecting: 78, followUp: 85, engagement: 92, conversion: 66 } }, // Mixed scores
  { name: 'Bentlee Emblin', avatar: '/images/avatars/2.png', kpis: { prospecting: 64, followUp: 72, engagement: 81, conversion: 57 } }, // Some below higher threshold
  { name: 'Benedetto Rossiter', avatar: '/images/avatars/3.png', kpis: { prospecting: 83, followUp: 77, engagement: 69, conversion: 48 } }, // Some below lower threshold
  { name: 'Beverlie Krabbe', avatar: '/images/avatars/4.png', kpis: { prospecting: 55, followUp: 60, engagement: 74, conversion: 52 } }, // Several below higher, some below lower
  { name: 'Zachary Willms', avatar: '/images/avatars/5.png', kpis: { prospecting: 91, followUp: 88, engagement: 95, conversion: 75 } }, // Generally good
  { name: 'Alice Smith', avatar: '/images/avatars/6.png', kpis: { prospecting: 40, followUp: 55, engagement: 65, conversion: 30 } }, // Many scores needing significant support (below lower)
  { name: 'Bob Johnson', avatar: '/images/avatars/7.png', kpis: { prospecting: 88, followUp: 92, engagement: 85, conversion: 71 } }, // Mostly good, conversion below higher
  { name: 'Charlie Brown', avatar: '/images/avatars/8.png', kpis: { prospecting: 50, followUp: 50, engagement: 55, conversion: 40 } }, // All below lower threshold
  { name: 'Diana Prince', avatar: '/images/avatars/9.png', kpis: { prospecting: 75, followUp: 80, engagement: 77, conversion: 62 } }, // Mixed
  { name: 'Ethan Hunt', avatar: '/images/avatars/10.png', kpis: { prospecting: 89, followUp: 87, engagement: 91, conversion: 79 } }, // Good scores
  { name: 'Fiona Gallagher', avatar: '/images/avatars/11.png', kpis: { prospecting: 93, followUp: 90, engagement: 96, conversion: 88 } }, // Excellent scores
  { name: 'George Costanza', avatar: '/images/avatars/12.png', kpis: { prospecting: 35, followUp: 40, engagement: 45, conversion: 30 } }, // Very low scores
  { name: 'Elaine Benes', avatar: '/images/avatars/13.png', kpis: { prospecting: 60, followUp: 65, engagement: 70, conversion: 55 } }, // Around and below thresholds
  { name: 'Cosmo Kramer', avatar: '/images/avatars/14.png', kpis: { prospecting: 45, followUp: 50, engagement: 55, conversion: 35 } }, // Consistently below lower threshold
];

// Define thresholds for coaching
const LOWER_THRESHOLD = 60; // Scores below 60 (Error)
const HIGHER_THRESHOLD = 75; // Scores below 75 (Alert/Warning)

// Define custom colors
const ERROR_COLOR = '#FF3B3B'; // Red
const WARNING_COLOR = '#F59E0B'; // Amber/Yellow
const PRIMARY_COLOR = 'text.primary'; // Use theme's primary text color for good scores

const UsersNeedingCoaching: React.FC = () => {
  // local state for KPI, default to one of the remaining KPIs
  const [currentKPI, setCurrentKPI] = useState<KPIType>('Prospecting')

  // compute and sort data any time `currentKPI` changes
  const sortedUsers = useMemo(() => {
    return [...data]
      .sort((a, b) => {
        const getScore = (user: UserType) => {
          switch (currentKPI) {
            case 'Prospecting': return user.kpis.prospecting;
            case 'Follow Up': return user.kpis.followUp;
            case 'Engagement': return user.kpis.engagement;
            case 'Conversion': return user.kpis.conversion;
            default: return 0;
          }
        };
        // Sort ascending to show lower scores first
        return getScore(a) - getScore(b);
      });
  }, [currentKPI]);

  return (
    <Card className="h-[402px] flex flex-col">
      <CardHeader
        title="Users Needing Support"
        action={
          <div className="flex items-center gap-2">
            <FormControl variant="standard" size="small" sx={{ width: 150 }}>
              <InputLabel id="kpi-select-label">KPI</InputLabel>
              <Select
                labelId="kpi-select-label"
                id="kpi-select"
                value={currentKPI}
                label="KPI"
                onChange={e => setCurrentKPI(e.target.value as KPIType)}
              >
                {['Prospecting','Follow Up','Engagement','Conversion'].map(k => (
                  <MenuItem key={k} value={k}>
                    {k}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <OptionMenu iconClassName="text-textPrimary" options={['Refresh','Update','Share']} />
          </div>
        }
      />

      <Divider />

      <CardContent className="flex-1 overflow-auto">
        {/* table‐style header */}
        <div className="flex justify-between px-5 py-3">
          <Typography variant="overline">User</Typography>
          <Typography variant="overline">Score ({currentKPI})</Typography>
        </div>
        <Divider />

        {/* user rows */}
        {sortedUsers.map((user, idx) => {
          // Get the score for the current KPI
          const score =
            currentKPI === 'Prospecting'
              ? user.kpis.prospecting
              : currentKPI === 'Follow Up'
              ? user.kpis.followUp
              : currentKPI === 'Engagement'
              ? user.kpis.engagement
              : user.kpis.conversion; // Conversion

          // Determine color based on thresholds
          let displayColor: string = PRIMARY_COLOR; // Default to primary text color
          if (score < LOWER_THRESHOLD) {
            displayColor = ERROR_COLOR; // Use custom error color
          } else if (score < HIGHER_THRESHOLD) {
            displayColor = WARNING_COLOR; // Use custom warning color
          }
          // If score is >= HIGHER_THRESHOLD, color remains PRIMARY_COLOR

          return (
            <div
              key={user.name}
              className={`flex items-center gap-4 py-2 ${
                idx === sortedUsers.length - 1 ? '' : 'border-b'
              }`}
            >
              <CustomAvatar size={34} src={user.avatar} />

              <div className="flex-1 flex justify-between items-center">
                <div>
                  <Typography className="font-medium" color="text.primary">
                    {user.name}
                  </Typography>
                </div>
                {/* Display score with dynamic color using sx prop */}
                <Typography sx={{ color: displayColor }}>{score.toFixed(0)}</Typography>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

export default UsersNeedingCoaching
