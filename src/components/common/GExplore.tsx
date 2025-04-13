import {
  Box,
  CopyButton,
  Flex,
  Group,
  Image,
  Menu,
  Stack,
  Text
} from '@mantine/core'
import { IExplore } from '../../hooks/interface'
import { GIcon } from './GIcon'
import { Link } from '@tanstack/react-router'
import { format } from 'date-fns'

interface Props {
  article: IExplore
}

export const GExplore = ({ article }: Props) => {
  return (
    <Box className="rounded-lg border border-gray-300" px={16} py={12} w={1000}>
      <Flex align={'center'} justify={'space-between'}>
        <Text className="!text-lg !font-bold">{article.title}</Text>

        <Menu>
          <Menu.Target>
            <Text>
              <GIcon name="DotsVertical" size={18} className="cursor-pointer" />
            </Text>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item component={Link} to={article.url} target="_blank">
              Open in new tab
            </Menu.Item>
            <CopyButton value={article.url}>
              {({ copy }) => (
                <Menu.Item onClick={copy}>Copy article URL</Menu.Item>
              )}
            </CopyButton>
          </Menu.Dropdown>
        </Menu>
      </Flex>
      <Text c={'dimmed'} size="sm">
        {article.description}
      </Text>
      <Image
        src={article.urlToImage}
        w={500}
        className="border border-gray-300"
        mt={16}
        mx={'auto'}
      />
      <Box mt={32}>{article.content}</Box>

      <Group mt={48} align="flex-end">
        <Stack gap={0}>
          <Text c={'indigo'}>From {article.source.name}</Text>
          <Text>By {article.author}</Text>
        </Stack>
        <Text c={'dimmed'} size="sm">
          {format(new Date(article.publishedAt), 'PP')}
        </Text>
      </Group>
    </Box>
  )
}
