import { createFileRoute } from '@tanstack/react-router'
import { useExplore } from '../../hooks/useExplore'
import { useQuery } from '@tanstack/react-query'
import { AppLayout } from '../../components/layouts/app/AppLayout'
import { Box, Group, Stack, Text } from '@mantine/core'
import { GIcon } from '../../components/common/GIcon'
import { GExplore } from '../../components/common/GExplore'
// import { IExplore } from '../../hooks/interface'

export const Route = createFileRoute('/explore/')({
  component: RouteComponent
})

// export const mockArticle: IExplore = {
//   source: {
//     id: 'techcrunch',
//     name: 'TechCrunch'
//   },
//   author: 'Jane Smith',
//   title: 'The Future of Web Development: React vs. Next.js',
//   description:
//     'An in-depth analysis of modern frontend frameworks and their impact on developer productivity and application performance.',
//   url: 'https://techcrunch.com/2023/05/15/react-vs-nextjs',
//   urlToImage: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2',
//   publishedAt: '2023-05-15T14:32:00Z',
//   content:
//     'As web development continues to evolve, developers face the challenge of choosing the right tools for their projects. React has long been the dominant library for building user interfaces, but Next.js has gained significant traction by offering additional features like server-side rendering and simplified routing...',
//   active: true
// }

function RouteComponent() {
  const { getArticles } = useExplore()

  const { data: articles } = useQuery({
    queryKey: ['get-articles'],
    queryFn: () => getArticles(),
    select: (data) => {
      return data.data.result.content
    }
  })
  return (
    <AppLayout>
      <Box mx="auto" maw={1000} px={20} pt={10} bg={'white'} mah={'90vh'}>
        <Stack align="center">
          <Group>
            <GIcon name="Flame" size={16} />
            <Text className="!text-xl !font-bold">
              Explore around the world
            </Text>
          </Group>
          {articles?.map((article) => (
            <GExplore key={article.url} article={article} />
          ))}
          {/* {[mockArticle]?.map((article) => (
            <GExplore key={article.url} article={article} />
          ))} */}
        </Stack>
      </Box>
    </AppLayout>
  )
}
