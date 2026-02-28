#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/svelte-frontend"
UV_CACHE_DIR_DEFAULT="$BACKEND_DIR/.uv-cache"

if ! command -v uv >/dev/null 2>&1; then
	echo "Missing required command: uv"
	exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
	echo "Missing required command: npm"
	exit 1
fi

backend_pid=""
frontend_pid=""

cleanup() {
	local exit_code=$?
	if [[ -n "${backend_pid}" ]] && kill -0 "${backend_pid}" 2>/dev/null; then
		kill "${backend_pid}" 2>/dev/null || true
	fi
	if [[ -n "${frontend_pid}" ]] && kill -0 "${frontend_pid}" 2>/dev/null; then
		kill "${frontend_pid}" 2>/dev/null || true
	fi
	wait 2>/dev/null || true
	exit "${exit_code}"
}

trap cleanup EXIT INT TERM

export UV_CACHE_DIR="${UV_CACHE_DIR:-$UV_CACHE_DIR_DEFAULT}"
mkdir -p "$UV_CACHE_DIR"

echo "Starting backend: http://localhost:8000"
(
	cd "$BACKEND_DIR"
	exec uv run uvicorn app.main:app --reload
) &
backend_pid=$!

echo "Starting frontend: http://localhost:5173"
(
	cd "$FRONTEND_DIR"
	exec npm run dev
) &
frontend_pid=$!

echo "Services running. Press Ctrl+C to stop both."
wait -n "$backend_pid" "$frontend_pid"
