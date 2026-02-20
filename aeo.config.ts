// AEO Kit configuration
//
// AEO Kit does NOT expose endpoints automatically.
// You must opt in by adding `x-aeo-expose: true` to each operation
// in your OpenAPI spec that you want available to AI agents.
//
// After configuring, run:
//   aeo build --openapi <path>
//   aeo check                       # enforce policies in CI

export default {
  openapi: {
    // Path to your OpenAPI spec (YAML or JSON)
    path: "./openapi.yaml",
  },
  // policy: {
  //   requireExposedMin: 1,
  //   denyToolIds: [],
  //   requireTrustForWrite: false,
  //   requireAuthForWrite: false,
  //   requireRateLimitForWrite: false,
  //   requireClassificationForWrite: false,
  // },
};
