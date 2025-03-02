import { GenerateTextRequest } from './models'
import { GoogleGenerativeAI } from '@google/generative-ai'

export const useGemini = () => {
  const generateText = async (req: GenerateTextRequest) => {
    const generativeAi = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY)
    const model = generativeAi.getGenerativeModel({ model: 'gemini-1.5-flash' })

    return await model.generateContent([req.prompt])
  }

  return { generateText }
}
