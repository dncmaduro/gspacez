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

export const Route = createFileRoute('/admin/users/')({
  component: RouteComponent
})

function RouteComponent() {
  const { getUsersStats } = useAdmin()
  const dateFormat = 'yyyy-MM-dd'
  const [fromDate, setFromData] = useState<string>(
    format(new Date(), dateFormat)
  )
  const [toDate, setToDate] = useState<string>(format(new Date(), dateFormat))

  const { data: usersStats } = useQuery({
    queryKey: ['get-users-stats', fromDate, toDate],
    queryFn: () =>
      getUsersStats({
        fromDate: format(fromDate, dateFormat),
        toDate: format(toDate, dateFormat)
      }),
    select: (data) => {
      return data.data.result
    }
  })

  const { isDark } = useDark()

  const chartData = useMemo(() => {
    if (!usersStats) return []

    return Object.keys(usersStats.wiseUsers).flatMap((year) => {
      const yearData = usersStats.wiseUsers[year]
      return Object.keys(yearData).map((month) => ({
        month: `${year}-${month}`,
        value: yearData[month]
      }))
    })
  }, [usersStats])

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
          <Text fw={500}>Users Statistics</Text>
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
