import { useMemo, useState } from 'react'
import { isTLDR } from '../../utils/isTLDR'
import { Button, Text } from '@mantine/core'

interface Props {
  content: string
}

export const GPostParagraph = ({ content }: Props) => {
  const [readAll, setReadAll] = useState(false)
  const isTL = useMemo(() => isTLDR(content), [content])

  return (
    <>
      {isTL ? (
        <>
          <Text>{readAll ? content : content.substring(0, 200)}</Text>
          <Button
            variant="subtle"
            size="sm"
            onClick={() => setReadAll(!readAll)}
          >
            Read more
          </Button>
        </>
      ) : (
        <Text>{content}</Text>
      )}
    </>
  )
}
