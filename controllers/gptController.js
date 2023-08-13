import { Configuration, OpenAIApi } from 'openai';

const config = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(config);

export async function generateBlogPost(req, res) {
  const { targetAudience, platform,question,tone, brandName, companySector,  } = req.body;
//Prompt
const prompt = `You are a marketing expert, targeting " + ${targetAudience} + " on " + ${platform} + ", make an engaging '" + ${question} + "' post talking in an '" + ${tone} + "' tone.", 
The response should be formatted in SEO-friendly HTML, 
limited to the following HTML tags: p, h1, h2, h3, h4, h5, h6, strong, i, ul, li, ol.
`

const promptUpdated =`Make a summary of the company based on the following inputs : 
  Name : ${brandName},
  Sector : ${companySector},
  Tone : ${tone}

The response should be formatted in SEO-friendly HTML, 
limited to the following HTML tags: p, h1, h2, h3, h4, h5, h6, strong, i, ul, li, ol.
` 

  const postContentResult = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are a brand engagement post generator.',
      },
      {
        role: 'user',
        content: promptUpdated,
      },
    ],
    temperature: 0,
  });

  const postContent = postContentResult.data.choices[0]?.message.content || '';
  
   // Remove newline characters (\n) and backslash (\) from the postContent
   const cleanedPostContent = postContent.replace(/[\n\\]/g, '');

   res.json({ postContent: cleanedPostContent });

  // res.json({ postContent });
}
