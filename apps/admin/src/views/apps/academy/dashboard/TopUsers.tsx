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

// your own avatar + menu components
import CustomAvatar from '@core/components/mui/Avatar'
import OptionMenu from '@core/components/option-menu'

type KPIType = 'Average'|'Prospecting'|'Follow Up'|'Engagement'|'Conversion'

// Updated UserType: Removed 'profession'
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

// Updated dummy data: Removed 'profession' from each object
const data: UserType[] = [
  { name: 'Jordan Stevenson', avatar: '/images/avatars/1.png', kpis: { prospecting: 78, followUp: 85, engagement: 92, conversion: 66 } },
  { name: 'Bentlee Emblin',     avatar: '/images/avatars/2.png', kpis: { prospecting: 64, followUp: 72, engagement: 81, conversion: 57 } },
  { name: 'Benedetto Rossiter', avatar: '/images/avatars/3.png', kpis: { prospecting: 83, followUp: 77, engagement: 69, conversion: 48 } },
  { name: 'Beverlie Krabbe',    avatar: '/images/avatars/4.png', kpis: { prospecting: 55, followUp: 60, engagement: 74, conversion: 52 } },
  { name: 'Zachary Willms',     avatar: '/images/avatars/5.png', kpis: { prospecting: 91, followUp: 88, engagement: 95, conversion: 75 } },
  { name: 'Alice Smith',        avatar: '/images/avatars/6.png', kpis: { prospecting: 70, followUp: 65, engagement: 78, conversion: 59 } },
  { name: 'Bob Johnson',        avatar: '/images/avatars/7.png', kpis: { prospecting: 88, followUp: 92, engagement: 85, conversion: 71 } },
  { name: 'Charlie Brown',      avatar: '/images/avatars/8.png', kpis: { prospecting: 60, followUp: 70, engagement: 68, conversion: 45 } },
  { name: 'Diana Prince',       avatar: '/images/avatars/9.png', kpis: { prospecting: 75, followUp: 80, engagement: 77, conversion: 62 } },
  { name: 'Ethan Hunt',         avatar: '/images/avatars/10.png',kpis: { prospecting: 89, followUp: 87, engagement: 91, conversion: 79 } },
  { name: 'Fiona Gallagher',    avatar: '/images/avatars/11.png',kpis: { prospecting: 93, followUp: 90, engagement: 96, conversion: 88 } },
  { name: 'George Costanza',    avatar: '/images/avatars/12.png',kpis: { prospecting: 50, followUp: 55, engagement: 60, conversion: 40 } },
  { name: 'Elaine Benes',       avatar: '/images/avatars/13.png',kpis: { prospecting: 65, followUp: 70, engagement: 75, conversion: 50 } },
  { name: 'Cosmo Kramer',       avatar: '/images/avatars/14.png',kpis: { prospecting: 40, followUp: 45, engagement: 50, conversion: 35 } },
]

const TopUsers: React.FC = () => {
  // local state for KPI
  const [currentKPI, setCurrentKPI] = useState<KPIType>('Average')

  // compute and sort data any time `currentKPI` changes
  const sortedUsers = useMemo(() => {
    return data
      .map(u => ({
        ...u,
        average: (u.kpis.prospecting + u.kpis.followUp + u.kpis.engagement + u.kpis.conversion) / 4
      }))
      .sort((a, b) => {
        const getScore = (u: typeof a) => {
          switch (currentKPI) {
            case 'Average':     return u.average
            case 'Prospecting': return u.kpis.prospecting
            case 'Follow Up':   return u.kpis.followUp
            case 'Engagement':  return u.kpis.engagement
            case 'Conversion':  return u.kpis.conversion
          }
        }
        return getScore(b) - getScore(a)
      })
  }, [currentKPI])

  return (
    <Card className="h-[402px] flex flex-col">
      <CardHeader
        title="Top Users"
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
                {['Average','Prospecting','Follow Up','Engagement','Conversion'].map(k => (
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
        {sortedUsers.map((u, idx) => {
          const score =
            currentKPI === 'Average'
              ? u.average
              : currentKPI === 'Prospecting'
              ? u.kpis.prospecting
              : currentKPI === 'Follow Up'
              ? u.kpis.followUp
              : currentKPI === 'Engagement'
              ? u.kpis.engagement
              : u.kpis.conversion

          return (
            <div
              key={u.name}
              className={`flex items-center gap-4 py-2 ${
                idx === sortedUsers.length - 1 ? '' : 'border-b'
              }`}
            >
              <CustomAvatar size={34} src={u.avatar} />

              <div className="flex-1 flex justify-between items-center">
                <div>
                   {/* Removed Typography for profession */}
                  <Typography className="font-medium" color="text.primary">
                    {u.name}
                  </Typography>
                </div>
                <Typography color="text.primary">{score.toFixed(1)}</Typography>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

export default TopUsers
