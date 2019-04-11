import { Detector } from "./Detector";

export type DetectorsMap<S> = { [K in keyof S]?: Detector<S[K]> };
