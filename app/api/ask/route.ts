import { NextResponse } from 'next/server';
import { Ollama } from '@langchain/ollama'; 
import { SerpAPI } from '@langchain/community/tools/serpapi'; 
import { AgentExecutor, createStructuredChatAgent } from 'langchain/agents';
import { ChatPromptTemplate } from '@langchain/core/prompts';

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    console.log('Received query:', query);

    const llm = new Ollama({ model: 'mistral' }); 

    const tools = [new SerpAPI(process.env.SERPAPI_API_KEY)];

    const prompt = ChatPromptTemplate.fromMessages([
      ['system', 'You are an AI assistant that answers user queries using web search tools.'],
      ['human', '{input}'],
      ['system', 'Available tools: {tools}\nTool names: {tool_names}\nScratchpad: {agent_scratchpad}'],
    ]);

    const agent = await createStructuredChatAgent({
      llm,
      tools,
      prompt,
    });

    const executor = new AgentExecutor({
      agent,
      tools,
    });

    const response = await executor.invoke({ input: query });
    console.log('Raw response:', response);

    let outputText;
    if (typeof response?.output === 'string') {
      outputText = response.output;
    } else {
      outputText = JSON.stringify(response?.output);
    }

    return NextResponse.json({ answer: outputText });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: 'Error processing your query. Please try again.' },
      { status: 500 }
    );
  }
}
