import React from "react";
import { AppbarByAnima } from "./sections/AppbarByAnima";
import { IdeasByAnima } from "./sections/IdeasByAnima/IdeasByAnima";
import { TabsWsortByAnima } from "./sections/TabsWsortByAnima";

export const Frame = (): JSX.Element => {
  return (
    <div className="bg-white flex flex-col w-full min-h-screen">
      <AppbarByAnima />
      <TabsWsortByAnima />
      <IdeasByAnima />
    </div>
  );
};
