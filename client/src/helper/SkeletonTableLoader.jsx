import React from "react";

const SkeletonTableLoader = ({ rows = 5, columns = 7, duration = 2 }) => {
  return (
    <tbody>
      {[...Array(rows)].map((_, rowIndex) => (
        <tr key={rowIndex} className="bg-white border-b">
          {[...Array(columns)].map((_, colIndex) => (
            <td key={colIndex} className="px-6 py-4">
              <div
                className="h-4 bg-gray-200 rounded animate-pulse"
                style={{ animationDuration: `${duration}s` }}
              ></div>
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

export default SkeletonTableLoader;
