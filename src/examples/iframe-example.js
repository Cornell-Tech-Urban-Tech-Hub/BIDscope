// Example iframe configuration file

export const url = "https://example.com";
export const width = "800px";
export const height = "600px";
export const title = "Example Website";
export const allowFullscreen = true;
export const sandbox = "allow-scripts allow-same-origin allow-forms";

export default {
  url,
  width,
  height,
  title,
  allowFullscreen,
  sandbox,
  // You can also add custom styles
  style: {
    border: "1px solid #ccc",
    borderRadius: "4px"
  }
};
