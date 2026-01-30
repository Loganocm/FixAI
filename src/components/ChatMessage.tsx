import { MessageCircle, Wrench } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';

// Extend the Window interface to include the YouTube IFrame API types
// This prevents TypeScript errors when accessing window.YT
declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: {
      Player: new (
        elementId: HTMLElement,
        options: {
          height: string;
          width: string;
          videoId: string;
          playerVars?: Record<string, any>;
          events?: {
            onError: (event: any) => void;
          };
        }
      ) => any;
    };
  }
}

// --- LOGIC TO FIX RACE CONDITION ---
// These variables live outside the component to manage the global state of the YouTube API.
const youtubeApiQueue: (() => void)[] = [];
let isApiScriptLoading = false;
let isApiReady = false; // Flag to track if the API is fully ready

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

/* ----------------------- YOUTUBE EMBED HANDLER (FIXED) ----------------------- */

// A robust regex to extract the video ID from any YouTube URL
const getYouTubeId = (url: string): string | null => {
  const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  // Ensure the extracted ID is exactly 11 characters (standard YouTube video ID length)
  return (match && match[1] && match[1].length === 11) ? match[1] : null;
};

interface YouTubePlayerProps {
  videoId: string;
  componentKey: number; // Renamed 'key' to 'componentKey' to avoid React's reserved 'key' prop
}

// DEDICATED REACT COMPONENT for YouTube embedding and error handling
const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ videoId, componentKey }) => {
  const [error, setError] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!videoId) {
      setError(true);
      return;
    }
    
    let player: any;

    const initializePlayer = () => {
      // Ensure the ref is still valid when this function is called from the queue
      if (playerRef.current) {
        player = new window.YT.Player(playerRef.current, {
          height: '100%',
          width: '100%',
          videoId: videoId,
          playerVars: {
            'rel': 0,
            'modestbranding': 1,
            'autoplay': 0,
          },
          events: {
            'onError': (event: any) => {
              console.error(`Youtubeer Error for video ID ${videoId}:`, event.data);
              setError(true);
            },
          },
        });
      }
    };

    // If the API is already loaded and ready, initialize the player immediately.
    if (isApiReady && window.YT) {
      initializePlayer();
    } else {
      // Otherwise, add the initialization function to the queue.
      youtubeApiQueue.push(initializePlayer);
      
      // If the API script is not already being loaded, start loading it.
      if (!isApiScriptLoading) {
        isApiScriptLoading = true;
        
        // The global callback is defined only once.
        window.onYouTubeIframeAPIReady = () => {
          isApiReady = true;
          isApiScriptLoading = false;
          // When the API is ready, process all players in the queue.
          youtubeApiQueue.forEach(initFn => initFn());
          youtubeApiQueue.length = 0; // Clear the queue after processing
        };

        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        // Appending to head is safer than relying on the first script tag
        document.head.appendChild(tag);
      }
    }
    
    // Cleanup function:
    return () => {
      if (player) {
        player.destroy();
      }
      // If the component unmounts before the player is initialized, remove it from the queue.
      const index = youtubeApiQueue.indexOf(initializePlayer);
      if (index > -1) {
        youtubeApiQueue.splice(index, 1);
      }
    };
  }, [videoId]);

  // Render fallback if an error occurred or videoId is initially invalid
  if (error) {
    return (
      <div
        key={componentKey}
        className="my-4 w-full aspect-video rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center"
      >
        <a
          href={`https://www.youtube.com/watch?v=${videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="relative w-full h-full block group"
          title="Watch on YouTube"
        >
          <img
            src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
            alt="YouTube thumbnail"
            onError={(e) => {
              // Fallback for when the thumbnail itself fails to load
              (e.target as HTMLImageElement).src = `https://placehold.co/480x360/cccccc/333333?text=Video+Unavailable`;
            }}
            className="w-full h-full object-cover transition-opacity duration-200 group-hover:opacity-80"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40">
            <p className="text-white bg-black bg-opacity-60 px-4 py-2 rounded-md text-center">
              Video is unavailable.
              <br/>
              <span className="underline">Click to watch on YouTube</span>
            </p>
          </div>
        </a>
      </div>
    );
  }

  // Render the container div where the YouTube player will be injected
  return (
    <div
      key={componentKey}
      className="my-4 w-full aspect-video rounded-lg overflow-hidden bg-black/5 flex items-center justify-center"
    >
      <div ref={playerRef} className="w-full h-full" />
    </div>
  );
};

// The original renderYouTubeEmbed function now acts as a wrapper
function renderYouTubeEmbed(url: string, key: number): JSX.Element {
  const videoId = getYouTubeId(url);

  if (!videoId) {
    return (
      <a
        key={key}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline break-words"
      >
        {url}
      </a>
    );
  }

  return <YouTubePlayer videoId={videoId} componentKey={key} />;
}


/* ----------------------- MARKDOWN PARSER ----------------------- */
function parseInlineMarkdown(text: string): (string | JSX.Element)[] {
  const elements: (string | JSX.Element)[] = [];
  let key = 0;
  let currentIndex = 0;

  const boldItalicRegex = /\*\*\*(.+?)\*\*\*/g;
  const boldRegex = /\*\*(.+?)\*\*/g;
  const codeRegex = /`(.+?)`/g;
  // Regex to capture markdown links: [Link Text](URL)
  const markdownLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s]+)\)/g;

  const allMatches: { index: number; length: number; type: string; content: string; url?: string }[] = [];
  let match: RegExpExecArray | null;
  let safetyCounter = 0;
  while ((match = boldItalicRegex.exec(text)) !== null && safetyCounter++ < 1000)
    allMatches.push({ index: match.index, length: match[0].length, type: 'bolditalic', content: match[1] });
  
  safetyCounter = 0;
  while ((match = boldRegex.exec(text)) !== null && safetyCounter++ < 1000)
    allMatches.push({ index: match.index, length: match[0].length, type: 'bold', content: match[1] });

  safetyCounter = 0;
  while ((match = codeRegex.exec(text)) !== null && safetyCounter++ < 1000)
    allMatches.push({ index: match.index, length: match[0].length, type: 'code', content: match[1] });
  
  // Process markdown links first to prioritize their parsing
  while ((match = markdownLinkRegex.exec(text)) !== null) {
    allMatches.push({ index: match.index, length: match[0].length, type: 'markdownLink', content: match[1], url: match[2] });
  }
  
  // Quick optimization: limit total matches to prevent freezing on huge text
  if (allMatches.length > 100) {
      allMatches.length = 100; 
  }

  // Then process generic URLs, but ensure they don't overlap
  // Simple check: if we already have matches, skip generic url regex to avoid complexity for now, 
  // or just run it simply.
  // The user reported "ran amok", implying performance freeze or crash.
  // Let's rely on standard parsing for the rest.

  // ... (Bold/Italic processing remains, it's fast)


  allMatches.sort((a, b) => a.index - b.index);

  const nonOverlapping = [];
  let lastEnd = 0;
  for (const m of allMatches) {
    if (m.index >= lastEnd) {
      nonOverlapping.push(m);
      lastEnd = m.index + m.length;
    }
  }

  for (const m of nonOverlapping) {
    if (currentIndex < m.index) elements.push(text.substring(currentIndex, m.index));

    switch (m.type) {
      case 'bolditalic':
        elements.push(<strong key={key++} className="font-bold italic">{parseInlineMarkdown(m.content)}</strong>);
        break;
      case 'bold':
        elements.push(<strong key={key++} className="font-bold">{parseInlineMarkdown(m.content)}</strong>);
        break;
      case 'code':
        elements.push(<code key={key++} className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">{m.content}</code>);
        break;
      case 'markdownLink':
        if (m.url && (m.url.includes('youtube.com') || m.url.includes('youtu.be'))) {
          elements.push(renderYouTubeEmbed(m.url, key++));
        } else {
          elements.push(
            <a key={key++} href={m.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-words">
              {m.content}
            </a>
          );
        }
        break;
      case 'plainLink': // This is for unbracketed URLs
        if (m.content.includes('youtube.com') || m.content.includes('youtu.be')) {
          elements.push(renderYouTubeEmbed(m.content, key++));
        } else {
          elements.push(
            <a key={key++} href={m.content} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-words">
              {m.content}
            </a>
          );
        }
        break;
    }
    currentIndex = m.index + m.length;
  }

  if (currentIndex < text.length) elements.push(text.substring(currentIndex));
  return elements;
}

/* ----------------------- BLOCK MARKDOWN (UPDATED) ----------------------- */
function parseMarkdown(text: string): JSX.Element[] {
  const elements: JSX.Element[] = [];
  let key = 0;
  const lines = text.split('\n');
  let currentParagraph: string[] = [];

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const content = currentParagraph.join('\n');
      elements.push(
        <p key={key++} className="mb-3 last:mb-0">
          {parseInlineMarkdown(content)}
        </p>
      );
      currentParagraph = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // ✅ Special rule for YouTube video lines to override default list parsing
    const videoLineRegex = /^\*\s\*\*\[([^\]]+)\]\((https?:\/\/(?:www\.)?youtube\.com\/watch\?v=[^)]+)\)\*\* by .*$/;
    const videoMatch = line.match(videoLineRegex);
    
    if (videoMatch) {
      flushParagraph(); // Flush any preceding text
      const title = videoMatch[1];
      const url = videoMatch[2];
      
      elements.push(
        <div key={key++} className="mb-4">
          <p className="font-bold text-gray-800">{title}</p>
          {renderYouTubeEmbed(url, key++)}
        </div>
      );
    } else if (line.startsWith('#### ')) {
      flushParagraph();
      elements.push(
        <h4 key={key++} className="text-base font-bold mb-2 mt-3 first:mt-0">
          {parseInlineMarkdown(line.substring(5))}
        </h4>
      );
    } else if (line.startsWith('### ')) {
      flushParagraph();
      elements.push(
        <h3 key={key++} className="text-lg font-bold mb-2 mt-4 first:mt-0">
          {parseInlineMarkdown(line.substring(4))}
        </h3>
      );
    } else if (line.startsWith('## ')) {
      flushParagraph();
      elements.push(
        <h2 key={key++} className="text-xl font-bold mb-3 mt-4 first:mt-0">
          {parseInlineMarkdown(line.substring(3))}
        </h2>
      );
    } else if (line.startsWith('# ')) {
      flushParagraph();
      elements.push(
        <h1 key={key++} className="text-2xl font-bold mb-3 mt-4 first:mt-0">
          {parseInlineMarkdown(line.substring(2))}
        </h1>
      );
    } else if (line.match(/^\d+\.\s/)) {
      flushParagraph();
      const listItems: string[] = [line];
      while (i + 1 < lines.length && lines[i + 1].match(/^\d+\.\s/)) listItems.push(lines[++i]);
      elements.push(
        <ol key={key++} className="list-decimal list-inside mb-3 space-y-1">
          {listItems.map((item, idx) => (
            <li key={idx}>{parseInlineMarkdown(item.replace(/^\d+\.\s/, ''))}</li>
          ))}
        </ol>
      );
    } else if (line.match(/^[-*]\s/)) {
      flushParagraph();
      const listItems: string[] = [line];
      while (i + 1 < lines.length && lines[i + 1].match(/^[-*]\s/)) listItems.push(lines[++i]);
      elements.push(
        <ul key={key++} className="list-disc list-inside mb-3 space-y-1">
          {listItems.map((item, idx) => (
            <li key={idx}>{parseInlineMarkdown(item.replace(/^[-*]\s/, ''))}</li>
          ))}
        </ul>
      );
    } else if (line.trim() === '') {
      flushParagraph();
    } else {
      currentParagraph.push(line);
    }
  }

  flushParagraph();
  return elements;
}

/* ----------------------- MAIN COMPONENT (UPDATED) ----------------------- */
export function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === 'user';

  // ✅ Check if the content contains a YouTube link to apply special styling.
  const hasVideo = !isUser && /youtube\.com|youtu\.be/.test(content);

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
          <Wrench className="w-4 h-4 text-white" />
        </div>
      )}

      <div
        className={`rounded-lg px-4 py-3 transition-all duration-300 ${
          // ✅ If the message contains a video, allow it to be wider.
          hasVideo ? 'w-full max-w-2xl' : 'max-w-[80%]'
        } ${
          isUser ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 border border-gray-200'
        }`}
      >
        <div className="text-sm leading-relaxed">
          {isUser ? <p className="whitespace-pre-wrap">{content}</p> : parseMarkdown(content)}
        </div>
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
          <MessageCircle className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
}

