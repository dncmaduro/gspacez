import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { usePost } from '../../hooks/usePost'
import { useMutation, useQuery } from '@tanstack/react-query'
import { ActionIcon, Box, Button, Group, Loader, Text } from '@mantine/core'
import { AppLayout } from '../../components/layouts/app/AppLayout'
import { FormProvider, useForm } from 'react-hook-form'
import { PostFormType } from './new'
import { useEffect, useMemo } from 'react'
import { UpdatePostRequest } from '../../hooks/models'
import { GToast } from '../../components/common/GToast'
import { GIcon } from '../../components/common/GIcon'
import { PostForm } from '../../components/post/PostForm'

export const Route = createFileRoute('/post/edit/$postId')({
  component: RouteComponent
})

function RouteComponent() {
  const { updatePost, getPost } = usePost()
  const { postId } = useParams({ from: `/post/edit/$postId` })
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['edit-post', postId],
    queryFn: () => {
      return getPost({ id: postId })
    }
  })

  const existedPost = useMemo(() => {
    return data?.data.result
  }, [data])

  const formMethods = useForm<PostFormType>({
    defaultValues: {
      title: existedPost?.title,
      text: existedPost?.content.text,
      hashTags: existedPost?.hashTags
    }
  })

  useEffect(() => {
    if (existedPost) {
      formMethods.reset({
        title: existedPost.title,
        text: existedPost.content.text,
        hashTags: existedPost.hashTags
      })
    }
  }, [existedPost, formMethods])

  const { mutate: mutateUpdate, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, req }: { id: string; req: UpdatePostRequest }) =>
      updatePost(id, req),
    onSuccess: (response) => {
      navigate({ to: `/post/${response.data.result.id}` })
      GToast.success({
        title: 'Create post successfully!'
      })
    },
    onError: () => {
      GToast.error({
        title: 'Failed to update post!'
      })
    }
  })

  const submit = (values: PostFormType) => {
    mutateUpdate({
      id: postId,
      req: { ...values, privacy: values.privacy || 'PUBLIC' }
    })
  }

  const {
    handleSubmit,
    formState: { isDirty }
  } = formMethods

  return (
    <AppLayout>
      <Box maw={1000} mx="auto" px={32} py={20}>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <Group align="center" mt={20} gap={8}>
              <ActionIcon size="md" variant="subtle" color="gray">
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
              loading={isUpdating}
              disabled={!isDirty}
            >
              Submit
            </Button>
          </>
        )}
      </Box>
    </AppLayout>
  )
}
