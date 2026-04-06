import React from "react";
import { Composition } from "remotion";
import { BraylenDemo } from "./BraylenDemo";

// Total: 25 seconds @ 30fps = 750 frames
const TOTAL_FRAMES = 750;
const FPS = 30;

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="BraylenDemo"
        component={BraylenDemo}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
