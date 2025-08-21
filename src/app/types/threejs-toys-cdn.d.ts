declare module "https://unpkg.com/threejs-toys@0.0.8/build/threejs-toys.module.cdn.min.js" {
  export const neonCursor: (options: {
    el: HTMLElement;
    shaderPoints?: number;
    curvePoints?: number;
    curveLerp?: number;
    radius1?: number;
    radius2?: number;
    velocityTreshold?: number;
    sleepRadiusX?: number;
    sleepRadiusY?: number;
    sleepTimeCoefX?: number;
    sleepTimeCoefY?: number;
  }) => { destroy?: () => void } | any;
}

