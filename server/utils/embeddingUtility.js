const axios = require('axios')

const COHERE_API_URL = 'https://api.cohere.ai/v1/embed'
const COHERE_API_KEY = process.env.COHERE_API_KEY

async function getEmbedding(text) {
    const response = await axios.post(
        COHERE_API_URL,
        {
            texts: [text],
            model: "embed-english-v3.0", // or "embed-multilingual-v3.0" for multilingual
            input_type: "search_document"
        },
        {
            headers: {
                Authorization: `Bearer ${COHERE_API_KEY}`,
                "Content-Type": "application/json"
            }
        }
    )
    return response.data.embeddings[0]
}

function cosineSimilarity(vecA, vecB) {
    const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0)
    const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0))
    const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0))
    return magA && magB ? dot / (magA * magB) : 0
}

module.exports = { getEmbedding, cosineSimilarity }