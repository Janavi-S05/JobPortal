// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
const Sentry = require("@sentry/node");
const { nodeProfilingIntegration } = require("@sentry/profiling-node");

Sentry.init({
  dsn: "https://ffab1984ad8f266039c2f6f286a37502@o4509178080395264.ingest.us.sentry.io/4509178092650496",
  integrations: [
    nodeProfilingIntegration(),
    Sentry.mongooseIntegration()
  ],
  // tracesSampleRate: 1.0,
});
  
Sentry.profiler.startProfiler();

Sentry.startSpan({
  name:"First transaction",
},()=>{

});

Sentry.profiler.startProfiler();