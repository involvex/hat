// Explicit module declarations for static assets.
// react-app-env.d.ts already references react-scripts types which include these,
// but declaring them here removes any ambiguity for the TS language service.

declare module "*.css";
declare module "*.module.css" {
  const classes: Record<string, string>;
  export default classes;
}
declare module "*.png" {
  const src: string;
  export default src;
}
declare module "*.svg" {
  const src: string;
  export default src;
}
declare module "*.jpg" {
  const src: string;
  export default src;
}
declare module "*.gif" {
  const src: string;
  export default src;
}
declare module "*.webp" {
  const src: string;
  export default src;
}
