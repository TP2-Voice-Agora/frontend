import React from "react";
import { Badge } from "../../../../components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";

export const IdeasByAnima = (): JSX.Element => {
  // Data for ideas to make the code more maintainable
  const ideas = [
    {
      id: 1,
      title: "IDEA 1",
      date: "10.05.2025",
      likes: 1,
      dislikes: 1,
      tags: [{ text: "Срочное", color: "#0056d2" }],
      bgColor: "bg-white",
      textColor: "text-black",
    },
    {
      id: 2,
      title: "IDEA 2",
      date: "11.05.2025",
      likes: 10,
      dislikes: 1,
      tags: [
        { text: "Срочное", color: "#0056d2" },
        { text: "Бюджет", color: "#0056d2" },
        { text: "Креатив", color: "#0056d2" },
        { text: "Долгосрочное", color: "#0056d2" },
        { text: "Эксперимент", color: "#0056d2" },
        { text: "Перспективное", color: "#0056d2" },
      ],
      bgColor: "bg-light-themepuregreen",
      textColor: "text-white",
    },
    {
      id: 3,
      title: "IDEA 3",
      date: "12.05.2025",
      likes: 1,
      dislikes: 10,
      tags: [
        { text: "Срочное", color: "#0056d2" },
        { text: "Бюджет", color: "#0056d2" },
        { text: "Креатив", color: "#0056d2" },
      ],
      bgColor: "bg-light-themepurered",
      textColor: "text-white",
    },
    {
      id: 4,
      title: "IDEA 4",
      date: "13.05.2025",
      likes: 2,
      dislikes: 1,
      tags: [
        { text: "Эксперимент", color: "#0056d2" },
        { text: "Перспективное", color: "#0056d2" },
      ],
      bgColor: "bg-[#f2f2f7]",
      textColor: "text-black",
    },
  ];

  return (
    <section className="w-full px-5 py-[150px]">
      <div className="flex flex-col gap-5">
        {ideas.map((idea, index) => (
          <Card
            key={idea.id}
            className={`w-full ${idea.bgColor} rounded-lg shadow-[0px_2px_6px_#00000033] ${index === 0 ? "h-[130px]" : "h-[170px]"}`}
          >
            <CardHeader className="pb-0 pt-[18px]">
              <CardTitle
                className={`${idea.textColor} text-[35px] font-bold font-['Inter',Helvetica] tracking-[0] leading-normal`}
              >
                {idea.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-0">
              <div className="flex flex-wrap gap-2 mt-2">
                {idea.tags.map((tag, tagIndex) => (
                  <Badge
                    key={tagIndex}
                    className="bg-[#0056d2] text-white text-[10px] font-normal font-['Inter',Helvetica] px-[47px] py-[7px] h-[15px] rounded-lg"
                  >
                    {tag.text}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between mt-auto">
              <div className="flex items-center">
                <img className="w-10 h-9" alt="Like" src="/like.svg" />
                <span
                  className={`${idea.textColor} text-xl font-normal font-['Inter',Helvetica] mx-1`}
                >
                  {idea.likes}
                </span>
                <img className="w-10 h-9" alt="Dislike" src="/dislike.svg" />
                <span
                  className={`${idea.textColor} text-xl font-normal font-['Inter',Helvetica] mx-1`}
                >
                  {idea.dislikes}
                </span>
              </div>
              <div
                className={`${idea.textColor} text-xl font-normal font-['Inter',Helvetica]`}
              >
                {idea.date}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};
