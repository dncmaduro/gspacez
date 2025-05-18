import { createFileRoute } from '@tanstack/react-router'
import { useAdmin } from '../../../hooks/useAdmin'
import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { useQuery } from '@tanstack/react-query'
import { useDark } from '../../../hooks/useDark'
import { Helmet } from 'react-helmet-async'
import { AdminLayout } from '../../../components/layouts/admin/AdminLayout'
import { Box, Group, Text } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { GLineChart } from '../../../components/common/GLineChart'

export const Route = createFileRoute('/admin/squads/')({
  component: RouteComponent
})

function RouteComponent() {
  const { getSquadsStats } = useAdmin()
  const dateFormat = 'yyyy-MM-dd'
  const [fromDate, setFromData] = useState<string>(
    format(new Date(), dateFormat)
  )
  const [toDate, setToDate] = useState<string>(format(new Date(), dateFormat))

  const { data: squadsStats } = useQuery({
    queryKey: ['get-squads-stats', fromDate, toDate],
    queryFn: () =>
      getSquadsStats({
        fromDate: format(fromDate, dateFormat),
        toDate: format(toDate, dateFormat)
      }),
    select: (data) => {
      return data.data.result
    }
  })

  const { isDark } = useDark()

  const chartData = useMemo(() => {
    if (!squadsStats) return []

    return Object.keys(squadsStats.wiseSquads).flatMap((year) => {
      const yearData = squadsStats.wiseSquads[year]
      return Object.keys(yearData).map((month) => ({
        month: `${year}-${month}`,
        value: yearData[month]
      }))
    })
  }, [squadsStats])

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - GspaceZ</title>
      </Helmet>
      <AdminLayout>
        <Box
          px={32}
          mx="auto"
          maw={'100%'}
          w={800}
          mt={32}
          pt={10}
          className="rounded-md"
          bg={isDark ? 'gray.9' : 'white'}
        >
          <Text fw={500}>Squads Statistics</Text>
          <Group mt={16}>
            <DatePickerInput
              value={fromDate}
              onChange={setFromData}
              className="grow"
              label={'Start Date'}
            />
            <DatePickerInput
              value={toDate}
              onChange={setToDate}
              className="grow"
              label={'End Date'}
            />
          </Group>
          <GLineChart data={chartData} chartName={''} className="mt-8" />
        </Box>
      </AdminLayout>
    </>
  )
}
