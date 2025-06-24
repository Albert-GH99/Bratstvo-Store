export default {
  ssgName: "nextjs",
  contentDir: "content/pages",
  models: [
    {
      name: "Page",
      type: "page",
      filePathPattern: "content/pages/*.md",
      fields: [
        { name: "title", type: "string" },
        { name: "body", type: "markdown" }
      ]
    }
  ]
};
