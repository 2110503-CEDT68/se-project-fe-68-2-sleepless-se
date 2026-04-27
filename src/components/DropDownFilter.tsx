"use client";
import { useState } from "react";
import { Hotel } from "../../interface";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function DropDownFilter({
  FilterBy,
  onOptionSelect,
  openBy,
  isMulti,
  ObjectList,
  value,
}: {
  FilterBy: string;
  onOptionSelect: (item: string) => void;
  openBy: (openBy: string) => void;
  isMulti: boolean;
  ObjectList: string[];
  value: string;
}) {
  const mockOptions = [...new Set(ObjectList)].sort();

  return (
    <div className="flex flex-col gap-2">
      {/* header */}
      <div className="">{FilterBy}</div>
      {/* dropdown */}
      <div className="relative cursor-pointer">
        {/* กล่อง filter */}
        <div
          className="bg-blue-200/50 rounded-md p-2 transition-colors hover:bg-blue-200"
          onClick={() => {
            openBy(isMulti ? "" : FilterBy);
          }}
        >
          <div className="flex flex-row justify-between items-center">
            <div>{value}</div>
            <ChevronDown
              className={`transition-transform duration-300 ease-in-out ${
                isMulti ? "rotate-180" : "rotate-0"
              }`}
            />
          </div>
        </div>
        {/* list filter */}
        {isMulti && (
          <div className="bg-white absolute z-50 shadow-lg w-full ">
            {mockOptions.map((option) => (
              <div
                key={option}
                className="hover:bg-gray-100 transition-colors cursor-pointer p-2"
                onClick={() => {
                  openBy("");
                  onOptionSelect(option);
                }}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
