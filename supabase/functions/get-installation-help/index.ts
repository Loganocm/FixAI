import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Apikey",
};

interface RequestPayload {
  carMake: string;
  carModel: string;
  carYear: number;
  partName: string;
  conversationHistory?: Array<{ role: string; content: string }>;
}

/**
 * Searches YouTube for relevant installation videos using the YouTube Data API.
 * @returns A formatted markdown string with video links, or null if none are found or an error occurs.
 */
async function searchYouTubeVideos(
  apiKey: string,
  carMake: string,
  carModel: string,
  carYear: number,
  partName: string
): Promise<string | null> {
  const searchQuery = `${carYear} ${carMake} ${carModel} ${partName} installation guide`;
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
    searchQuery
  )}&type=video&maxResults=3&key=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error("YouTube API error:", await response.text());
      return null;
    }

    const data = await response.json();
    if (!data.items || data.items.length === 0) {
      console.log("No YouTube videos found for query:", searchQuery);
      return null;
    }

    let videoLinksMessage = "### Recommended Installation Videos\n\nHere are a few videos that might help you with the installation:\n\n";
    
    data.items.forEach((item: any) => {
      const videoId = item.id.videoId;
      const title = item.snippet.title;
      const channelTitle = item.snippet.channelTitle;
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

      // Format as a markdown list item with a link
      videoLinksMessage += `* **[${title}](${videoUrl})** by *${channelTitle}*\n`;
    });

    return videoLinksMessage;
  } catch (error) {
    console.error("Error searching YouTube:", error);
    return null;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiApiKey) {
      throw new Error("Gemini API key not configured");
    }

    const {
      carMake,
      carModel,
      carYear,
      partName,
      conversationHistory = [],
    }: RequestPayload = await req.json();

    const messages: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    // Construct the message history for Gemini
    if (conversationHistory.length > 0) {
      for (const msg of conversationHistory) {
        messages.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        });
      }
    } else { // This is the first call
      const systemPrompt = `You are an expert automotive mechanic assistant specializing in car part installation. 
Provide clear, comprehensive, step-by-step instructions for installing car parts. 
Include safety warnings, required tools, and helpful tips. Format your response using markdown.`;

      const userPrompt = `I need help installing a ${partName} on my ${carYear} ${carMake} ${carModel}. 
Please provide a COMPLETE and DETAILED guide including:
1. Overview of the installation process
2. Required tools and materials
3. Safety precautions
4. Step-by-step instructions
5. Common mistakes to avoid
6. Tips for success`;

      messages.push({
        role: "user",
        parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
      });
    }

    // --- 1. Get the primary installation guide from Gemini ---
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: messages,
          generationConfig: {
            temperature: 0.6,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          },
        }),
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      throw new Error(`Gemini API Error: ${geminiResponse.status} ${errorText}`);
    }

    const data = await geminiResponse.json();
    const assistantGuideMessage =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't generate a response.";

    // --- Array to hold all new assistant messages for this turn ---
    const newAssistantMessages = [{ role: "assistant", content: assistantGuideMessage }];

    // --- 2. If it's the first call, also search for YouTube videos ---
    if (conversationHistory.length === 0) {
      const youtubeApiKey = Deno.env.get("YOUTUBE_API_KEY");
      if (youtubeApiKey) {
        const videoMessageContent = await searchYouTubeVideos(
          youtubeApiKey,
          carMake,
          carModel,
          carYear,
          partName
        );
        if (videoMessageContent) {
          // Add the video message as a second, separate object in the array
          newAssistantMessages.push({ role: "assistant", content: videoMessageContent });
        }
      } else {
        console.warn("YOUTUBE_API_KEY not configured. Skipping video search.");
      }
    }

    // --- 3. Return only the new messages ---
    return new Response(
      JSON.stringify({
        newMessages: newAssistantMessages,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in Supabase function:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "An unexpected error occurred",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
