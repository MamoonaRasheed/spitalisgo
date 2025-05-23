"use client";

import { useState, useEffect } from 'react';

import { showResult } from '@/services/questionService';

const TestResultsPage = ({ progress = 0 }) => {
    const now = new Date();
    const formatted = now.toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
    
    const [results, setResults] = useState({
        userData:{
            name: "",
            email: "",
            total_score: 0,
            total_answers_filled: 0,
        },
        results: [
          {
            task_no: "",
            task_name: "",
            reached: "",
            points: null,
            result: ""
          }
        ]
    });

  // Progress circle settings
  const circleSize = 220;
  const strokeWidth = 12;
  const radius = (circleSize - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (Number(((results.userData.total_score / 240) * 100).toFixed(2)) / 100) * circumference;

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await showResult();
        console.log(response, "response");
        setResults(response);
      } catch (error) {
        console.error('Error fetching results:', error);
      }
    };

    fetchResults();
  }, []);


  return (
    <div className="bg-gray-50 min-h-screen p-2 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-700 text-center mb-6 md:mb-10 mt-30">Ergebnisse "Einstufungstest DaF"</h1>
        
        <div className="flex flex-col md:flex-row gap-8 mb-10">
          {/* Left side: Progress Circle */}
          <div className="flex-1 flex items-center justify-center mb-6 md:mb-0">
            <div className="relative flex items-center justify-center">
              <svg className="transform -rotate-90 w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64" viewBox={`0 0 ${circleSize} ${circleSize}`}>
                {/* Background circle */}
                <circle
                  cx={circleSize / 2}
                  cy={circleSize / 2}
                  r={radius}
                  stroke="#e6e6e6"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                />
                {/* Progress circle */}
                <circle
                  cx={circleSize / 2}
                  cy={circleSize / 2}
                  r={radius}
                  stroke="#60a917" 
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-5xl md:text-5xl lg:text-6xl font-bold">{Number(((results.userData.total_score / 240) * 100).toFixed(2))}%</span>
                <span className="text-xl md:text-2xl text-green-600">Bestanden</span>
              </div>
            </div>
          </div>
          
          {/* Right side: Information Card */}
          <div className="flex-1 bg-white rounded-lg shadow-md border border-gray-200 p-4 md:p-6">
            <div className="grid grid-cols-2 gap-2 md:gap-4 text-sm md:text-base">
              <div className="text-gray-700 font-medium">Datum/Uhrzeit:</div>
              <div className="font-bold break-words">{formatted}</div>
              
              <div className="text-gray-700 font-medium">Benutzer ID:</div>
              <div className="font-bold break-words">{results.userData.name.charAt(0).toUpperCase() + results.userData.name.slice(1)}</div>
              
              <div className="text-gray-700 font-medium">Email:</div>
              <div className="font-bold break-words">{results.userData.email}</div>
              
              <div className="text-gray-700 font-medium">Beantwortet:</div>
              <div className="font-bold break-words">{results.userData.total_answers_filled} / 64</div>
              
              <div className="text-gray-700 font-medium">Ihre Punktzahl:</div>
              <div className="font-bold break-words">{results.userData.total_score} / 240 ({Number(((results.userData.total_score / 240) * 100).toFixed(2))}) %</div>
              
              {/* <div className="text-gray-700 font-medium">Required score:</div>
              <div className="font-bold break-words">{results.userData.requiredScore}</div> */}
            </div>
          </div>
        </div>
        
        {/* Questions Table */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Fragen</h2>
          <div className="bg-white shadow-md rounded-lg overflow-x-auto">
            <div className="min-w-full">
              {/* Desktop view */}
              <table className="min-w-full divide-y divide-gray-200 hidden md:table">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">#</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Frage</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Erreicht</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Punkte</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Ergebnis</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.results.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-700">
                        {index + 1}.
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        <div dangerouslySetInnerHTML={{ __html: item.task_name }} />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-center">
                        {item.reached || "0"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-center">
                        {item.points || "4"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        {item.result === "tick" ? (
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-green-100 text-green-600 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-red-100 text-red-600 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Mobile view */}
              <div className="md:hidden">
                {results.results.map((item, index) => (
                  <div key={index} className="border-b border-gray-200 p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-700">{index + 1}.</span>
                      <div className="flex space-x-2 items-center">
                        <div className="flex flex-col items-end">
                          <div className="flex space-x-2">
                            <span className="text-xs text-gray-500">Reached:</span>
                            <span className="text-xs font-medium">{item.reached || "0"}</span>
                          </div>
                          <div className="flex space-x-2">
                            <span className="text-xs text-gray-500">Points:</span>
                            <span className="text-xs font-medium">{item.points || "4"}</span>
                          </div>
                        </div>
                        <div>
                          {item.result === "tick" ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-red-100 text-red-600 rounded-full">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-800">
                      <div dangerouslySetInnerHTML={{ __html: item.task_name }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Demo with a progress value of 0%
export default () => <TestResultsPage progress={0} />;