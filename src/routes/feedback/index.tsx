import { createFileRoute } from '@tanstack/react-router'
import { useFeedback } from '../../hooks/useFeedback'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import { SendFeedbackRequest } from '../../hooks/models'
import { GToast } from '../../components/common/GToast'
import { AppLayout } from '../../components/layouts/app/AppLayout'
import {
  Box,
  Text,
  Textarea,
  Rating,
  Group,
  Button,
  Stack,
  Title,
  Paper,
  Flex,
  Divider,
  ThemeIcon,
  Loader
} from '@mantine/core'
import { GIcon } from '../../components/common/GIcon'
import { useState } from 'react'
import { GFeedback } from '../../components/common/GFeedback'
import { modals } from '@mantine/modals'
import { format } from 'date-fns'

export const Route = createFileRoute('/feedback/')({
  component: RouteComponent
})

export type FeedbackType = {
  content: string
  rate: number
}

function RouteComponent() {
  const { sendFeedback, getFeedbacks, getOwnFeedback } = useFeedback()
  const [submitted, setSubmitted] = useState(false)

  const {
    handleSubmit,
    control,
    formState: { isDirty, isValid },
    reset
  } = useForm<FeedbackType>({
    defaultValues: {
      content: '',
      rate: 0
    }
  })

  const { data: ownFeedback } = useQuery({
    queryKey: ['get-own-feedback'],
    queryFn: () => getOwnFeedback(),
    select: (data) => {
      return data.data.result
    }
  })

  const { mutate: send, isPending } = useMutation({
    mutationFn: (req: SendFeedbackRequest) => sendFeedback(req),
    onSuccess: () => {
      GToast.success({
        title: 'Feedback sent successfully!'
      })
      reset()
      setSubmitted(true)
    },
    onError: () => {
      GToast.error({
        title: 'Failed to send feedback'
      })
    }
  })

  const onSubmit = (data: FeedbackType) => {
    send({
      content: data.content,
      rate: data.rate
    })
  }

  const { data: feedbacks, isLoading: isFeedbackLoading } = useQuery({
    queryKey: ['get-feedbacks'],
    queryFn: () => getFeedbacks({ page: 0, size: 10 }),
    enabled: !submitted,
    select: (data) => {
      return data.data.result
    }
  })

  return (
    <AppLayout>
      <Box
        maw={1000}
        mx={'auto'}
        px={32}
        py={20}
        className="rounded-lg bg-white shadow-sm"
      >
        <Stack gap={32}>
          <Flex align="center" gap={16}>
            <ThemeIcon size={48} radius="xl" color="indigo">
              <GIcon name="DevicesStar" size={28} />
            </ThemeIcon>
            <div>
              <Title order={2} className="text-indigo-800">
                Share Your Feedback
              </Title>
              <Text c="dimmed">
                Help us improve GspaceZ with your valuable insights
              </Text>
            </div>
          </Flex>

          <Divider />

          <Button
            onClick={() => {
              modals.open({
                title: 'Your Feedbacks',
                size: 'lg',
                children: (
                  <Stack>
                    {ownFeedback
                      ? ownFeedback.map((feedback) => (
                          <Paper
                            p={24}
                            radius="md"
                            withBorder
                            className="border-indigo-200 bg-indigo-50/50"
                            key={feedback.id}
                          >
                            <Stack gap={16}>
                              <Flex align="center" justify="space-between">
                                <Text fw={600} size="lg">
                                  Feedback at{' '}
                                  {format(new Date(feedback.createdAt), 'PP')}
                                </Text>
                                <Rating
                                  value={feedback.rate}
                                  readOnly
                                  size="md"
                                />
                              </Flex>
                              <Box className="rounded-md border border-indigo-100 bg-white p-3">
                                <Text>{feedback.content}</Text>
                              </Box>
                            </Stack>
                          </Paper>
                        ))
                      : null}
                  </Stack>
                )
              })
            }}
          >
            View your own feedbacks
          </Button>

          {submitted ? (
            <Paper
              p={24}
              radius="md"
              className="border border-indigo-100 bg-indigo-50"
            >
              <Stack align="center" gap={16}>
                <ThemeIcon size={60} radius="xl" color="green">
                  <GIcon name="Check" size={36} />
                </ThemeIcon>
                <Title order={3} className="text-center">
                  Thank You For Your Feedback!
                </Title>
                <Text size="lg" className="max-w-md text-center">
                  Your input helps us make GspaceZ better for everyone. We
                  appreciate you taking the time to share your thoughts.
                </Text>
                <Button
                  onClick={() => setSubmitted(false)}
                  variant="light"
                  color="indigo"
                  size="md"
                  radius="md"
                  leftSection={<GIcon name="Pencil" size={16} />}
                >
                  Submit Another Feedback
                </Button>
              </Stack>
            </Paper>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack gap={24}>
                <Paper
                  shadow="xs"
                  p={24}
                  radius="md"
                  withBorder
                  className="border-indigo-100"
                >
                  <Stack gap={24}>
                    <div>
                      <Text fw={500} size="lg" mb={8}>
                        How would you rate your experience?
                      </Text>
                      <Controller
                        name="rate"
                        control={control}
                        rules={{ required: true, min: 1 }}
                        render={({ field }) => (
                          <Rating
                            size="xl"
                            count={5}
                            value={field.value}
                            onChange={field.onChange}
                            color="indigo"
                            emptySymbol={
                              <GIcon name="Star" size={32} color="#E5E7EB" />
                            }
                            fullSymbol={
                              <GIcon
                                name="StarFilled"
                                size={32}
                                color="#6366F1"
                              />
                            }
                          />
                        )}
                      />
                    </div>

                    <div>
                      <Text fw={500} size="lg" mb={8}>
                        Tell us more about your experience
                      </Text>
                      <Controller
                        name="content"
                        control={control}
                        rules={{ required: true }}
                        render={({ field, fieldState }) => (
                          <Textarea
                            {...field}
                            placeholder="Share your thoughts, suggestions, or report issues..."
                            minRows={6}
                            autosize
                            radius="md"
                            error={fieldState.error?.message}
                            styles={{
                              input: {
                                fontSize: '16px',
                                border: '1px solid #E5E7EB',
                                '&:focus': {
                                  borderColor: '#6366F1'
                                }
                              }
                            }}
                          />
                        )}
                      />
                    </div>
                  </Stack>
                </Paper>

                <Group justify="right">
                  <Button
                    type="submit"
                    size="md"
                    radius="md"
                    loading={isPending}
                    disabled={!isDirty || !isValid}
                    leftSection={<GIcon name="Send" size={16} />}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    Submit Feedback
                  </Button>
                </Group>
              </Stack>
            </form>
          )}
        </Stack>

        {isFeedbackLoading ? (
          <Loader />
        ) : (
          <Stack mt={16}>
            {feedbacks?.map((feedback) => (
              <GFeedback key={feedback.id} feedback={feedback} />
            ))}
          </Stack>
        )}
      </Box>
    </AppLayout>
  )
}
