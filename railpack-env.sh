#!/usr/bin/env bash
# Outputs all required environment variables as --env flags for railpack build.
# Usage: railpack build $(./railpack-env.sh)
# Or:    source this script's output into your build command.

set -euo pipefail

# All env vars used by the app (from src/env.js)
ENV_VARS=(
  NODE_ENV
  BOT_API_URL
  DATABASE_URL
  DISCORD_CLIENT_ID
  DISCORD_CLIENT_SECRET
  BETTER_AUTH_SECRET
  BOT_API_SECRET
  NEXT_PUBLIC_DISCORD_INVITE_URL
  SKIP_ENV_VALIDATION
)

args=""
for var in "${ENV_VARS[@]}"; do
  val="${!var:-}"
  if [ -n "$val" ]; then
    args+=" --env ${var}=${val}"
  fi
done

# Always skip env validation during build
if [[ "$args" != *"SKIP_ENV_VALIDATION"* ]]; then
  args+=" --env SKIP_ENV_VALIDATION=1"
fi

echo "$args"
