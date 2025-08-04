#!/bin/bash

# Load GitHub token from .secrets file
if [ -f .secrets ]; then
    source .secrets
    
    # Check if token is set
    if [ -z "$GITHUB_TOKEN" ]; then
        echo "Error: GITHUB_TOKEN not found in .secrets file"
        exit 1
    fi
    
    # Get current branch
    BRANCH=$(git rev-parse --abbrev-ref HEAD)
    
    # Push using token
    git push https://${GITHUB_TOKEN}@github.com/c2s-admin/frontend-zweitmeinu-ng.git $BRANCH "$@"
else
    echo "Error: .secrets file not found"
    echo "Please create .secrets file with: GITHUB_TOKEN=your_token_here"
    exit 1
fi