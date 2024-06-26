import { Configuration, OpenAIApi } from 'openai';

const config = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(config);

export async function generatePostContent(req, res) {
  const { brandName, companySector,  } = req.body;
// //Prompt
// const prompt = `
//   Hello chatgpt, please do not return the word : "undefined", if a var is undefined just skip it.
// Act as an experienced marketing expert and copywriter,
// your task is to craft a concise, SEO-friendly summary of the brand ${brandName}, within a limit of 100 words. 
// This summary should encapsulate the core identity of the brand, accentuating its unique characteristics while establishing a clear connection to its specific brand description, ${companySector}.
// ${companySector} is a variable that act as a brand description
// The brand is celebrated for its distinctive and innovative ${tone} approach, setting it apart as a pioneer within the industry. 
// The resulting text will be used in social media posts to represent ${brandName}
  
// Try to start the caption with a clear and good hook to keep the user reading the post description
// Please do not forget to Include icons to give make the post pro for a social media post description for the ${brandName}
// Never return  undefined, do not include undefined word in the result
// Please include only the most 4 trending hashtags related to brands like :  ${companySector}
// Please format your response using SEO-friendly HTML, adhering to the following tags: p, h1, h2, h3, h4, h5, h6, strong, i, ul, li, and ol. Your creative input is crucial in establishing an engaging and memorable brand presence.
// `
const newPrompt = `
  Hello ChatGPT, act as an experienced marketing expert and copywriter. 

  Craft a concise, SEO-friendly summary of the brand ${brandName}, within 100 words. Highlight its unique characteristics and innovative approach, connecting it to its specific brand description, ${companySector}.

  This summary will be used for social media posts, so start with a strong hook to engage readers. Include icons to enhance the post and avoid the word "undefined." 

  Include the 4 most trending hashtags related to ${companySector}. Format your response using SEO-friendly HTML tags: p, h1, h2, h3, h4, h5, h6, strong, i, ul, li, and ol.
`;


  const postContentResult = await openai.createChatCompletion({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'Act as a social media post generator for companies.',
      },
      {
        role: 'user',
        content: newPrompt,
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

export async function generateTargetAudienceOptions(req, res) {
  const { companySector,  } = req.body;
//Prompt
const prompt = `
Given a brand description, provide a list of target audiences for the brand. The target audience list should be in the form of an array of objects, where each object has a 'label' and 'value'. The 'label' represents the category or type of audience, and the 'value' represents a specific group within that category.

Example:

Brand Description: "Real estate company"

Expected Target Audiences:

[  {label:'potential homebuyers', value:'potential homebuyers'},  {label:'property investors', value:'property investors'},  {label:'real estate agents', value:'real estate agents'}]
Instructions to Model:

Please generate a list of target audiences based on this brand description : ${companySector}. 
the output should be in an array of objects only
do not forget the array of objects (JSON) should be related to  ${companySector} only.
The number of objects should be < 5
If ${companySector} wasn't passed or provided return and empty array, the result should be related to ${companySector},
if ${companySector} === null or " ", do not generate any content

Never include a value that's should be added by the user like : [insert website URL]
The output always is an array of objects like this : [  {label:'lebel here', value:'value here'}]
`

  const postContentResult = await openai.createChatCompletion({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'Act as a social media post generator for companies, based on a brand description you will generate a list of target audiences.',
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

   res.json({ targetAudiences: cleanedPostContent });

  // res.json({ postContent });
}
export async function generateNewCaption(req, res) {
  const { userInput,caption  } = req.body;
//Prompt
const prompt = `
Considering the user prompt 
#1 - "${userInput}", 
please revise the following caption to align with it:
#2 -  "${caption}".
Ensure consistency in length and format with the user's instructions.
`

  const generatedCaption = await openai.createChatCompletion({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'Act as a social media post caption generator for companies, based on a user input, you will generate another version of the post caption.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0,
  });

  const captionContent = generatedCaption.data.choices[0]?.message.content || '';
  
   // Remove newline characters (\n) and backslash (\) from the captionContent
   const cleanedCaptionContent = captionContent.replace(/[\n\\]/g, '');

   res.json({ newCaption: cleanedCaptionContent });

  // res.json({ postContent });
}


