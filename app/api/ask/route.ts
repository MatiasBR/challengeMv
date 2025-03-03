import { NextResponse } from 'next/server';
import { Ollama } from '@langchain/ollama'; 
import { SerpAPI } from '@langchain/community/tools/serpapi'; 
import { AgentExecutor, createReactAgent } from 'langchain/agents'; 
import { ChatPromptTemplate } from '@langchain/core/prompts'; 

export async function POST(request: Request) {
  try {
    const { query } = await request.json(); 
    console.log('Received query:', query);

    const llm = new Ollama({ model: 'llama2' });
    console.log('Ollama model configured:', llm);

    const tools = [new SerpAPI(process.env.SERPAPI_API_KEY)];
    console.log('Tools configured:', tools);

    const prompt = ChatPromptTemplate.fromMessages([
      ['system', 'You are an AI assistant that answers questions using web search tools.'],
      ['human', '{input}'],
      ['system', 'Available tools: {tools}\nTool names: {tool_names}\nScratchpad: {agent_scratchpad}'],
    ]);

    const agent = await createReactAgent({
      llm,
      tools,
      prompt,
    });

    console.log('Agent created:', agent);

    
    const executor = AgentExecutor.fromAgentAndTools({
      agent,
      tools,
    });

    console.log('Executor created:', executor);

    const response = await executor.invoke({ input: query }); 
    console.log('Raw response:', response);

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(response?.output ?? '{}');
    } catch (error) {
      console.error('Error parsing LLM output:', error);
      parsedResponse = { error: 'Invalid JSON output from LLM' };
    }

    console.log('Parsed response:', parsedResponse);

    return NextResponse.json(parsedResponse);
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: 'Error processing your query. Please try again.' },
      { status: 500 }
    );
  }
}

