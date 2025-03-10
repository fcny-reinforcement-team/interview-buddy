import { useState, ChangeEvent } from 'react';
import './styles/app.css';
import { FaArrowUp } from "react-icons/fa6";
import logo from './assets/InterviewBuddyLogo.png';

const App: React.FC = () => {

  const [language, setLanguage] = useState(''); 
  const [topic, setTopic] = useState(''); 
  const [difficulty, setDifficulty] = useState(''); 
  const [value, setValue] = useState<string>(''); 
  const [response, setResponse] = useState<string>('')
  const [isHovered, setIsHovered] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  }

  const sendParameters = async () => {
    if (!language || !topic || !difficulty) return; //! add error message
    try {
      const parameters = `Language: ${language}, Topic: ${topic}, Difficulty: ${difficulty}`;
      const res = await fetch('https://api.openai.com/v1/chat/completions', { //! figure out link
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json', 
        //   Authorization: `Bearer ${OPENAI_API_KEY}`, //! figure out api key
        }, 
        body: JSON.stringify({
          model: "gpt-4o-mini", //! confirm model
          messages: [{ role: "user", content: parameters}], //! confirm role
        }),
      });
      const data = await res.json(); 
      setResponse(data.choices?.[0].message.content); //! figure out format of response
    } catch (error) {
      console.error('Error fetching OpenAI API:', error); 
    }
  }

  const sendResponse = async () => {
    console.log('This is value:', value); 
    if (!value) return; //! add error message
    try {
      const res = await fetch('link', { //! figure out link
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json', 
        //   Authorization: `Bearer ${OPENAI_API_KEY}`, //! figure out api key
        }, 
        body: JSON.stringify({
          model: "gpt-4", 
          messages: [{ role: "user", content: value}], 
        }),
      });
      const data = await res.json(); 
      setResponse(data); //! figure out format of response
      setValue(''); 
    } catch (error) {
      console.error('Error fetching OpenAI API:', error); 
      setValue(''); 
    }
  }

  return (
    <div>
      <h1 className="app-name">
        <img src={logo} alt="InterviewBuddy Logo"></img>
      </h1>
      <div className="chat-interface">
        <div className="chat-area">
          <div className="content-wrapper">
            <div className="messages-container">
            {/* <InitialQuestions /> */}
            <div className="user-content">
              <p className="user-content-p">this is just filler text, blah blah blah. this is just filler text, blah blah blah. this is just filler text, blah blah blah. this is just filler text, blah blah blah.</p>
            </div>
            <div className="chat-content">
                <div className="algo-header">
                  <h3 className="chat-content-elems">Merge Intervals</h3>
                  <span className="difficulty chat-content-elems">medium</span>
                </div>
                <div className="algo-description">
                  <p className="chat-content-elems">Given an array of intervals where intervals[i] = [start_i, end_i], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.</p>
                </div>
                <div className="algo-examples">
                  <div className="algo-example">
                    <h4 className="chat-content-elems">Example 1:</h4>
                    <p className="chat-content-elems"><strong className="chat-content-elems">Input:</strong>intervals = [[1,3],[2,6],[8,10],[15,18]]</p>
                    <p className="chat-content-elems"><strong className="chat-content-elems">Output:</strong>[[1,6],[8,10],[15,18]]</p>
                    <p className="chat-content-elems"><strong className="chat-content-elems">Explanation:</strong>Since intervals [1,3] and [2,6] overlap, merge them into [1,6].</p>
                  </div>
                </div>
                <div className="algo-constraints">
                  <h4 className="chat-content-elems">Constraints:</h4>
                  <ul className="chat-content-elems">
                    <li className="chat-content-elems">1  intervals.length  10^4</li>
                    <li className="chat-content-elems">intervals[i].length == 2</li>
                  </ul>
                </div>
                <div className="code-editor chat-content-elems">
                  <pre>
                    <code className="code chat-content-elems">
                      {
`function mergeIntervals(intervals: number[][]): number[][] {
  // Your implementation here
  
  return [];
}

// Test cases
const testCases = [
    {
      intervals: [[1,3],[2,6],[8,10],[15,18]],
      expected: [[1,6],[8,10],[15,18]],
      name: "Multiple merges"
    },
    {
      intervals: [[1,4],[4,5]],
      expected: [[1,5]],
      name: "Edge touching intervals"
    },
    {
      intervals: [[1,4],[2,3]],
      expected: [[1,4]],
      name: "Completely contained interval"
    },
    {
      intervals: [[1,3],[4,6],[7,10]],
      expected: [[1,3],[4,6],[7,10]],
      name: "No overlapping intervals"
    }
  ];

// Test function
function runTests() {
  for (const test of testCases) {
    const result = mergeIntervals(test.intervals);
    const passed = JSON.stringify(result) === JSON.stringify(test.expected);
    console.log(\`Test "\${test.name}": \${passed ? "PASSED" : "FAILED"}\`);
    if (!passed) {
      console.log(\`  Expected: \${JSON.stringify(test.expected)}\`);
      console.log(\`  Got: \${JSON.stringify(result)}\`);
    }
  }
}

// Uncomment to run tests
// runTests();`
                      }
                    </code>
                  </pre>
                </div>
            </div>
            <div className="user-content">
              <p className="user-content-p">another line of filler text.</p>
            </div>
          </div>
        </div>
        <div className="user-area">
          <div className="textarea-wrapper">
            <textarea className="user-textarea" value={value} onChange={handleChange} placeholder='Reply to Buddy...'></textarea>
          </div>
          <div className="button-wrapper">
            <button className="send-button" 
              onClick={sendResponse}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}>
              <FaArrowUp style={{fontSize:'1.5em', strokeWidth: '2', backgroundColor: isHovered ? '#7c886a' : '#DBEFBC'}}/>
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;