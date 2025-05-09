import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ALL_CANDIDATES } from '../config/api';
import * as XLSX from 'xlsx';
import { FaSortAmountDownAlt, FaSortAmountUpAlt, FaFileDownload } from 'react-icons/fa';

export default function AllCandidates() {
  const [candidates, setCandidates] = useState([]);
  const [sortedCandidates, setSortedCandidates] = useState([]);
  const [sortOrderAsc, setSortOrderAsc] = useState(true);

  useEffect(() => {
    axios.get(ALL_CANDIDATES)
      .then((response) => {
        setCandidates(response.data);
        setSortedCandidates(response.data);
      })
      .catch((error) => {
        console.error("Error fetching candidates:", error);
      });
  }, []);

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(sortedCandidates);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Candidates");
    XLSX.writeFile(workbook, "candidates.xlsx");
  };

  const handleSortByScore = () => {
    const sorted = [...sortedCandidates].sort((a, b) => {
      const scoreA = parseFloat(a.score) || 0;
      const scoreB = parseFloat(b.score) || 0;
      return sortOrderAsc ? scoreA - scoreB : scoreB - scoreA;
    });
    setSortedCandidates(sorted);
    setSortOrderAsc(!sortOrderAsc);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">All Candidates</h2>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <button
          onClick={handleSortByScore}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg shadow-sm transition"
        >
          {sortOrderAsc ? <FaSortAmountUpAlt className="text-lg" /> : <FaSortAmountDownAlt className="text-lg" />}
          Sort by Score
        </button>

        <button
          onClick={handleDownload}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition"
        >
          <FaFileDownload className="text-lg" />
          Download XLSX
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
          <thead className="bg-gray-100 text-gray-700 text-left">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Score (Out of 30)</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sortedCandidates.map((candidate, index) => (
              <tr key={candidate.id || index} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 text-gray-600">{index + 1}</td>
                <td className="px-4 py-3 font-medium">{candidate.name}</td>
                <td className="px-4 py-3 text-gray-700">{candidate.email}</td>
                <td className="px-4 py-3">{candidate.score || 'N/A'}/30</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    candidate.status === 'Approved'
                      ? 'bg-green-100 text-green-700'
                      : candidate.status === 'Rejected'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {candidate.status || 'Pending'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sortedCandidates.length === 0 && (
          <p className="text-center text-gray-500 py-6">No candidates found.</p>
        )}
      </div>
    </div>
  );
}
