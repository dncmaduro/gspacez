import {
  Box,
  Flex,
  Group,
  Image,
  Text,
  Badge,
  Divider,
  Tooltip
} from '@mantine/core'
import { IExplore } from '../../hooks/interface'
import { format } from 'date-fns'
import { Link } from '@tanstack/react-router'
import { GIcon } from './GIcon'
import { useMedia } from '../../hooks/useMedia'

interface Props {
  article: IExplore
}

export const GExplore = ({ article }: Props) => {
  const { isMobile } = useMedia()

  return (
    <Box
      className="rounded-lg border border-gray-300 transition-all duration-200 hover:border-indigo-300 hover:shadow-md"
      px={24}
      py={16}
      w={'100%'}
      component={Link}
      to={article.url}
      target="blank"
    >
      <Flex
        align={isMobile ? 'flex-start' : 'center'}
        justify={'space-between'}
        mb={isMobile ? 20 : 12}
        gap={isMobile ? 8 : 20}
        direction={isMobile ? 'column' : 'row'}
      >
        <Text className="!text-xl !font-bold text-indigo-800">
          {article.title}
        </Text>
        <Tooltip withArrow label={article.source.name} openDelay={300}>
          <Box>
            <Badge
              color="indigo"
              radius="sm"
              variant="light"
              className="grow"
              w={'max-content'}
            >
              {article.source.name}
            </Badge>
          </Box>
        </Tooltip>
      </Flex>

      <Text c={'dimmed'} size="sm" mb={20} className="leading-relaxed">
        {article.description}
      </Text>

      <Image
        src={article.urlToImage}
        w={600}
        className="rounded-md border border-gray-300 shadow-sm"
        mt={16}
        mx={'auto'}
      />

      <Box mt={32} className="leading-relaxed text-gray-700">
        {article.content}
      </Box>

      <Divider my={24} />

      <Group justify="apart" align="center">
        <Group gap={8}>
          <GIcon name="User" size={16} color="#4F46E5" />
          <Text className="font-medium">
            By {article.author || 'Anonymous'}
          </Text>
        </Group>

        <Group gap={8}>
          <GIcon name="Calendar" size={16} color="#6B7280" />
          <Text c={'dimmed'} size="sm">
            {format(new Date(article.publishedAt), 'PP')}
          </Text>
        </Group>
      </Group>
    </Box>
  )
}
