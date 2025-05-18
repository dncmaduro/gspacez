// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractArrayFromLlmOutput(content: string): any[] {
  // Loại bỏ code block và prefix kiểu markdown
  const match = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
  let jsonString = match ? match[1] : content

  // Remove prefix json:
  jsonString = jsonString.replace(/^json:?\s*/i, '').trim()

  // Tìm đúng dấu '[' bắt đầu, ']' kết thúc cho chắc (phòng trường hợp LLM chơi xỏ)
  const start = jsonString.indexOf('[')
  const end = jsonString.lastIndexOf(']')
  if (start !== -1 && end !== -1) {
    jsonString = jsonString.slice(start, end + 1)
  }

  try {
    return JSON.parse(jsonString)
  } catch (err) {
    console.error('Cannot parse LLM array:', jsonString, err)
    return []
  }
}
