"use client";

import React from "react";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
import { CheckCircle, HeartIcon } from "lucide-react";

export function ThreeDCardDemo({ title, discpriction, poster , likes}) {
  return (
    <CardContainer className="inter-var">
      <CardBody
        className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/10 dark:bg-black dark:border-white/20 border-black/10 w-auto sm:w-120 h-auto rounded-xl p-6 border  ">
        <CardItem
          translateZ="50"
          className="text-xl font-bold text-neutral-600 dark:text-white">
          {title}
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300">
          {discpriction}
        </CardItem>
        <CardItem translateZ="100" className="w-full mt-4">
          <img
            src={poster}
            height="900"
            width="900"
            className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
            alt="thumbnail" />
        </CardItem>
        <div className="flex justify-between items-center mt-10">
          <CardItem
            translateZ={20}
            as="a"
            href="https://twitter.com/mannupaaji"
            target="__blank"
            className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white flex items-center justify-center gap-1"
          >
            <HeartIcon size={15} fill="red"/> 
            <p>{likes} Likes</p>
          </CardItem>
          <CardItem
            translateZ={20}
            as="button"
            className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold flex items-center justify-center gap-1"
          >
            <CheckCircle size={15} />
            <p>Verify</p>
          </CardItem>
        </div>

      </CardBody>
    </CardContainer>
  );
}
