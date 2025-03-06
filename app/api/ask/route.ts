import { NextResponse } from 'next/server';
import { Ollama } from '@langchain/ollama'; 
import { TavilySearchResults } from '@langchain/community/tools/tavily_search';
import { AgentExecutor, createStructuredChatAgent } from 'langchain/agents';
import { ChatPromptTemplate } from '@langchain/core/prompts';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    console.log('Received query:', query);

    const llm = new Ollama({ model: 'mistral' });

    const tools = [
      new TavilySearchResults({
        apiKey: process.env.TAVILY_API_KEY,
      }),
    ];

    const prompt = ChatPromptTemplate.fromMessages([
      ['system', `You are an AI assistant that must always use available tools to answer user queries.
                  You are not allowed to generate an answer directly. 
                  You must call search tool before responding.
                  `],
      ['human', '{input}'],
      ['system', 'Use the following tools: {tools}\nAvailable tools: {tool_names}\n{agent_scratchpad}'],
    ]);
    
    const agent = await createStructuredChatAgent({
      llm,
      tools,
      prompt,
    });

    const executor = new AgentExecutor({
      agent,
      tools,
      returnIntermediateSteps: true,
    });

    const response = await executor.invoke({ input: query });
    console.log('Raw response:', response);


    let outputText;
    if (typeof response?.output === 'string') {
      outputText = response.output.replace(/[\u0000-\u001F\u007F-\u009F]/g, ''); 
    } else {
      outputText = JSON.stringify(response?.output);
    }
    
    return NextResponse.json({ answer: outputText });

  }catch (error) {
      console.error('Error in API route:', error);
      if (error instanceof Error) {
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        );
      }
      return NextResponse.json(
        { error: 'Error processing your query. Please try again.' },
        { status: 500 }
      );
    }
}


