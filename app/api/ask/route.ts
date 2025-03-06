import { NextResponse } from 'next/server'; 
import { Ollama } from '@langchain/ollama'; 
import { TavilySearchResults } from '@langchain/community/tools/tavily_search';
import { AgentExecutor, createStructuredChatAgent } from 'langchain/agents'; 
import { ChatPromptTemplate } from '@langchain/core/prompts'; 

// Force the API to be dynamically executed on every request
export const dynamic = 'force-dynamic';

/**
 * Handles POST requests to the API.
 * 
 * This endpoint receives a user query, processes it using an Ollama LLM model and search tools, 
 * and returns a structured response based on the obtained results.
 * 
 * @param {Request} request - The HTTP request containing the user's query in the body.
 * @returns {NextResponse} A JSON response with the model's answer.
 */
export async function POST(request: Request) {
  try {
    // Extract the query from the request body
    const { query } = await request.json();
    console.log('Received query:', query);

    // Instantiate the LLM model using Ollama
    // Note: You can change 'mistral' to another model available in Ollama.
    const llm = new Ollama({ model: 'mistral'});

    // Define the tools the agent can use
    const TavilySearchTool = new TavilySearchResults({
      apiKey: process.env.TAVILY_API_KEY,   // Must set your Tavily API key in environment variables
      maxResults: 2 
    })

    const tools = [TavilySearchTool]

    const today = new Date().toLocaleDateString();
    
    // Define the agent's prompt, specifying how it should interact with the tools
    const prompt = ChatPromptTemplate.fromMessages([
      ['system', `You are an AI assistant that must always use available tools to answer user queries.
                  You are not allowed to generate an answer directly. 
                  You must call search tool before responding.
                  The current date is: ${today}.`],
      ['human', '{input}'],
      ['system', 'Use the following tools: ${tools}\nAvailable tools: {tool_names}\n{agent_scratchpad}'],
    ]);

    // Create a structured agent that will use the LLM and the defined tools
    const agent = await createStructuredChatAgent({
      llm,   // LLM model (can be changed)
      tools, // Available tools (Tavily search in this case)
      prompt, // Prompt template that guides the agent's behavior
    });

    // Create an agent executor to process the query and generate a response
    const executor = new AgentExecutor({
      agent,  // Configured agent with LLM and tools
      tools,  // The tools the agent can use
      returnIntermediateSteps: true, // Returns intermediate steps of the agent's reasoning
    });

    // Execute the query and get the agent's response
    const response = await executor.invoke({ input: query });
    console.log('Raw response:', response);

    // Handle the output format
    let outputText;
    if (response?.output?.answer) {
      // Si la respuesta contiene un "answer", úsalo directamente
      outputText = response.output.answer;
    } else if (typeof response?.output === 'string') {
      // Clean the output by stripping unnecessary characters
      outputText = response.output.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
    } else {
      // Si no hay una respuesta válida, devuelve un mensaje de error
      outputText = 'Sorry, I couldnt process your query.';
    }

    // Return the response as JSON
    return NextResponse.json({ answer: outputText });

  } catch (error) {
    console.error('Error in API route:', error);

    // Error handling
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message }, // Return the error message
        { status: 500 } // HTTP 500 (Internal Server Error)
      );
    }

    // Generic error handling
    return NextResponse.json(
      { error: 'Error processing your query. Please try again.' },
      { status: 500 }
    );
  }
}
