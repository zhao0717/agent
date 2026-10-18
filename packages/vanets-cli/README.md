# vanets-cli

Vanets command line client.

First-stage scope:

- remote management through `~/.vanets/config.toml`
- browser login
- API Key import through `--api-key`
- `whoami`, `status`, and `logout`
- server discovery and compatibility check for Vanets `>=0.7.1`
- `vanets chat` for a temporary local browser chat with streamed Agent output; `/state` reads thread state and `/approve` resumes a pending tool approval
- `vanets agent list` and `vanets agent show <slug>` for inspecting agents visible to the logged-in user
- `vanets kb upload` for knowledge base file uploads
- `vanets agent eval` for running existing Langfuse dataset experiments with a logged-in remote
