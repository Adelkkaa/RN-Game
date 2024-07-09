import { Canvas, Group, Image, useImage } from "@shopify/react-native-skia";
import { useEffect } from "react";
import { useWindowDimensions } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import {
  Easing,
  Extrapolation,
  interpolate,
  useDerivedValue,
  useFrameCallback,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const GRAVITY = 1000;

const JUMP_FORCE = -500;

export default function MainPage() {
  const { width, height } = useWindowDimensions();

  const bg = useImage(require("@/assets/sprites/background-day.png"));
  const bird = useImage(require("@/assets/sprites/yellowbird-upflap.png"));
  const pipeBottom = useImage(require("@/assets/sprites/pipe-green.png"));
  const pipeTop = useImage(require("@/assets/sprites/pipe-green-top.png"));
  const base = useImage(require("@/assets/sprites/base.png"));

  const x = useSharedValue(width);

  const birdY = useSharedValue(height / 2);
  const birdYVelocity = useSharedValue(0);

  const birdTransform = useDerivedValue(() => {
    return [
      {
        rotate: interpolate(
          birdYVelocity.value,
          [-500, 500],
          [-0.5, 0.5],
          Extrapolation.CLAMP,
        ),
      },
    ];
  });
  const birdOrigin = useDerivedValue(() => {
    return { x: width / 4 + 32, y: birdY.value + 24 };
  });

  useFrameCallback(({ timeSincePreviousFrame: dt }) => {
    if (!dt) {
      return;
    }
    birdY.value += (birdYVelocity.value * dt) / 1000;
    birdYVelocity.value += (GRAVITY * dt) / 1000;
  });

  useEffect(() => {
    x.value = withRepeat(
      withSequence(
        withTiming(-150, { duration: 3000, easing: Easing.linear }),
        withTiming(width, { duration: 0 }),
      ),
      -1,
    );
  });

  const pipeOffset = 0;

  const gesture = Gesture.Tap().onStart(() => {
    birdYVelocity.value = JUMP_FORCE;
  });
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={gesture}>
        <Canvas style={{ width, height }}>
          {/* Background */}
          <Image image={bg} width={width} height={height} fit="cover" />
          {/* Pipes */}
          <Image
            image={pipeTop}
            y={pipeOffset - 320}
            x={x}
            width={103}
            height={640}
          />
          <Image
            image={pipeBottom}
            y={height - 320 + pipeOffset}
            x={x}
            width={103}
            height={640}
          />
          <Image
            image={base}
            width={width}
            height={150}
            y={height - 75}
            x={0}
            fit="cover"
          />
          {/* Bird */}
          <Group transform={birdTransform} origin={birdOrigin}>
            <Image
              image={bird}
              y={birdY}
              x={width / 4}
              width={64}
              height={48}
            />
          </Group>
        </Canvas>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}