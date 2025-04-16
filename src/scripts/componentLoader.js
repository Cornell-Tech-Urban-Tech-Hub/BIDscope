// Create this file to handle dynamic component loading

export async function loadComponent(componentPath) {
  try {
    // Use the import() function to dynamically load the component
    // Remove the "src/" prefix since imports are relative to src directory
    const normalizedPath = componentPath.replace(/^src\//, '../');
    const module = await import(/* @vite-ignore */ normalizedPath);
    return module.default;
  } catch (error) {
    console.error(`Failed to load component: ${componentPath}`, error);
    return null;
  }
}