import React,{ JSX, useState, useEffect, ChangeEvent } from 'react';
import './styles/app.css';
import { FaArrowUp } from "react-icons/fa6";
import QuestionsComponent from './components/InitialQuestions'
import logo from './assets/InterviewBuddyLogo.png';
import ReactMarkdown from 'react-markdown';


interface Message {
  message: string;
}

const App: React.FC = () => {

  const [userResponse, setUserResponse] = useState<string>(''); 
  const [questionsCompleted, setQuestionsCompleted] = useState<boolean>(false); 
  const [chatResponse, setChatResponse] = useState<string>('');
  const [fullChat, setFullChat] = useState<Message[]>([]); 
  const [isSendButtonHovered, setIsSendButtonHovered] = useState<boolean>(false);
  const [readyToSendResponse, setReadyToSendResponse] = useState<boolean>(false); 

//   useEffect(() => {
//     console.log('Updated userResponse state variable in parent:', userResponse);
//   }, [userResponse]);

//   useEffect(() => {
//     console.log('Updated questionsCompleted state variable in parent:', questionsCompleted);
//   }, [questionsCompleted]);

  // useEffect(() => {
  //   console.log('Updated fullChat state variable in parent:', fullChat);
  // }, [fullChat]);

  useEffect(() => {
    // console.log('Updated chatResponse state variable in parent:', chatResponse);
    if (chatResponse) {
      updateChatArray(chatResponse); 
    }
  }, [chatResponse]);

  useEffect(() => {
    if (readyToSendResponse === true) {
    //   console.log('This is the user\'s response:', userResponse); 
      updateChatArray(userResponse); 
      const sendResponse = async () => {
        if (!userResponse) return; //! add error message
             
        const sessionId = getSessionId();
            
        try {
          const parameters = {
            sessionId,
            userMessage: userResponse, 
          }; 
        //   console.log('This is the userResponseInfo being sent to the backend:', parameters); 
          const res = await fetch('/api/message', { 
            method: 'POST', 
            headers: {
              'Content-Type': 'application/json', 
            }, 
            body: JSON.stringify({ parameters }),
          });
          const data = await res.json(); 
        //   console.log('This is the data returned from the subsequent request to the api:', data.message); 
          setChatResponse(data.message);
          setReadyToSendResponse(false); 
        } catch (error) {
          console.error('Error fetching OpenAI API:', error); 
          setUserResponse(''); 
        }
      } 
      sendResponse();  
    }
  }, [readyToSendResponse]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setUserResponse(e.target.value);
  }

  const updateChatArray = (newResponse: string) => {
    const newMessage = {
      message: newResponse,
    }
    const updatedChatArray = [...fullChat, newMessage]
    setFullChat(updatedChatArray); 
    setUserResponse(''); 
  }

  const handleQuestionsComponentState = (state: boolean) => {
    setQuestionsCompleted(state); 
  }
  
  const getSessionId = () => {
    let sessionId = localStorage.getItem("sessionId")
    if (!sessionId) {
      sessionId = "session-" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("sessionId", sessionId);
    }
    return sessionId;
  }

  const renderFullChat = () => {
    if (fullChat.length === 0) return; 

    return (
      <> 
        {fullChat.map((chat: Message, index: number) => {
          if (index % 2 === 0) {
            return (
              <div key={index} className='chat-content'>
                <ReactMarkdown>{chat.message}</ReactMarkdown>
              </div>
            ); 
          } else if (index % 2 !== 0) {
            return (
              <div key={index} className='user-content'>
                <p>{chat.message}</p>
              </div>
            ); 
          }
        })}
      </>
    )
  }; 

  return (
    <div>
      <h1 className="app-name">
        <img src={logo} alt="InterviewBuddy Logo"></img>
      </h1>
      <div className="chat-interface">
        <div className="chat-area">
          <div className="content-wrapper">
            <div className="messages-container">
            <QuestionsComponent updateChatArray={updateChatArray} onStateChange={handleQuestionsComponentState}/>
            {renderFullChat()}
          </div>
        </div>
        <div className="user-area">
          <div className="textarea-wrapper">
            <textarea className="user-textarea" value={userResponse} onChange={handleChange} placeholder='Reply to Buddy...'></textarea>
          </div>
          <div className="button-wrapper">
            <button className="send-button" 
              onClick={() => setReadyToSendResponse(true)}
              onMouseEnter={() => setIsSendButtonHovered(true)}
              onMouseLeave={() => setIsSendButtonHovered(false)}>
              <FaArrowUp style={{fontSize:'1.5em', strokeWidth: '2', backgroundColor: isSendButtonHovered ? '#7c886a' : '#DBEFBC'}}/>
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;




            {/* <div className="user-content">
              <p className="user-content-p">this is just filler text, blah blah blah. this is just filler text, blah blah blah. this is just filler text, blah blah blah. this is just filler text, blah blah blah.</p>
            </div> */}
            {/* <div className="chat-content"> */}
                {/* <div className="algo-header">
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
                </div> */}
            {/* </div> */}
            {/* <div className="user-content">
              <p className="user-content-p">another line of filler text.</p>
            </div> */}