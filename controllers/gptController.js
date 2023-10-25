import { Configuration, OpenAIApi } from 'openai';

const config = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(config);

export async function generateBlogPost(req, res) {
  const { targetAudience, platform,question,tone, brandName, companySector,  } = req.body;
//Prompt
const prompt = `As an experienced marketing expert and copywriter,
 your task is to craft a concise, SEO-friendly summary of the brand,
  ${brandName}, within a limit of 100 words. 
  This summary should encapsulate the core identity of the brand, accentuating its unique characteristics while establishing a clear connection to its specific brand description, ${companySector}.
  ${companySector} is a variable that act as a brand description
  The brand is celebrated for its distinctive and innovative ${tone} approach, setting it apart as a pioneer within the industry. 
  The resulting text will be used in social media posts to represent ${brandName}.
  
  Include icons to give make the post pro for a social media post description for the ${brandName}

   Please format your response using SEO-friendly HTML, adhering to the following tags: p, h1, h2, h3, h4, h5, h6, strong, i, ul, li, and ol. Your creative input is crucial in establishing an engaging and memorable brand presence.
`

const promptUpdated =`Make a 50 word summary of the company based on the following inputs : 
  Name : ${brandName},
    Brand description : ${companySector},
  Tone : ${tone}

The response should be formatted in SEO-friendly HTML, 
limited to the following HTML tags: p, h1, h2, h3, h4, h5, h6, strong, i, ul, li, ol.
` 
const promptUpdatedTwo =`Create a concise in less than 100-word summary of ${brandName}, a ${companySector} company known for its ${tone} approach. ${brandName} stands out with its unique blend of
 innovation and dedication. Discover more about their exceptional offerings and commitment to excellence.
Do not include any fake number
this summary will be used as a social media post for the brand ${brandName}

The response should be formatted in SEO-friendly HTML, 
limited to the following HTML tags: p, h1, h2, h3, h4, h5, h6, strong, i, ul, li, ol.

` 

  const postContentResult = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'Act as a social media post generator for companies.',
      },
      {
        role: 'user',
        content: prompt,
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
