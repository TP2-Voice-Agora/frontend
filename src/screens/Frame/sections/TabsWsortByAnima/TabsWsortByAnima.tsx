import { ArrowUpIcon } from "lucide-react";
import React from "react";
import { Button } from "../../../../components/ui/button";

export const TabsWsortByAnima = (): JSX.Element => {
  // Data for tab buttons
  const tabButtons = [
    {
      id: 1,
      label: "Всdsa идеи",
      active: true,
      className: "bg-light-themeblue text-white",
    },
    {
      id: 2,
      label: "Одобренные идеи",
      active: false,
      className: "border-[#70c170]",
    },
    {
      id: 3,
      label: "Отклоненные идеи",
      active: false,
      className: "border-[#ff6b6b]",
    },
    {
      id: 4,
      label: "Нейтральные идеи",
      active: false,
      className: "border-[#d1d1d1]",
    },
  ];

  // Data for sort options
  const sortOptions = [
    { id: 1, label: "Дате создания", width: "200px" },
    { id: 2, label: "Категориям", width: "179px" },
  ];

  return (
    <div className="w-full h-[50px] bg-light-themelightgrey flex items-center px-[100px]">
      <div className="flex space-x-[100px]">
        {tabButtons.map((tab) => (
          <Button
            key={tab.id}
            variant="outline"
            className={`w-[150px] h-10 rounded-[10px] shadow-[0px_2px_6px_#00000033] flex items-center justify-center ${
              tab.active ? tab.className : `border ${tab.className}`
            }`}
          >
            <span className="font-normal text-[15px] [font-family:'Inter',Helvetica] tracking-[0] leading-[normal] whitespace-nowrap">
              {tab.label}
            </span>
          </Button>
        ))}
      </div>

      <div className="ml-auto flex items-center">
        <span className="font-bold text-light-themeblue text-base [font-family:'Inter',Helvetica] tracking-[0] leading-[normal] whitespace-nowrap mr-4">
          Сортировать по:
        </span>

        {sortOptions.map((option) => (
          <div
            key={option.id}
            className={`h-10 bg-light-themegrey rounded-[10px] overflow-hidden flex items-center px-[22px] ml-4`}
            style={{ width: option.width }}
          >
            <img
              className="w-[18px] h-[18px]"
              alt="Iconamoon arrow up"
              src="/iconamoon-arrow-up-1-thin.svg"
            />
            <span className="font-medium text-light-themeblue text-[15px] [font-family:'Inter',Helvetica] tracking-[0] leading-[normal] whitespace-nowrap ml-[5px]">
              {option.label}
            </span>
            <ArrowUpIcon className="w-[18px] h-[18px] ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
};
