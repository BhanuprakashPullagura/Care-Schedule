import { GoogleGenerativeAI } from "@google/generative-ai";

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // ✅ CORRECT MODEL FORMAT
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: message }]
        }
      ]
    });

    const response = result.response.text();

    res.json({ success: true, reply: response });

  } catch (error) {
    console.log("Gemini Error:", error);
    res.json({ success: false, message: error.message });
  }
};