import { Box, Stack, Text } from '@mantine/core'
import { LineChart } from '@mantine/charts'

interface Props {
  data: {
    month: string
    value: number
  }[]
  h?: number
  chartName: string
  className?: string
}

export const GLineChart = ({
  data,
  h = 400,
  chartName,
  className = ''
}: Props) => {
  return (
    <Box className={className}>
      <Stack gap={8}>
        <Text size="lg" className="!font-bold" c="dimmed">
          {chartName}
        </Text>
        <LineChart
          data={data}
          h={h}
          series={[{ name: 'value', label: 'Month' }]}
          curveType="natural"
          dataKey="month"
          gradientStops={[
            { offset: 0, color: 'red.6' },
            { offset: 20, color: 'orange.6' },
            { offset: 40, color: 'yellow.5' },
            { offset: 70, color: 'lime.5' },
            { offset: 80, color: 'cyan.5' },
            { offset: 100, color: 'blue.5' }
          ]}
          strokeWidth={3}
        />
      </Stack>
    </Box>
  )
}
