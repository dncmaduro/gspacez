import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { AppLayout } from '../../components/layouts/app/AppLayout'
import { ActionIcon, Box, Button, Group, Text } from '@mantine/core'
import { FormProvider, useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { usePost } from '../../hooks/usePost'
import { GToast } from '../../components/common/GToast'
import { CreatePostRequest } from '../../hooks/models'
import { PostForm } from '../../components/post/PostForm'
import { GIcon } from '../../components/common/GIcon'

export const Route = createFileRoute('/post/new')({
  component: RouteComponent
})

export type PostFormType = {
  title: string
  text: string
  hashTags?: string[]
  privacy: string | null
}

function RouteComponent() {
  const { createPost } = usePost()
  const navigate = useNavigate()
  const router = useRouter()

  const formMethods = useForm<PostFormType>({
    defaultValues: {
      title: '',
      text: '',
      hashTags: []
    }
  })

  const { mutate: mutatePost, isPending: isPosting } = useMutation({
    mutationFn: ({ req }: { req: CreatePostRequest }) => createPost(req),
    onSuccess: (response) => {
      navigate({ to: `/post/${response.data.result.id}` })
      GToast.success({
        title: 'Create post successfully!'
      })
    },
    onError: () => {
      GToast.error({
        title: 'Failed to upload post!'
      })
    }
  })

  const {
    handleSubmit,
    formState: { isDirty }
  } = formMethods

  const submit = (values: PostFormType) => {
    mutatePost({
      req: { ...values, privacy: values.privacy || 'PUBLIC' }
    })
  }

  return (
    <AppLayout>
      <Box maw={1000} mx="auto" px={32} py={20}>
        <Group align="center" mt={20} gap={8}>
          <ActionIcon
            size="md"
            variant="subtle"
            color="gray"
            onClick={() => router.history.go(-1)}
          >
            <GIcon name="ArrowLeft" size={20} />
          </ActionIcon>
          <Text className="text-center !text-2xl !font-bold">
            Share your knowledge with others
          </Text>
        </Group>
        <Box mt={32}>
          <FormProvider {...formMethods}>
            <PostForm />
          </FormProvider>
        </Box>
        <Button
          mt={32}
          onClick={handleSubmit(submit)}
          loading={isPosting}
          disabled={!isDirty}
        >
          Submit
        </Button>
      </Box>
    </AppLayout>
  )
}
