import React from "react";
import { Button } from "../../../../components/ui/button";

export const AppbarByAnima = (): JSX.Element => {
  return (
    <header className="w-full h-[60px] bg-light-themelightgrey flex items-center justify-between px-[22px]">
      <Button
        variant="default"
        className="h-9 w-[175px] bg-white text-black hover:bg-white/90 rounded-[10px]"
      >
        <span className="font-normal text-xl [font-family:'Inter',Helvetica]">
          LOGO
        </span>
      </Button>

      <div className="flex gap-4">
        <Button
          variant="default"
          className="h-9 w-[175px] bg-light-themeblue text-white hover:bg-light-themeblue/90 rounded-[10px]"
        >
          <span className="font-normal text-xl [font-family:'Inter',Helvetica]">
            Создать идею
          </span>
        </Button>

        <Button
          variant="outline"
          className="h-9 w-[175px] border-light-themeblue text-light-themeblue hover:bg-light-themeblue/10 rounded-[10px]"
        >
          <span className="font-normal text-xl [font-family:'Inter',Helvetica]">
            Профиль
          </span>
        </Button>
      </div>
    </header>
  );
};
