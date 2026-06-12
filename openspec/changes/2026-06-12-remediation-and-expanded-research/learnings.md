# Learnings: Remediation and Expanded Research

## Nomenclature Consistency
- Transitioning from technical/operator-grade terminology (e.g., 'NOMINAL') to product-centric language (e.g., 'READY') improves user trust and accessibility.
- Centralizing status logic in 'StatusIndicator' ensures these changes apply across the application.

## Cross-Repo Traceability
- Linear issues often reference multiple repositories. Auditing these issues requires tracing PR numbers and identifiers across the ecosystem (e.g., conxius-platform vs conxian_ui).
- Even when no local code changes are required, documenting the audit in OpenSpec provides valuable context for future maintainers.

## Research as a Foundation
- Using Context7 to understand the underlying protocol (sBTC, BOLT) helps identify potential UI requirements, such as handling long confirmation times or specific error states.

## Deployment Hardening
- Render environments require explicit IPv4 binding for 'serve' to avoid 'Unknown --listen endpoint scheme' or port scan timeouts.
- Using 'tcp://0.0.0.0:${PORT}' ensures the server is reachable on the correct interface and port provided by Render.
