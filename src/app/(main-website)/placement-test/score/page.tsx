"use client";
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { showResult } from '@/services/questionService';

export default function Score() {
    const router = useRouter();
    const data = [
    { points: '00-48 Punkte', level: 'GER-Niveau A1' },
    { points: '49-96 Punkte', level: 'GER-Niveau A2' },
    { points: '97-144 Punkte', level: 'GER-Niveau B1' },
    { points: '145-192 Punkte', level: 'GER-Niveau B2' },
    { points: '193-240 Punkte', level: 'GER-Niveau C1' }
  ];
const [results, setResults] = useState({
        userData:{
            name: "",
            email: "",
            total_score: 0,
            total_score_percentage:0,
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
        <section className="header-space section-space">
            <div className="container">
                <h1 className="main-heading">Testergebnis</h1>
                <p>Herzlichen Dank, Sie haben den niveauübergreifenden Einstufungstest DaF durchgeführt.</p>
                <p className="p-6">Ihr Ergebnis:  <span className="px-6 font-bold">{results.userData.total_score_percentage}% {results.userData.total_score} Punkte</span></p>
                <div className="performance-table mb-8">
                    <div className="overflow-x-auto shadow-lg rounded-lg">
                        <table className="w-full border-collapse bg-white">
                            <thead>
                                <tr style={{backgroundColor: '#fff0d6', color: '#000000'}}>
                                    <th className="border border-gray-300 px-6 py-3 text-left font-semibold">
                                        Ergebnis
                                    </th>
                                    <th className="border border-gray-300 px-6 py-3 text-left font-semibold">
                                        Niveau
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row, index) => (
                                    <tr
                                        key={index}
                                        className={`transition-colors duration-200`}
                                        style={{backgroundColor: '#fff8e8', color: '#000000'}}
                                    >
                                        <td className="border border-gray-300 px-6 py-4 font-medium text-gray-900">
                                            {row.points}
                                        </td>
                                        <td className="border border-gray-300 px-6 py-4 text-gray-700">
                                            {row.level}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <p >In der Ergebnisübersicht sehen Sie, welche Aufgaben Sie mit welchem Ergebnis bearbeitet haben. Diese Übersicht können Sie sich ausdrucken.</p>
                
                <button type="button" className="styled-button mt-4 mb-4" onClick={() => router.push('/placement-test/correct_answers')}>ERGEBNISÜBERSICHT</button>
                <p>Außerdem können Sie sich die Detailauswertung Ihres Tests sowie die richtigen Lösungen anzeigen lassen.</p>
                <button type="button" className="styled-button mt-4 mb-4" onClick={() => router.push('/placement-test/result')}>DETAILAUSWERTUNG</button>
                
            </div>
        </section>
    );
}
