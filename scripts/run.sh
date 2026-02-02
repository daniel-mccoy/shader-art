#!/bin/bash
# Run main.frag at 1280x720

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

glslviewer "$PROJECT_DIR/shaders/main.frag" -w 1280 -h 720
