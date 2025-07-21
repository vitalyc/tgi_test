import * as dotenv from 'dotenv';
import axios from 'axios';
import { Job } from "./types";


// Your API key from environment variables
const API_KEY: string | undefined = process.env.XAI_API_KEY;
if (!API_KEY) {
    throw new Error('XAI_API_KEY environment variable is not set');
}


class AnalysisResult {
    protected _input: number = 0;
    protected _result: any = {result: {}, metadata: {analysis_date: new Date().toISOString(), input_records: 0}};

    protected hashString(str:string) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash * 31 + str.charCodeAt(i)) | 0; // Fast 32-bit hash
        }
        return hash;
    }

    setResult(jobs:Job[], result:any) {

        if(result?.analysis?.chartConfiguration ){
            result.analysis.chartVisualizationUrl = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(result.analysis.chartConfiguration))}`;
            result.analysis.chartConfiguration = undefined; // Remove chartConfiguration
        }

        this._input = this.hashString(JSON.stringify(jobs));
        this._result = result;
    }

    compareInput(jobs:Job[]){
        const hash = this.hashString(JSON.stringify(jobs));
        return this._input === hash;
    }
    get result() {
        return this._result;
    }
}

const lastAnalytics = new AnalysisResult();


export async function analyzeProcessLog(jobs: Job[]) {
    if(!jobs || jobs.length === 0) {
        return {result: {}, metadata: {analysis_date: new Date().toISOString(), input_records: 0}};
    }

    if(lastAnalytics.compareInput(jobs)) {
        console.log('Returning cached analysis for the same input size:', jobs.length);
        return lastAnalytics.result;
    }

    // Instruction to Grok 3 Mini
    const instruction: string = `
Analyze the provided JSON log of process runs, where each entry includes process name, arguments, status, and other details. Identify patterns or groups of successes (status: "completed", exitCode: 0) and failures (status: "crashed", non-zero exitCode). Look for correlations between process names, arguments, or other factors and failures. Organize the analysis into a machine-readable JSON format, including:
- Summary of total runs, completed, crashed, retried and running.
- Breakdown by process name with success/failure counts and argument analysis.
- Key findings on failure causes, success/failure groups, and retry behavior.
- Recommendations for addressing failures.
- A chartjs-compatible bar chart configuration for visualizing processes statuses by process under chartConfiguration property.
Return the response as a JSON object with an "analysis" key containing the structured results and a "metadata" key with analysis_date and input_records. Exclude reasoning_content and ensure the response is complete and parseable as JSON without truncation.
`;
    // Messages array for the chat completions API
    const messages = [
        {
            role: 'user',
            content: `${instruction}\nInput JSON: ${JSON.stringify(jobs)}`
        }
    ];
    try {
        const response:any = await axios.post(
            'https://api.x.ai/v1/chat/completions',
            {
                model: 'grok-3-mini',
                messages,
                response_format: { type: 'json_object' },
                reasoning_effort: 'low',
                max_tokens: 4000
            },
            {
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('Analysis Response:', JSON.stringify(response.data, null, 2));

        // Handle stringified content
        const content = response.data.choices[0].message.content;
        let parsedContent;
        try {
            parsedContent = typeof content === 'string' ? JSON.parse(content) : content;
        } catch (parseError) {
            console.error('Failed to parse message.content as JSON:', parseError);
            console.error('Raw content:', content);
            throw new Error('Response content is not valid JSON');
        }

        // Check for truncation (incomplete JSON structure)
        if (!parsedContent.analysis || !parsedContent.metadata) {
            console.error('Response appears truncated. Missing analysis or metadata:', parsedContent);
            throw new Error('Response JSON is incomplete');
        }

        lastAnalytics.setResult(jobs, parsedContent);
        return parsedContent;

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error making API request:', error.response ? error.response.data : error.message);
        } else {
            console.error('Unexpected error:', error);
        }
        throw error;
    }
}
