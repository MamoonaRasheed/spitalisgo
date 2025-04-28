"use client";
import React from "react";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import { ChevronDownIcon } from "@/icons";
import Input from '@/components/form/input/InputField';
import RadioButtons from "@/components/form/form-elements/RadioButtons";



export default function AddChapter() {
    const options = [
        { value: "marketing", label: "Marketing" },
        { value: "template", label: "Template" },
        { value: "development", label: "Development" },
    ];

    // const [selectedValues, setSelectedValues] = useState<string[]>([]);

    const handleSelectChange = (value: string) => {
        console.log("Selected value:", value);
    };
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
            <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
                Add Chapter
            </h3>

            {/* Select Fields Row */}
            <div className="flex gap-20 mx-9 mb-8">
                <div className="flex-1">
                    <Label>Select Exam</Label>
                    <div className="relative">
                        <Select
                            options={options}
                            placeholder="Select Option"
                            onChange={handleSelectChange}
                            className="dark:bg-dark-900"
                        />
                        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                            <ChevronDownIcon />
                        </span>
                    </div>
                </div>

                <div className="flex-1">
                    <Label>Select Course</Label>
                    <div className="relative">
                        <Select
                            options={options}
                            placeholder="Select Option"
                            onChange={handleSelectChange}
                            className="dark:bg-dark-900"
                        />
                        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                            <ChevronDownIcon />
                        </span>
                    </div>
                </div>

                <div className="flex-1">
                    <Label>Select Category</Label>
                    <div className="relative">
                        <Select
                            options={options}
                            placeholder="Select Option"
                            onChange={handleSelectChange}
                            className="dark:bg-dark-900"
                        />
                        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                            <ChevronDownIcon />
                        </span>
                    </div>
                </div>
            </div>

            {/* Input Fields Row */}
            <div className="flex gap-10 mx-9">
                <div className="flex-1">
                    <Label>Enter Chapter Name</Label>
                    <Input type="text" placeholder="Name" />
                </div>

                <div className="flex-1">
                    <Label>sort</Label>
                    <Input type="text" placeholder="Sort" />
                </div>
            </div>
            <div className="m-9">
                <RadioButtons />
            </div>
        </div>
    );

}
