import { Box, MantineColor, Stack, Text } from '@mantine/core'
import { LineChart } from '@mantine/charts'

interface Props {
  data: {
    data: {
      [key: string]: number
    }
    date: string
  }[]
  h: number
  series: {
    color: MantineColor
    name: string
  }[]
  chartName: string
}

export const GLineChart = ({ data, h, series, chartName }: Props) => {
  return (
    <Box>
      <Stack gap={8}>
        <Text size="lg" className="!font-bold" c="dimmed">
          {chartName}
        </Text>
        <LineChart
          data={data}
          h={h}
          series={series}
          curveType="linear"
          dataKey="date"
        />
      </Stack>
    </Box>
  )
}
