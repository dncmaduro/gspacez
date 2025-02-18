import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { AppLayout } from '../../components/layouts/app/AppLayout'
import { Box, Button, Text } from '@mantine/core'
import { FormProvider, useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { usePost } from '../../hooks/usePost'
import { GToast } from '../../components/common/GToast'
import { CreatePostRequest } from '../../hooks/models'
import { PostForm } from '../../components/post/PostForm'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'

export const Route = createFileRoute('/post/new')({
  component: RouteComponent
})

export type PostFormType = {
  title: string
  text: string
  hashTags?: string[]
}

function RouteComponent() {
  const { createPost } = usePost()
  const navigate = useNavigate()
  const token = useSelector((state: RootState) => state.auth.token)

  const formMethods = useForm<PostFormType>({
    defaultValues: {
      title: '',
      text: '',
      hashTags: []
    }
  })

  const { mutate: mutatePost, isPending: isPosting } = useMutation({
    mutationFn: ({ req, token }: { req: CreatePostRequest; token: string }) =>
      createPost(req, token),
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
      req: values,
      token
    })
  }

  return (
    <AppLayout>
      <Box w={1000} mx="auto" px={32} py={20}>
        <Text className="!text-2xl !font-bold">
          Share your knowledge with others
        </Text>
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
